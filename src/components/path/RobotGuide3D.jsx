import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const ROBOT_MODEL_URL = '/models/robotv3.glb?v=3'
const ROBOT_RENDER_SCALE = 14
const ROBOT_MODEL_ROTATION_Y = 0
const ROBOT_BACK_ROTATION_Y = Math.PI
const ROBOT_FACE_SCREEN_Y = ROBOT_BACK_ROTATION_Y
const ROBOT_FACE_AWAY_Y = ROBOT_MODEL_ROTATION_Y
const ROBOT_VERTICAL_OFFSET_RATIO = 0.00175
const ROBOT_MIN_CLEARANCE_RATIO = 0.09
const ROBOT_MIN_CLEARANCE_CENTER_RATIO = 0.05
const ROBOT_CURRENT_NODE_CLEARANCE_MULTIPLIER = 0.78
const ROBOT_SIDE_OFFSET_RATIO = 0.032
const ROBOT_BOUNCE_SPEED = 4.2
const ROBOT_BOUNCE_AMPLITUDE = 0.08
const ROBOT_TURN_SPEED = 3.8
let PERSISTED_FACING_Y = 0
const ROBOT_CORNER_BLEND_RATIO = 0.085
const ROBOT_ARRIVAL_THRESHOLD_RATIO = 0.02
const SHADOW_BIG_BASE_SCALE = [2.816, 1.216, 1]
const SHADOW_SMALL_BASE_SCALE = [1.152, 0.576, 1]
const SHADOW_SMALL_OFFSET_X = 1.35
const ROBOT_GROUP_SCALE_DESKTOP = 0.5
const ROBOT_GROUP_SCALE_MOBILE = 0.25

const lerp = (from, to, t) => from + (to - from) * t
const clampMin = (value, min) => Math.max(min, value)
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle))
const stepAngleToward = (current, target, maxStep) => {
  const delta = normalizeAngle(target - current)
  if (Math.abs(delta) <= maxStep) return normalizeAngle(target)
  return normalizeAngle(current + Math.sign(delta) * maxStep)
}
const toAnchoredWorldPosition = (node, viewport, useCurrentClearance = false) => {
  const centerX = ((node.x / 100) - 0.5) * viewport.width
  const centerY = (0.5 - (node.y / 100)) * viewport.height
  const sideOffset =
    node.side === 'right'
      ? viewport.width * ROBOT_SIDE_OFFSET_RATIO
      : node.side === 'left'
        ? -viewport.width * ROBOT_SIDE_OFFSET_RATIO
        : 0
  const baseX = centerX + sideOffset
  const baseY = centerY + viewport.height * ROBOT_VERTICAL_OFFSET_RATIO
  const dx = baseX - centerX
  const dy = baseY - centerY
  const distance = Math.hypot(dx, dy)
  const clearanceRatio =
    node.side === 'center' ? ROBOT_MIN_CLEARANCE_CENTER_RATIO : ROBOT_MIN_CLEARANCE_RATIO
  const minClearanceBase = Math.min(viewport.width, viewport.height) * clearanceRatio
  const minClearance = useCurrentClearance
    ? minClearanceBase * ROBOT_CURRENT_NODE_CLEARANCE_MULTIPLIER
    : minClearanceBase
  if (distance < minClearance && distance > 0.0001) {
    const scale = minClearance / distance
    return new THREE.Vector3(centerX + dx * scale, centerY + dy * scale, 0)
  }
  if (distance <= 0.0001) {
    return new THREE.Vector3(centerX, centerY + minClearance, 0)
  }
  return new THREE.Vector3(baseX, baseY, 0)
}

function RobotModel({ target, targetKey, onArrive }) {
  const groupRef = useRef(null)
  const spinGroupRef = useRef(null)
  const modelGroupRef = useRef(null)
  const arrivedRef = useRef(null)
  const swayTimeRef = useRef(0)
  const facingYRef = useRef(PERSISTED_FACING_Y)
  const modelGroupPreparedRef = useRef(false)
  const previousPositionRef = useRef(null)
  const shadowGroupRef = useRef(null)
  const shadowBigRef = useRef(null)
  const shadowLeftRef = useRef(null)
  const shadowRightRef = useRef(null)
  const { scene } = useGLTF(ROBOT_MODEL_URL)
  const robotScene = useMemo(() => clone(scene), [scene])
  const { viewport, size } = useThree()
  const groupScale = size.width <= 640 ? ROBOT_GROUP_SCALE_MOBILE : ROBOT_GROUP_SCALE_DESKTOP
  const modelFit = useMemo(() => {
    robotScene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(robotScene)
    const centerWorld = box.getCenter(new THREE.Vector3())
    const centerLocal = robotScene.worldToLocal(centerWorld.clone())
    const size = box.getSize(new THREE.Vector3())
    const sx = Number.isFinite(size.x) && size.x > 0 ? size.x : 1
    const sy = Number.isFinite(size.y) && size.y > 0 ? size.y : 1
    const sz = Number.isFinite(size.z) && size.z > 0 ? size.z : 1
    const maxDim = Math.max(sx, sy, sz, 1e-3)
    const rawFitScale = 0.26 / maxDim
    // Keep only minimum clamp: some GLB files are authored at very tiny units and need larger upscaling.
    const fitScale = clampMin(rawFitScale, 0.02)
    return {
      offset: [
        Number.isFinite(centerLocal.x) ? -centerLocal.x : 0,
        Number.isFinite(centerLocal.y) ? -centerLocal.y : 0,
        0,
      ],
      fitScale,
    }
  }, [robotScene])

  useEffect(() => {
    robotScene.traverse((child) => {
      child.visible = true
      if (child.scale && child.scale.lengthSq() < 1e-8) {
        child.scale.set(1, 1, 1)
      }
      if (child.scale) {
        child.scale.set(Math.abs(child.scale.x), Math.abs(child.scale.y), Math.abs(child.scale.z))
      }
      if (!child.isMesh) return
      child.frustumCulled = false
      child.castShadow = true
      child.receiveShadow = true
      const applyMaterialTuning = (mat) => {
        if (!mat) return
        // Keep source transparency/depth settings from GLB to avoid visibility glitches.
        if ('side' in mat) mat.side = THREE.FrontSide
        if ('transparent' in mat) mat.transparent = false
        if ('opacity' in mat) mat.opacity = 1
        if ('flatShading' in mat) mat.flatShading = false
        if ('metalness' in mat) mat.metalness = Math.min(1, (mat.metalness ?? 0.2) + 0.3)
        if ('roughness' in mat) mat.roughness = Math.max(0.12, (mat.roughness ?? 0.55) - 0.22)
        if ('envMapIntensity' in mat) mat.envMapIntensity = 2.4
        if ('emissiveIntensity' in mat) mat.emissiveIntensity = Math.max(0.22, mat.emissiveIntensity ?? 0)
        if ('clearcoat' in mat) mat.clearcoat = Math.max(0.7, mat.clearcoat ?? 0)
        if ('clearcoatRoughness' in mat) mat.clearcoatRoughness = Math.min(0.2, mat.clearcoatRoughness ?? 0.12)
        if ('sheen' in mat) mat.sheen = Math.max(0.25, mat.sheen ?? 0)
        if ('sheenRoughness' in mat) mat.sheenRoughness = Math.min(0.35, mat.sheenRoughness ?? 0.2)
        if ('needsUpdate' in mat) mat.needsUpdate = true
      }
      if (Array.isArray(child.material)) {
        child.material.forEach(applyMaterialTuning)
      } else {
        applyMaterialTuning(child.material)
      }
    })
  }, [robotScene])

  const targetPosition = toAnchoredWorldPosition(target, viewport, Boolean(target.isCurrentNode))
  const nextTargetPosition = target.next
    ? toAnchoredWorldPosition(target.next, viewport, false)
    : null
  const [initialPosition] = useState(() => targetPosition.toArray())

  useEffect(() => {
    arrivedRef.current = null
  }, [targetKey])

  useEffect(() => {
    previousPositionRef.current = new THREE.Vector3(...initialPosition)
  }, [initialPosition])

  useEffect(() => {
    return () => {
      PERSISTED_FACING_Y = facingYRef.current
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    swayTimeRef.current += delta
    const moveSpeed = 2.8
    const position = groupRef.current.position
    const toTarget = new THREE.Vector3().subVectors(targetPosition, position)
    const distanceToWaypoint = toTarget.length()
    const maxStep = moveSpeed * delta
    if (distanceToWaypoint > maxStep && distanceToWaypoint > 0.0001) {
      toTarget.normalize().multiplyScalar(maxStep)
      position.add(toTarget)
    } else {
      position.copy(targetPosition)
    }
    const isActivelyMoving = distanceToWaypoint > maxStep + 0.0001
    const routeDirection = Number(target.routeDirection || 0)
    const travelDirection = Number(target.travelDirection || 0)

    previousPositionRef.current = position.clone()

    // Keep repeated up-down bounce for all states.
    if (modelGroupRef.current && spinGroupRef.current) {
      if (!modelGroupPreparedRef.current) {
        modelGroupRef.current.rotation.order = 'YXZ'
        modelGroupPreparedRef.current = true
      }
      modelGroupRef.current.position.y =
        modelFit.offset[1] + Math.sin(swayTimeRef.current * ROBOT_BOUNCE_SPEED) * ROBOT_BOUNCE_AMPLITUDE
      const isExistingNodeTarget = Boolean(target.isCurrentNode || target.isExistingNode)
      const movingByRoute = routeDirection !== 0 ? routeDirection : travelDirection
      let desiredFacingY = spinGroupRef.current.rotation.y
      if (isActivelyMoving) {
        // Requirement:
        // - moving to smaller node order: face screen
        // - moving to larger node order: face away
        if (movingByRoute < 0) desiredFacingY = ROBOT_FACE_SCREEN_Y
        if (movingByRoute > 0) desiredFacingY = ROBOT_FACE_AWAY_Y
      } else if (isExistingNodeTarget) {
        // Existing node idle: bounce only, no spin.
        desiredFacingY = ROBOT_FACE_AWAY_Y
      } else if (target.isHoveredNode) {
        desiredFacingY = ROBOT_FACE_AWAY_Y
      }
      const currentFacingY = normalizeAngle(spinGroupRef.current.rotation.y)
      const turnStep = ROBOT_TURN_SPEED * delta
      const nextFacingY = stepAngleToward(currentFacingY, desiredFacingY, turnStep)
      spinGroupRef.current.rotation.y = nextFacingY
      if (shadowGroupRef.current) {
        shadowGroupRef.current.rotation.y = nextFacingY
      }
      facingYRef.current = nextFacingY
      PERSISTED_FACING_Y = nextFacingY
    }

    // Disable z sway during spin verification to avoid visual "back-and-forth" illusion.
    groupRef.current.rotation.z = 0

    if (shadowGroupRef.current && shadowBigRef.current && shadowLeftRef.current && shadowRightRef.current) {
      const shadowBlend = Math.min(1, delta * 12)
      const targetOpacity = 0.35
      const targetBigScale = SHADOW_BIG_BASE_SCALE
      const targetSmallScale = SHADOW_SMALL_BASE_SCALE
      shadowGroupRef.current.position.y = lerp(shadowGroupRef.current.position.y, -0.17, shadowBlend)
      ;[shadowBigRef.current, shadowLeftRef.current, shadowRightRef.current].forEach((mesh, index) => {
        const scale = index === 0 ? targetBigScale : targetSmallScale
        mesh.scale.x = lerp(mesh.scale.x, scale[0], shadowBlend)
        mesh.scale.y = lerp(mesh.scale.y, scale[1], shadowBlend)
        mesh.material.opacity = lerp(mesh.material.opacity, targetOpacity, shadowBlend)
      })
    }
    const cornerBlendDistance = Math.min(viewport.width, viewport.height) * ROBOT_CORNER_BLEND_RATIO
    const arrivalThresholdBase = Math.max(
      maxStep + 0.0001,
      Math.min(viewport.width, viewport.height) * ROBOT_ARRIVAL_THRESHOLD_RATIO
    )
    const arrivalThreshold = nextTargetPosition
      ? Math.max(arrivalThresholdBase, cornerBlendDistance * 0.5)
      : arrivalThresholdBase
    if (distanceToWaypoint <= arrivalThreshold && arrivedRef.current !== targetKey) {
      arrivedRef.current = targetKey
      onArrive?.(targetKey)
    }
  })

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      scale={[groupScale, groupScale, groupScale]}
    >
      <group ref={shadowGroupRef} position={[0, -0.17, -0.02]}>
        <mesh ref={shadowBigRef} scale={SHADOW_BIG_BASE_SCALE}>
          <circleGeometry args={[0.34, 28]} />
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.35}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          ref={shadowLeftRef}
          position={[-SHADOW_SMALL_OFFSET_X, -0.02, 0]}
          scale={SHADOW_SMALL_BASE_SCALE}
        >
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.35}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          ref={shadowRightRef}
          position={[SHADOW_SMALL_OFFSET_X, -0.02, 0]}
          scale={SHADOW_SMALL_BASE_SCALE}
        >
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.35}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <group ref={spinGroupRef}>
        <group
          ref={modelGroupRef}
          position={modelFit.offset}
          scale={[
            modelFit.fitScale * ROBOT_RENDER_SCALE,
            modelFit.fitScale * ROBOT_RENDER_SCALE,
            modelFit.fitScale * ROBOT_RENDER_SCALE,
          ]}
        >
          <primitive object={robotScene} dispose={null} />
        </group>
      </group>
    </group>
  )
}

function RobotFallback() {
  return null
}

function RobotGuide3D({ target, targetKey, onArrive }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
      <Canvas
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault()
            },
            false
          )
        }}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 58 }}
      >
        <ambientLight intensity={1.05} />
        <directionalLight position={[4, 6, 8]} intensity={1.75} color="#fff7ed" />
        <directionalLight position={[-5, 4, 7]} intensity={1.25} color="#dbeafe" />
        <directionalLight position={[0, -4, 6]} intensity={0.95} color="#bbf7d0" />
        <pointLight position={[0, 0, 5]} intensity={1.2} color="#ffffff" />
        <Suspense
          fallback={
            <RobotFallback
              target={target}
              targetKey={targetKey}
              onArrive={onArrive}
            />
          }
        >
          <RobotModel
            target={target}
            targetKey={targetKey}
            onArrive={onArrive}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default RobotGuide3D

useGLTF.preload(ROBOT_MODEL_URL)


