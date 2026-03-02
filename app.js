const PROGRESS_KEY = "linus3m_progress_v1";

let tracksCache = [];
let lessonsCache = [];
let checkpointsCache = {};
let confettiCleanupTimer = null;
let trackResizeDebounceTimer = null;
let trackResizeHandler = null;
let toastTimer = null;
const UI_STAMP_KEY = "linus3m_ui_last_done";

const MASCOT_TIPS = [
  "Hebat! Teruskan!",
  "Jom buat lagi!",
  "Bijak sungguh hari ini!",
  "Sikit lagi boleh siap!",
  "Mantap! Bintang menanti!",
];

const TRACK_HUD_TIPS = [
  "Sikit lagi boleh siap!",
  "Jom kumpul bintang ⭐",
  "Hebat! Teruskan 😊",
  "Cuba satu lagi level!",
  "You can do it!",
];

const DEFAULT_MAP_IMAGE_SIZE = Object.freeze({
  width: 1024,
  height: 4608,
});

const DEFAULT_MAP_CHECKPOINTS = Object.freeze([
  { x: 0.19, y: 0.04 },
  { x: 0.81, y: 0.11 },
  { x: 0.2, y: 0.18 },
  { x: 0.79, y: 0.25 },
  { x: 0.21, y: 0.32 },
  { x: 0.82, y: 0.39 },
  { x: 0.2, y: 0.47 },
  { x: 0.79, y: 0.55 },
  { x: 0.2, y: 0.63 },
  { x: 0.82, y: 0.71 },
  { x: 0.22, y: 0.79 },
  { x: 0.8, y: 0.87 },
  { x: 0.21, y: 0.95 },
]);

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Gagal load ${path}`);
  }
  return response.json();
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function getTrack(trackId) {
  return tracksCache.find((track) => track.id === trackId) || null;
}

function getLesson(lessonId) {
  return lessonsCache.find((lesson) => lesson.lesson_id === lessonId) || null;
}

function computeProgressByTrack(trackId) {
  const progress = loadProgress();
  const trackLessons = lessonsCache.filter((lesson) => lesson.track_id === trackId);
  const done = trackLessons.filter((lesson) => progress[lesson.lesson_id]?.done).length;
  const stars = trackLessons.reduce((sum, lesson) => {
    return sum + (Number(progress[lesson.lesson_id]?.stars) || 0);
  }, 0);

  return {
    done,
    total: trackLessons.length,
    stars,
  };
}

function totalProgress() {
  const progress = loadProgress();
  const totalLessons = lessonsCache.length;
  const doneLessons = lessonsCache.filter((lesson) => progress[lesson.lesson_id]?.done).length;
  const stars = lessonsCache.reduce((sum, lesson) => {
    return sum + (Number(progress[lesson.lesson_id]?.stars) || 0);
  }, 0);

  return { doneLessons, totalLessons, stars };
}

function showError(containerId, message, withHomeLink = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.hidden = false;
  container.innerHTML = "";
  container.append(message);

  if (withHomeLink) {
    const link = document.createElement("a");
    link.href = "./index.html";
    link.textContent = " Kembali ke dashboard";
    link.className = "link-back";
    container.append(link);
  }
}

function isYoutubeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be");
  } catch (_error) {
    return false;
  }
}

function toPercent(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function setProgressFill(id, done, total) {
  const fill = document.getElementById(id);
  if (!fill) return;
  fill.style.width = `${toPercent(done, total)}%`;
}

function getTrackIcon(trackId) {
  return trackId === "mt" ? "🔢" : "📚";
}

function starsChipHTML(stars) {
  const safeStars = Math.max(0, Math.min(3, Number(stars) || 0));
  let html = '<span class="stars-chip" aria-label="Bintang">';
  for (let i = 1; i <= 3; i += 1) {
    html += `<span class="star${i <= safeStars ? "" : " off"}">⭐</span>`;
  }
  html += "</span>";
  return html;
}

function applyMascotTips() {
  const tipEls = document.querySelectorAll("[data-mascot-tip]");
  if (!tipEls.length) return;

  tipEls.forEach((el) => {
    const random = Math.floor(Math.random() * MASCOT_TIPS.length);
    el.textContent = MASCOT_TIPS[random];
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyPopInStagger() {
  if (prefersReducedMotion()) return;
  const items = document.querySelectorAll(".hero, .track-card, .progress-panel, .track-banner, .lesson-row, .media-card, .sticky-controls, .card");
  items.forEach((item, idx) => {
    item.classList.add("pop-in");
    item.style.setProperty("--stagger", `${Math.min(idx * 55, 420)}ms`);
  });
}

function showToast(message) {
  const host = document.getElementById("toast-container");
  if (!host) return;

  host.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon" aria-hidden="true">⭐</span><span class="toast-text">${message}</span>`;
  toast.setAttribute("role", "status");
  toast.title = "Klik untuk tutup";
  toast.addEventListener("click", () => {
    if (toastTimer) window.clearTimeout(toastTimer);
    toast.remove();
  });
  host.append(toast);

  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.remove();
  }, 2000);
}

function burstConfetti(sourceEl) {
  if (prefersReducedMotion()) return;
  const layer = document.getElementById("fx-layer");
  if (!layer || !sourceEl) return;

  if (confettiCleanupTimer) {
    window.clearTimeout(confettiCleanupTimer);
  }

  const rect = sourceEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const colors = ["#19c37d", "#2f80ed", "#7b61ff", "#f59e0b", "#7fe28b", "#ffd94f"];
  const pieces = 24 + Math.floor(Math.random() * 13);
  layer.querySelectorAll(".confetti").forEach((piece) => piece.remove());

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${originX + (Math.random() * 30 - 15)}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
    piece.addEventListener("animationend", () => piece.remove());
    layer.append(piece);
  }

  confettiCleanupTimer = window.setTimeout(() => {
    layer.querySelectorAll(".confetti").forEach((piece) => piece.remove());
  }, 950);
}

function stableNoise(seed) {
  const value = Math.sin(seed * 91.177) * 10000;
  return value - Math.floor(value);
}

function toFiniteNumber(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function normalizeCheckpoint(point) {
  if (!point || typeof point !== "object") return null;
  const x = clamp01(toFiniteNumber(point.x, NaN));
  const y = clamp01(toFiniteNumber(point.y, NaN));
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function normalizeNodeOverrides(rawNodeOverrides) {
  if (!rawNodeOverrides || typeof rawNodeOverrides !== "object") return {};
  const normalized = {};

  Object.entries(rawNodeOverrides).forEach(([lessonNoRaw, point]) => {
    const lessonNo = Math.round(toFiniteNumber(lessonNoRaw, NaN));
    if (!Number.isFinite(lessonNo) || lessonNo < 1) return;
    const normalizedPoint = normalizeCheckpoint(point);
    if (!normalizedPoint) return;
    normalized[lessonNo] = normalizedPoint;
  });

  return normalized;
}

function normalizeCheckpointTrackConfig(rawTrackConfig) {
  const imageRaw = rawTrackConfig?.image || {};
  const image = {
    width: Math.max(1, Math.round(toFiniteNumber(imageRaw.width, DEFAULT_MAP_IMAGE_SIZE.width))),
    height: Math.max(1, Math.round(toFiniteNumber(imageRaw.height, DEFAULT_MAP_IMAGE_SIZE.height))),
  };

  const rawCheckpoints = Array.isArray(rawTrackConfig?.checkpoints) ? rawTrackConfig.checkpoints : [];
  const checkpoints = rawCheckpoints.map(normalizeCheckpoint).filter(Boolean);
  const safeCheckpoints = checkpoints.length ? checkpoints : DEFAULT_MAP_CHECKPOINTS.map((point) => ({ ...point }));
  const nodeOverrides = normalizeNodeOverrides(rawTrackConfig?.nodeOverrides || rawTrackConfig?.node_overrides);
  const useUniformVerticalSpacing = rawTrackConfig?.uniformVerticalSpacing !== false;

  return { image, checkpoints: safeCheckpoints, nodeOverrides, useUniformVerticalSpacing };
}

function normalizeCheckpointConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object") {
    return {
      default: normalizeCheckpointTrackConfig({}),
    };
  }

  const normalized = {};
  Object.entries(rawConfig).forEach(([trackId, config]) => {
    normalized[trackId] = normalizeCheckpointTrackConfig(config);
  });

  if (!normalized.default) {
    normalized.default = normalizeCheckpointTrackConfig({});
  }

  return normalized;
}

async function loadCheckpointConfig() {
  try {
    const raw = await loadJSON("./data/checkpoints.json");
    return normalizeCheckpointConfig(raw);
  } catch (_error) {
    return normalizeCheckpointConfig({});
  }
}

function getTrackCheckpointConfig(trackId) {
  if (!checkpointsCache || typeof checkpointsCache !== "object") {
    return normalizeCheckpointTrackConfig({});
  }

  const trackConfig = checkpointsCache[trackId];
  if (trackConfig?.checkpoints?.length) {
    return trackConfig;
  }
  return checkpointsCache.default || normalizeCheckpointTrackConfig({});
}

function sampleCheckpointPath(points, count) {
  if (!Array.isArray(points) || !points.length || count <= 0) return [];
  if (count === 1) {
    return [{ ...points[0] }];
  }
  if (points.length === 1) {
    return Array.from({ length: count }, () => ({ ...points[0] }));
  }

  const lengths = [0];
  let totalLength = 0;

  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    totalLength += Math.hypot(current.x - previous.x, current.y - previous.y);
    lengths.push(totalLength);
  }

  if (totalLength <= 0.000001) {
    return Array.from({ length: count }, () => ({ ...points[0] }));
  }

  const sampled = [];
  for (let i = 0; i < count; i += 1) {
    const targetDistance = (i / (count - 1)) * totalLength;

    let segmentIndex = 1;
    while (segmentIndex < lengths.length && lengths[segmentIndex] < targetDistance) {
      segmentIndex += 1;
    }

    const safeIndex = Math.min(lengths.length - 1, Math.max(1, segmentIndex));
    const startDistance = lengths[safeIndex - 1];
    const endDistance = lengths[safeIndex];
    const segmentLength = Math.max(0.000001, endDistance - startDistance);
    const t = clamp01((targetDistance - startDistance) / segmentLength);
    const from = points[safeIndex - 1];
    const to = points[safeIndex];

    sampled.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    });
  }

  return sampled;
}

function buildUniformNodeYPositions(count, stageHeight, minGap, minEdgePadding) {
  if (count <= 0) return [];
  if (count === 1) return [stageHeight / 2];

  const safeHeight = Math.max(1, stageHeight);
  const safeGap = Math.max(1, minGap);
  const safePadding = Math.max(0, minEdgePadding);
  const usableHeight = Math.max(0, safeHeight - safePadding * 2);
  const gap = Math.max(safeGap, usableHeight / (count - 1));
  const occupiedHeight = gap * (count - 1);
  const top = Math.max(0, (safeHeight - occupiedHeight) / 2);

  return Array.from({ length: count }, (_value, idx) => top + idx * gap);
}

function interpolateCheckpointXByY(points, targetY) {
  if (!Array.isArray(points) || !points.length) return 0.5;
  if (points.length === 1) return clamp01(toFiniteNumber(points[0].x, 0.5));

  const safeTargetY = clamp01(toFiniteNumber(targetY, 0));
  const ordered = [...points].sort((a, b) => a.y - b.y);
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  if (safeTargetY <= first.y) return clamp01(toFiniteNumber(first.x, 0.5));
  if (safeTargetY >= last.y) return clamp01(toFiniteNumber(last.x, 0.5));

  for (let i = 1; i < ordered.length; i += 1) {
    const from = ordered[i - 1];
    const to = ordered[i];
    if (safeTargetY > to.y) continue;
    const span = to.y - from.y;
    if (Math.abs(span) < 0.000001) {
      return clamp01(toFiniteNumber(to.x, from.x));
    }
    const t = clamp01((safeTargetY - from.y) / span);
    return clamp01(from.x + (to.x - from.x) * t);
  }

  return clamp01(toFiniteNumber(last.x, 0.5));
}

function computeContainedViewport(containerWidth, containerHeight, imageWidth, imageHeight) {
  const safeContainerWidth = Math.max(1, containerWidth);
  const safeContainerHeight = Math.max(1, containerHeight);
  const safeImageWidth = Math.max(1, imageWidth);
  const safeImageHeight = Math.max(1, imageHeight);
  const scale = safeContainerHeight / safeImageHeight;
  const width = safeImageWidth * scale;
  const height = safeContainerHeight;
  return {
    x: (safeContainerWidth - width) / 2,
    y: 0,
    width,
    height,
    scale,
  };
}

function buildImageRoutePoints(trackId, lessonCount, stageWidth) {
  const safeCount = Math.max(0, lessonCount);
  const config = getTrackCheckpointConfig(trackId);
  const imageWidth = Math.max(1, toFiniteNumber(config.image?.width, DEFAULT_MAP_IMAGE_SIZE.width));
  const imageHeight = Math.max(1, toFiniteNumber(config.image?.height, DEFAULT_MAP_IMAGE_SIZE.height));
  const ratioHeight = Math.round((stageWidth * imageHeight) / imageWidth);
  const isCompact = stageWidth < 640;
  const targetVerticalGap = isCompact ? 94 : 112;
  const edgePadding = Math.round(targetVerticalGap * 1.45);
  const minHeightByLessons = safeCount > 1 ? edgePadding * 2 + (safeCount - 1) * targetVerticalGap : 360;
  const stageHeight = Math.max(360, ratioHeight, minHeightByLessons);
  const viewport = computeContainedViewport(stageWidth, stageHeight, imageWidth, imageHeight);
  const nodeOverrides = config.nodeOverrides && typeof config.nodeOverrides === "object" ? config.nodeOverrides : {};
  const uniformYPositions = config.useUniformVerticalSpacing ? buildUniformNodeYPositions(safeCount, stageHeight, targetVerticalGap, edgePadding) : null;

  if (uniformYPositions) {
    return {
      stageWidth,
      stageHeight,
      points: uniformYPositions.map((y, idx) => {
        const yNorm = viewport.height > 0 ? clamp01((y - viewport.y) / viewport.height) : 0;
        const overridePoint = nodeOverrides[idx + 1];
        const baseX = interpolateCheckpointXByY(config.checkpoints, yNorm);
        const xNorm = overridePoint ? clamp01(toFiniteNumber(overridePoint.x, baseX)) : baseX;

        return {
          x: viewport.x + xNorm * viewport.width,
          y,
          side: xNorm >= 0.5 ? "right" : "left",
        };
      }),
    };
  }

  const sampled = sampleCheckpointPath(config.checkpoints, safeCount);
  const routedPoints = sampled.map((point, idx) => {
    const overridePoint = nodeOverrides[idx + 1];
    return overridePoint ? { x: overridePoint.x, y: overridePoint.y } : point;
  });

  return {
    stageWidth,
    stageHeight,
    points: routedPoints.map((point, idx) => ({
      x: viewport.x + point.x * viewport.width,
      y: uniformYPositions ? uniformYPositions[idx] : viewport.y + point.y * viewport.height,
      side: point.x >= 0.5 ? "right" : "left",
    })),
  };
}

const MAP_BG_TILE_SIZE = 1024;
const MAP_ROCK_ZONES = [
  // Approximate rock clusters from seamless grass tile, normalized by tile size.
  { x: 0.36, y: 0.24, r: 0.15 },
  { x: 0.16, y: 0.66, r: 0.13 },
  { x: 0.77, y: 0.8, r: 0.13 },
  { x: 0.08, y: 0.92, r: 0.09 },
];

function wrapTileDistance(a, b, size) {
  const delta = Math.abs(a - b) % size;
  return delta > size / 2 ? size - delta : delta;
}

function rockAvoidanceCost(x, y) {
  const tileX = ((x % MAP_BG_TILE_SIZE) + MAP_BG_TILE_SIZE) % MAP_BG_TILE_SIZE;
  const tileY = ((y % MAP_BG_TILE_SIZE) + MAP_BG_TILE_SIZE) % MAP_BG_TILE_SIZE;
  let cost = 0;

  MAP_ROCK_ZONES.forEach((zone) => {
    const zoneX = zone.x * MAP_BG_TILE_SIZE;
    const zoneY = zone.y * MAP_BG_TILE_SIZE;
    const safeRadius = zone.r * MAP_BG_TILE_SIZE;
    const dx = wrapTileDistance(tileX, zoneX, MAP_BG_TILE_SIZE);
    const dy = wrapTileDistance(tileY, zoneY, MAP_BG_TILE_SIZE);
    const dist = Math.hypot(dx, dy);

    if (dist < safeRadius) {
      const overlap = (safeRadius - dist) / safeRadius;
      cost += overlap * overlap * 380;
    }
  });

  return cost;
}

function cubicPoint(t, p0, p1, p2, p3) {
  const omt = 1 - t;
  return omt * omt * omt * p0 + 3 * omt * omt * t * p1 + 3 * omt * t * t * p2 + t * t * t * p3;
}

function chooseSegmentMidY(prev, curr, previousMidY = null) {
  const baseMidY = (prev.y + curr.y) / 2;
  const swingMax = 112;
  const candidates = [0, -24, 24, -44, 44, -64, 64, -84, 84, -104, 104];
  let bestMidY = baseMidY;
  let bestScore = Number.POSITIVE_INFINITY;

  candidates.forEach((delta) => {
    const unclamped = baseMidY + delta;
    const minY = Math.min(prev.y, curr.y) - swingMax;
    const maxY = Math.max(prev.y, curr.y) + swingMax;
    const lowerBound = Math.max(56, minY);
    const upperBound = Math.max(lowerBound, maxY);
    const midY = Math.min(upperBound, Math.max(lowerBound, unclamped));
    let score = Math.abs(delta) * 0.96;
    if (typeof previousMidY === "number") {
      const continuityGap = Math.abs(midY - previousMidY);
      score += continuityGap * 0.82;
      if (continuityGap > 96) {
        score += 420;
      }
    }

    for (let sample = 0; sample <= 12; sample += 1) {
      const t = sample / 12;
      const px = cubicPoint(t, prev.x, prev.x, curr.x, curr.x);
      const py = cubicPoint(t, prev.y, midY, midY, curr.y);
      score += rockAvoidanceCost(px, py);
    }

    if (score < bestScore) {
      bestScore = score;
      bestMidY = midY;
    }
  });

  return bestMidY;
}

function smoothMidYs(segments) {
  if (segments.length < 3) {
    return segments.map((segment) => segment.midY);
  }

  const original = segments.map((segment) => segment.midY);
  const smoothed = [...original];

  for (let i = 1; i < segments.length - 1; i += 1) {
    smoothed[i] = (original[i - 1] + original[i] * 2 + original[i + 1]) / 4;
  }

  for (let i = 0; i < segments.length; i += 1) {
    const { prev, curr } = segments[i];
    const baseMidY = (prev.y + curr.y) / 2;
    const lowerBound = Math.max(56, Math.min(prev.y, curr.y) - 112);
    const upperBound = Math.max(lowerBound, Math.max(prev.y, curr.y) + 112);
    const maxShiftFromOriginal = 32;
    const constrained = Math.min(original[i] + maxShiftFromOriginal, Math.max(original[i] - maxShiftFromOriginal, smoothed[i]));
    const blended = constrained * 0.76 + baseMidY * 0.24;
    smoothed[i] = Math.min(upperBound, Math.max(lowerBound, blended));
  }

  return smoothed;
}

function isUnlocked(lessons, idx, progress) {
  if (idx <= 0) return true;
  const previous = lessons[idx - 1];
  return Boolean(progress[previous.lesson_id]?.done);
}

function findCurrentIndex(lessons, progress) {
  if (!lessons.length) return -1;
  return lessons.findIndex((lesson) => !progress[lesson.lesson_id]?.done);
}

function findCompletedIndex(lessons, progress) {
  let completedIndex = -1;
  for (let i = 0; i < lessons.length; i += 1) {
    if (!progress[lessons[i].lesson_id]?.done) break;
    completedIndex = i;
  }
  return completedIndex;
}

function generateZigzagPoints(count, width) {
  const isCompact = width < 640;
  const sidePadding = isCompact ? 64 : Math.max(88, Math.round(width * 0.16));
  const leftLane = sidePadding;
  const rightLane = width - sidePadding;
  const top = isCompact ? 92 : 98;
  const spacing = isCompact ? 166 : 154;
  const points = [];

  for (let i = 0; i < count; i += 1) {
    const jitterX = (stableNoise(i + 2) - 0.5) * (isCompact ? 8 : 12);
    const jitterY = (stableNoise(i + 23) - 0.5) * (isCompact ? 6 : 8);
    const laneX = i % 2 === 0 ? leftLane : rightLane;
    points.push({
      x: laneX + jitterX,
      y: top + i * spacing + jitterY,
      side: i % 2 === 0 ? "left" : "right",
    });
  }

  return points;
}

function buildMapPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const segments = [];
  let previousMidY = null;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const chosenMidY = chooseSegmentMidY(prev, curr, previousMidY);
    previousMidY = chosenMidY;
    segments.push({ prev, curr, midY: chosenMidY });
  }

  const smoothedMidYs = smoothMidYs(segments);
  let d = `M ${points[0].x} ${points[0].y}`;
  const controlPull = 0.72;
  for (let i = 0; i < segments.length; i += 1) {
    const { prev, curr } = segments[i];
    const midY = smoothedMidYs[i];
    const c1y = prev.y + (midY - prev.y) * controlPull;
    const c2y = curr.y + (midY - curr.y) * controlPull;
    d += ` C ${prev.x} ${c1y}, ${curr.x} ${c2y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

function renderTrackListFallback(list, track, lessons, progress) {
  let nextFlagUsed = false;
  const stampedLessonId = sessionStorage.getItem(UI_STAMP_KEY);
  list.innerHTML = "";

  lessons.forEach((lesson, idx) => {
    const entry = progress[lesson.lesson_id] || { done: false, stars: 0 };
    const unlocked = isUnlocked(lessons, idx, progress);
    const row = document.createElement("article");
    row.className = "lesson-row";

    if (unlocked && !entry.done && !nextFlagUsed) {
      row.classList.add("next-lesson");
      nextFlagUsed = true;
    }
    if (!unlocked) {
      row.classList.add("is-locked");
    }

    row.tabIndex = 0;
    row.setAttribute("role", "link");
    row.setAttribute("aria-label", unlocked ? `Buka ${lesson.tajuk}` : `Pelajaran dikunci: ${lesson.tajuk}`);

    const badgeClass = entry.done ? "done" : unlocked ? "pending" : "locked";
    const badgeText = entry.done ? "✅ Selesai" : unlocked ? "Belum" : "🔒 Dikunci";
    const badgeStampClass = entry.done && stampedLessonId === lesson.lesson_id ? " stamp" : "";

    row.innerHTML = `
      <div class="lesson-row-top">
        <div class="level-title">
          <span class="level-no">${lesson.no}</span>
          <h2>${lesson.tajuk}</h2>
        </div>
        <span class="badge ${badgeClass}${badgeStampClass}">${badgeText}</span>
      </div>
      <p class="meta">${lesson.mins} minit</p>
      ${starsChipHTML(entry.stars)}
    `;

    const openLesson = () => {
      if (!unlocked) {
        showToast("Selesaikan pelajaran sebelum ini untuk buka 😊");
        return;
      }
      window.location.href = `./lesson.html?track=${encodeURIComponent(track.id)}&lesson=${encodeURIComponent(
        lesson.lesson_id
      )}`;
    };

    row.addEventListener("click", openLesson);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLesson();
      }
    });

    list.append(row);
  });
}

const MAP_COMPANION_STATES = Object.freeze({
  IDLE: "idle",
  PATROL_ROUTE: "patrol_route",
  MICRO_RANDOM: "micro_random",
  EVENT_REACT: "event_react",
  RETURN_TO_ROUTE: "return_to_route",
  FAILSAFE: "failsafe",
});

const MAP_COMPANION_CONFIG = Object.freeze({
  patrolSpeedPxPerSec: 84,
  speedVariance: 0.26,
  waypointWaitMinMs: 760,
  waypointWaitMaxMs: 1800,
  microRandomChance: 0.28,
  detourMinRadiusPx: 22,
  detourMaxRadiusPx: 54,
  reactionDurationMs: 1400,
  reactionCooldownMs: 460,
  replanTimeoutMs: 5000,
  stuckThresholdMs: 8000,
  maxReplanAttempts: 3,
});

const MAP_COMPANION_CHAT = Object.freeze({
  patrol: [
    "Jom sambung belajar!",
    "Sikit lagi boleh siap ⭐",
    "Tekan node kalau nak mula.",
    "Mantap! Kita teruskan route.",
    "Saya ronda dulu, awak pilih lesson 😊",
  ],
  inspect: ["Nak tengok lesson ni?", "Saya boleh temankan kat sini.", "Klik kalau nak mula."],
  open: ["Yes, jom masuk lesson!", "Terbaik, kita pergi!", "Nice! Teruskan momentum."],
  locked: ["Ops, yang ni masih kunci 🔒", "Selesai lesson sebelum ni dulu ya.", "Lagi sikit je, nanti terbuka!"],
  reroute: ["Sekejap, saya balik route dulu.", "Saya rejoin laluan kejap."],
  failsafe: ["Oops, saya reset laluan sekejap."],
});

let mapCompanionController = null;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pickCompanionMessage(controller, pool, fallback = "") {
  const choices = Array.isArray(pool) ? pool.filter((item) => typeof item === "string" && item.trim()) : [];
  if (!choices.length) return fallback;

  let index = Math.floor(Math.random() * choices.length);
  if (controller && choices.length > 1 && choices[index] === controller.lastChatMessage) {
    index = (index + 1 + Math.floor(Math.random() * (choices.length - 1))) % choices.length;
  }
  return choices[index];
}

function buildCompanionRoute(points, anchorIndex) {
  if (!points.length) return { waypoints: [], focusIndex: -1 };

  const safeAnchor = clamp(Math.round(anchorIndex || 0), 0, points.length - 1);
  let start = Math.max(0, safeAnchor - 1);
  let end = Math.min(points.length - 1, safeAnchor + 2);
  const targetSpan = Math.min(points.length, 4);

  while (end - start + 1 < targetSpan) {
    if (start > 0) {
      start -= 1;
      continue;
    }
    if (end < points.length - 1) {
      end += 1;
      continue;
    }
    break;
  }

  const waypoints = [];
  for (let i = start; i <= end; i += 1) {
    const node = points[i];
    const side = node.side === "right" ? "right" : "left";
    const offsetX = side === "left" ? -24 : 24;
    waypoints.push({
      x: node.x + offsetX,
      y: node.y - 14,
      side,
      nodeIndex: i,
    });
  }

  return { waypoints, focusIndex: safeAnchor - start };
}

function toCompanionReactionPoint(point, sideHint) {
  const side = sideHint === "right" ? "right" : "left";
  const offsetX = side === "left" ? -40 : 40;
  return {
    x: point.x + offsetX,
    y: point.y - 18,
    side,
  };
}

function ensureMapCompanionElement(mapStage) {
  let companion = mapStage.querySelector(".map-companion");
  if (!companion) {
    companion = document.createElement("span");
    companion.className = "map-companion";
    companion.setAttribute("aria-hidden", "true");
    companion.innerHTML = `
      <span class="map-companion-shadow"></span>
      <span class="map-companion-sprite">
        <img src="./assets/pbot.png?v=2" alt="" class="map-companion-bot" />
      </span>
      <span class="map-companion-chat" role="status" aria-live="polite"></span>
    `;
    mapStage.append(companion);
  }

  companion.dataset.face ||= "right";
  companion.dataset.state ||= MAP_COMPANION_STATES.IDLE;
  return companion;
}

function getMapCompanionChatEl(controller) {
  return controller?.companion?.querySelector(".map-companion-chat") || null;
}

function maybeHideCompanionChat(controller, now) {
  const chatEl = getMapCompanionChatEl(controller);
  if (!chatEl) return;
  if (controller.chatUntil > 0 && now >= controller.chatUntil) {
    chatEl.classList.remove("is-visible");
    controller.chatUntil = 0;
  }
}

function showCompanionChat(controller, message, options = {}) {
  if (!controller) return;
  const chatEl = getMapCompanionChatEl(controller);
  if (!chatEl) return;

  const text = String(message || "").trim();
  if (!text) return;

  const now = Number.isFinite(options.now) ? options.now : performance.now();
  const durationMs = clamp(Number(options.durationMs) || 2100, 900, 5200);
  const priority = Boolean(options.priority);

  if (!priority && controller.chatUntil > now + 240) return;

  chatEl.textContent = text;
  chatEl.classList.add("is-visible");
  controller.lastChatMessage = text;
  controller.chatUntil = now + durationMs;
  controller.nextChatAt = controller.chatUntil + randomBetween(900, 2300);
}

function triggerCompanionArrival(companion) {
  if (!companion) return;
  if (companion._arriveTimer) {
    window.clearTimeout(companion._arriveTimer);
  }
  companion.classList.remove("is-arriving");
  void companion.offsetWidth;
  companion.classList.add("is-arriving");
  companion._arriveTimer = window.setTimeout(() => {
    companion.classList.remove("is-arriving");
    companion._arriveTimer = null;
  }, 240);
}

function clampCompanionPosition(controller, x, y) {
  const mapStage = controller.mapStage;
  const companion = controller.companion;
  const stageWidth = mapStage?.clientWidth || 0;
  const stageHeight = mapStage?.clientHeight || 0;
  const companionSize = companion?.offsetWidth || 64;
  const halfSize = companionSize / 2;
  const edgePadding = 6;
  const minX = halfSize + edgePadding;
  const minY = halfSize + edgePadding;
  const maxX = stageWidth > 0 ? stageWidth - halfSize - edgePadding : Number.POSITIVE_INFINITY;
  const maxY = stageHeight > 0 ? stageHeight - halfSize - edgePadding : Number.POSITIVE_INFINITY;
  return {
    x: clamp(x, minX, maxX),
    y: clamp(y, minY, maxY),
  };
}

function setCompanionState(controller, nextState) {
  if (!controller || controller.state === nextState) return;
  controller.state = nextState;
  if (controller.companion) {
    controller.companion.dataset.state = nextState;
  }
}

function setCompanionSpeed(controller, multiplier = 1) {
  const variance = 1 + randomBetween(-MAP_COMPANION_CONFIG.speedVariance, MAP_COMPANION_CONFIG.speedVariance);
  controller.speedPxPerSec = MAP_COMPANION_CONFIG.patrolSpeedPxPerSec * multiplier * variance;
}

function setCompanionPosition(controller, x, y, faceHint) {
  if (!controller?.companion || !controller.mapStage) return;
  const clampedPos = clampCompanionPosition(controller, x, y);
  controller.position = clampedPos;
  controller.companion.style.left = `${clampedPos.x}px`;
  controller.companion.style.top = `${clampedPos.y}px`;
  if (faceHint) {
    controller.companion.dataset.face = faceHint;
  }
  controller.companion.classList.add("is-visible");
}

function findNearestWaypointIndex(waypoints, position) {
  if (!waypoints.length || !position) return -1;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < waypoints.length; i += 1) {
    const node = waypoints[i];
    const distance = Math.hypot(node.x - position.x, node.y - position.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function clearMapCompanionAnimationLoop(controller) {
  if (controller?.rafId) {
    window.cancelAnimationFrame(controller.rafId);
    controller.rafId = 0;
  }
  if (controller) {
    controller.lastTickAt = 0;
  }
}

function getNextPatrolTarget(controller) {
  const { route } = controller;
  if (!route.length) return null;
  if (route.length === 1) {
    return { ...route[0], routeIndex: 0 };
  }

  let nextIndex = controller.waypointIndex + controller.waypointDirection;
  if (nextIndex >= route.length || nextIndex < 0) {
    controller.waypointDirection *= -1;
    nextIndex = controller.waypointIndex + controller.waypointDirection;
  }
  nextIndex = clamp(nextIndex, 0, route.length - 1);
  const waypoint = route[nextIndex];
  return {
    x: waypoint.x,
    y: waypoint.y,
    side: waypoint.side,
    routeIndex: nextIndex,
  };
}

function moveCompanionToward(controller, target, deltaSeconds, now) {
  if (!target) return true;
  if (!controller.position) {
    setCompanionPosition(controller, target.x, target.y, target.side || "right");
    controller.lastProgressAt = now;
    return true;
  }

  const dx = target.x - controller.position.x;
  const dy = target.y - controller.position.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= 0.8) {
    setCompanionPosition(controller, target.x, target.y, target.side || (dx >= 0 ? "right" : "left"));
    controller.lastProgressAt = now;
    return true;
  }

  const maxStep = Math.max(0.001, controller.speedPxPerSec * deltaSeconds);
  const step = Math.min(distance, maxStep);
  const nextX = controller.position.x + (dx / distance) * step;
  const nextY = controller.position.y + (dy / distance) * step;
  const faceHint = Math.abs(dx) < 0.8 ? controller.companion.dataset.face || target.side || "right" : dx >= 0 ? "right" : "left";
  setCompanionPosition(controller, nextX, nextY, faceHint);

  if (step > 0.35) {
    controller.lastProgressAt = now;
  }

  return step >= distance - 0.001;
}

function pickDetourTarget(controller) {
  if (!controller.position) return null;

  for (let tries = 0; tries < 10; tries += 1) {
    const radius = randomBetween(MAP_COMPANION_CONFIG.detourMinRadiusPx, MAP_COMPANION_CONFIG.detourMaxRadiusPx);
    const angle = randomBetween(0, Math.PI * 2);
    const sampleX = controller.position.x + Math.cos(angle) * radius;
    const sampleY = controller.position.y + Math.sin(angle) * radius * 0.74;
    const clampedSample = clampCompanionPosition(controller, sampleX, sampleY);
    const delta = Math.hypot(clampedSample.x - controller.position.x, clampedSample.y - controller.position.y);
    if (delta < MAP_COMPANION_CONFIG.detourMinRadiusPx * 0.55) continue;

    return {
      x: clampedSample.x,
      y: clampedSample.y,
      side: clampedSample.x >= controller.position.x ? "right" : "left",
    };
  }

  return null;
}

function enterReturnToRouteState(controller, now, reason = "") {
  if (!controller.route.length) return;
  const routeIndex = Math.max(0, findNearestWaypointIndex(controller.route, controller.position || controller.route[0]));
  const waypoint = controller.route[routeIndex];
  controller.target = {
    x: waypoint.x,
    y: waypoint.y,
    side: waypoint.side,
    routeIndex,
  };
  controller.detourOrigin = null;
  controller.detourPhase = "outbound";
  controller.waitUntil = 0;
  setCompanionState(controller, MAP_COMPANION_STATES.RETURN_TO_ROUTE);
  setCompanionSpeed(controller, 1.06);
  controller.lastProgressAt = now;
  if (reason === "failsafe") {
    showCompanionChat(controller, pickCompanionMessage(controller, MAP_COMPANION_CHAT.failsafe), {
      now,
      durationMs: 1800,
      priority: true,
    });
  } else if (reason === "reroute") {
    showCompanionChat(controller, pickCompanionMessage(controller, MAP_COMPANION_CHAT.reroute), {
      now,
      durationMs: 1700,
      priority: true,
    });
  }
}

function enterEventReactState(controller, reactionPoint, now) {
  if (!reactionPoint) return;
  controller.pendingReaction = null;
  const reactionMessage = controller.pendingReactionMessage || pickCompanionMessage(controller, MAP_COMPANION_CHAT.inspect);
  controller.pendingReactionMessage = "";
  controller.target = {
    x: reactionPoint.x,
    y: reactionPoint.y,
    side: reactionPoint.side,
  };
  controller.reactionUntil = now + MAP_COMPANION_CONFIG.reactionDurationMs;
  controller.nextReactionAllowedAt = now + MAP_COMPANION_CONFIG.reactionCooldownMs;
  controller.waitUntil = 0;
  setCompanionState(controller, MAP_COMPANION_STATES.EVENT_REACT);
  setCompanionSpeed(controller, 1.2);
  controller.lastProgressAt = now;
  showCompanionChat(controller, reactionMessage, {
    now,
    durationMs: 1650,
    priority: true,
  });
}

function enterMicroRandomState(controller, now) {
  const detour = pickDetourTarget(controller);
  if (!detour) return false;

  controller.detourOrigin = controller.position ? { ...controller.position } : null;
  controller.detourPhase = "outbound";
  controller.target = detour;
  controller.waitUntil = 0;
  setCompanionState(controller, MAP_COMPANION_STATES.MICRO_RANDOM);
  setCompanionSpeed(controller, 1.12);
  controller.lastProgressAt = now;
  return true;
}

function maybeRunCompanionFailsafe(controller, now) {
  if (!controller.target) return;

  const stalledFor = now - controller.lastProgressAt;
  if (stalledFor < MAP_COMPANION_CONFIG.replanTimeoutMs) return;

  if (stalledFor >= MAP_COMPANION_CONFIG.stuckThresholdMs) {
    setCompanionState(controller, MAP_COMPANION_STATES.FAILSAFE);
    controller.replanAttempts += 1;

    if (controller.replanAttempts > MAP_COMPANION_CONFIG.maxReplanAttempts) {
      const home = controller.route[0];
      if (home) {
        setCompanionPosition(controller, home.x, home.y, home.side || "right");
        controller.waypointIndex = 0;
        controller.waypointDirection = 1;
      }
      controller.replanAttempts = 0;
      controller.target = null;
      controller.waitUntil = now + 420;
      setCompanionState(controller, MAP_COMPANION_STATES.PATROL_ROUTE);
      controller.lastProgressAt = now;
      return;
    }

    enterReturnToRouteState(controller, now, "failsafe");
    return;
  }

  if (controller.state !== MAP_COMPANION_STATES.RETURN_TO_ROUTE) {
    controller.replanAttempts += 1;
    enterReturnToRouteState(controller, now, "reroute");
  }
}

function updateMapCompanionState(controller, timestamp) {
  if (!controller || controller.reducedMotion || !controller.route.length) return;

  const now = timestamp || performance.now();
  if (!controller.lastTickAt) {
    controller.lastTickAt = now;
  }
  const deltaSeconds = Math.max(0, Math.min((now - controller.lastTickAt) / 1000, 0.064));
  controller.lastTickAt = now;

  if (controller.pendingReaction && now >= controller.nextReactionAllowedAt) {
    enterEventReactState(controller, controller.pendingReaction, now);
  }

  switch (controller.state) {
    case MAP_COMPANION_STATES.IDLE: {
      controller.waitUntil = now + randomBetween(180, 420);
      setCompanionState(controller, MAP_COMPANION_STATES.PATROL_ROUTE);
      break;
    }
    case MAP_COMPANION_STATES.PATROL_ROUTE: {
      if (now < controller.waitUntil) break;

      if (!controller.target) {
        const nextTarget = getNextPatrolTarget(controller);
        if (!nextTarget) break;
        controller.target = nextTarget;
        setCompanionSpeed(controller, 1);
        controller.lastProgressAt = now;
      }

      if (moveCompanionToward(controller, controller.target, deltaSeconds, now)) {
        if (typeof controller.target.routeIndex === "number") {
          controller.waypointIndex = controller.target.routeIndex;
          controller.waypointDirection = controller.waypointIndex >= controller.route.length - 1 ? -1 : 1;
        }

        controller.target = null;
        controller.replanAttempts = 0;

        const shouldDetour = Math.random() < MAP_COMPANION_CONFIG.microRandomChance;
        if (!shouldDetour || !enterMicroRandomState(controller, now)) {
          controller.waitUntil = now + randomBetween(MAP_COMPANION_CONFIG.waypointWaitMinMs, MAP_COMPANION_CONFIG.waypointWaitMaxMs);
        }
      }
      break;
    }
    case MAP_COMPANION_STATES.MICRO_RANDOM: {
      if (!controller.target) {
        enterReturnToRouteState(controller, now);
        break;
      }

      if (moveCompanionToward(controller, controller.target, deltaSeconds, now)) {
        if (controller.detourPhase === "outbound" && controller.detourOrigin) {
          controller.detourPhase = "return";
          controller.target = {
            x: controller.detourOrigin.x,
            y: controller.detourOrigin.y,
            side: controller.target.side === "right" ? "left" : "right",
          };
          controller.lastProgressAt = now;
        } else {
          controller.target = null;
          controller.detourOrigin = null;
          enterReturnToRouteState(controller, now);
        }
      }
      break;
    }
    case MAP_COMPANION_STATES.EVENT_REACT: {
      if (controller.target && moveCompanionToward(controller, controller.target, deltaSeconds, now)) {
        controller.target = null;
      }

      if (!controller.target && now >= controller.reactionUntil) {
        enterReturnToRouteState(controller, now);
      }
      break;
    }
    case MAP_COMPANION_STATES.RETURN_TO_ROUTE: {
      if (!controller.target) {
        enterReturnToRouteState(controller, now);
        break;
      }

      if (moveCompanionToward(controller, controller.target, deltaSeconds, now)) {
        if (typeof controller.target.routeIndex === "number") {
          controller.waypointIndex = controller.target.routeIndex;
          controller.waypointDirection = controller.waypointIndex >= controller.route.length - 1 ? -1 : 1;
        }
        controller.target = null;
        controller.waitUntil = now + randomBetween(260, 680);
        setCompanionState(controller, MAP_COMPANION_STATES.PATROL_ROUTE);
        controller.lastProgressAt = now;
      }
      break;
    }
    case MAP_COMPANION_STATES.FAILSAFE: {
      enterReturnToRouteState(controller, now, "failsafe");
      break;
    }
    default:
      setCompanionState(controller, MAP_COMPANION_STATES.PATROL_ROUTE);
      break;
  }

  if (controller.target) {
    maybeRunCompanionFailsafe(controller, now);
  }

  if (controller.state === MAP_COMPANION_STATES.PATROL_ROUTE && !controller.target && now >= controller.nextChatAt) {
    const patrolMessage =
      pickCompanionMessage(controller, MAP_COMPANION_CHAT.patrol) || pickCompanionMessage(controller, TRACK_HUD_TIPS, "Jom teruskan!");
    showCompanionChat(controller, patrolMessage, {
      now,
      durationMs: randomBetween(1500, 2400),
    });
  }

  maybeHideCompanionChat(controller, now);
}

function startMapCompanionAnimationLoop(controller) {
  if (!controller || controller.rafId || controller.reducedMotion || controller.route.length <= 1) return;

  const frame = (timestamp) => {
    updateMapCompanionState(controller, timestamp);
    controller.rafId = window.requestAnimationFrame(frame);
  };
  controller.rafId = window.requestAnimationFrame(frame);
}

function stopMapCompanionController() {
  if (!mapCompanionController) return;
  clearMapCompanionAnimationLoop(mapCompanionController);
  mapCompanionController.target = null;
  mapCompanionController.pendingReaction = null;
  mapCompanionController.pendingReactionMessage = "";
  mapCompanionController.route = [];
  mapCompanionController.routeSignature = "";
  mapCompanionController.position = null;
  mapCompanionController.lastProgressAt = 0;
  mapCompanionController.waitUntil = 0;
  mapCompanionController.detourOrigin = null;
  mapCompanionController.detourPhase = "outbound";
  mapCompanionController.replanAttempts = 0;
  mapCompanionController.chatUntil = 0;
  mapCompanionController.nextChatAt = 0;
  mapCompanionController.lastChatMessage = "";
  mapCompanionController.state = MAP_COMPANION_STATES.IDLE;
  if (mapCompanionController.companion) {
    mapCompanionController.companion.classList.remove("is-visible", "is-arriving");
    mapCompanionController.companion.dataset.state = MAP_COMPANION_STATES.IDLE;
    mapCompanionController.companion.dataset.lessonId = "";
    const chatEl = mapCompanionController.companion.querySelector(".map-companion-chat");
    if (chatEl) {
      chatEl.classList.remove("is-visible");
      chatEl.textContent = "";
    }
  }
}

function queueMapCompanionReaction(mapStage, point, sideHint, message = "") {
  if (!point || !mapCompanionController) return;
  if (mapCompanionController.mapStage !== mapStage) return;
  if (!mapCompanionController.route.length) return;

  const fallbackMessage = pickCompanionMessage(mapCompanionController, MAP_COMPANION_CHAT.inspect, "Nak tengok lesson ni?");
  mapCompanionController.pendingReactionMessage = message || fallbackMessage;

  if (mapCompanionController.reducedMotion) {
    showCompanionChat(mapCompanionController, mapCompanionController.pendingReactionMessage, {
      durationMs: 1700,
      priority: true,
    });
    return;
  }

  mapCompanionController.pendingReaction = toCompanionReactionPoint(point, sideHint || point.side);
}

function syncMapCompanionPatrol(mapStage, points, { anchorIndex = 0, activeLessonId = "" } = {}) {
  if (!mapStage || !points.length) {
    stopMapCompanionController();
    return;
  }

  if (!mapCompanionController) {
    mapCompanionController = {
      mapStage,
      companion: null,
      route: [],
      routeSignature: "",
      state: MAP_COMPANION_STATES.IDLE,
      position: null,
      target: null,
      waypointIndex: 0,
      waypointDirection: 1,
      waitUntil: 0,
      speedPxPerSec: MAP_COMPANION_CONFIG.patrolSpeedPxPerSec,
      detourOrigin: null,
      detourPhase: "outbound",
      reactionUntil: 0,
      pendingReaction: null,
      pendingReactionMessage: "",
      nextReactionAllowedAt: 0,
      lastProgressAt: 0,
      replanAttempts: 0,
      chatUntil: 0,
      nextChatAt: 0,
      lastChatMessage: "",
      reducedMotion: prefersReducedMotion(),
      rafId: 0,
      lastTickAt: 0,
    };
  }

  if (mapCompanionController.mapStage !== mapStage) {
    clearMapCompanionAnimationLoop(mapCompanionController);
    mapCompanionController.mapStage = mapStage;
    mapCompanionController.position = null;
  }

  const controller = mapCompanionController;
  controller.companion = ensureMapCompanionElement(mapStage);
  controller.reducedMotion = prefersReducedMotion();

  const { waypoints, focusIndex } = buildCompanionRoute(points, anchorIndex);
  if (!waypoints.length) {
    stopMapCompanionController();
    return;
  }

  const now = performance.now();
  const previousLessonId = controller.companion.dataset.lessonId || "";
  const nextLessonId = activeLessonId || "";
  const isLessonChanged = previousLessonId && nextLessonId && previousLessonId !== nextLessonId;
  const isFirstReveal = !controller.companion.classList.contains("is-ready");
  controller.companion.dataset.lessonId = nextLessonId;
  controller.companion.classList.add("is-ready");
  if (isFirstReveal || isLessonChanged) {
    triggerCompanionArrival(controller.companion);
    const introMessage = isLessonChanged
      ? pickCompanionMessage(controller, MAP_COMPANION_CHAT.patrol, "Jom sambung lesson seterusnya!")
      : pickCompanionMessage(controller, MAP_COMPANION_CHAT.inspect, "Hi, saya pbot 👋");
    showCompanionChat(controller, introMessage, {
      now,
      durationMs: 1900,
      priority: true,
    });
  }

  const routeSignature = waypoints
    .map((waypoint) => `${waypoint.nodeIndex}:${Math.round(waypoint.x)}:${Math.round(waypoint.y)}`)
    .join("|");
  const routeChanged = controller.routeSignature !== routeSignature;
  controller.routeSignature = routeSignature;
  controller.route = waypoints;

  const safeFocusIndex = clamp(focusIndex, 0, waypoints.length - 1);

  if (!controller.position || routeChanged) {
    if (controller.position && routeChanged) {
      const nearestRouteIndex = findNearestWaypointIndex(waypoints, controller.position);
      controller.waypointIndex = nearestRouteIndex >= 0 ? nearestRouteIndex : safeFocusIndex;
    } else {
      controller.waypointIndex = safeFocusIndex;
    }
    const spawn = waypoints[controller.waypointIndex] || waypoints[0];
    setCompanionPosition(controller, spawn.x, spawn.y, spawn.side || "right");
    controller.target = null;
    controller.waitUntil = now + randomBetween(220, 640);
    controller.lastProgressAt = now;
    controller.replanAttempts = 0;
    controller.nextChatAt = now + randomBetween(900, 1900);
    setCompanionState(controller, waypoints.length > 1 ? MAP_COMPANION_STATES.PATROL_ROUTE : MAP_COMPANION_STATES.IDLE);
  } else {
    const nearestRouteIndex = findNearestWaypointIndex(waypoints, controller.position);
    controller.waypointIndex = nearestRouteIndex >= 0 ? nearestRouteIndex : safeFocusIndex;
  }

  controller.waypointDirection = controller.waypointIndex >= waypoints.length - 1 ? -1 : 1;
  controller.companion.classList.add("is-visible");

  if (controller.reducedMotion || waypoints.length <= 1) {
    clearMapCompanionAnimationLoop(controller);
    const hold = waypoints[safeFocusIndex] || waypoints[0];
    setCompanionPosition(controller, hold.x, hold.y, hold.side || "right");
    setCompanionState(controller, MAP_COMPANION_STATES.PATROL_ROUTE);
    return;
  }

  startMapCompanionAnimationLoop(controller);
}

function renderZigzagMap(track, lessons, progress) {
  const mapCard = document.getElementById("track-map") || document.getElementById("level-map");
  const mapSvg = document.getElementById("map-svg");
  const nodesLayer = document.getElementById("nodes-layer");
  const mapStage = mapCard?.querySelector(".map-stage");

  if (!mapCard || !mapSvg || !nodesLayer || !mapStage || typeof SVGPathElement === "undefined") {
    stopMapCompanionController();
    return { rendered: false };
  }

  const width = Math.max(320, Math.round(mapStage.clientWidth || mapCard.clientWidth || 760));
  const checkpointLayout = buildImageRoutePoints(track.id, lessons.length, width);
  const points = checkpointLayout.points;
  const height = checkpointLayout.stageHeight;
  const currentIndex = findCurrentIndex(lessons, progress);
  const completedIndex = findCompletedIndex(lessons, progress);

  mapStage.style.height = `${height}px`;
  mapStage.style.setProperty("--map-image-width", String(width));
  mapStage.style.setProperty("--map-image-height", String(height));
  mapSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  mapSvg.innerHTML = "";

  nodesLayer.innerHTML = "";
  let activePoint = null;
  let activeLessonId = "";

  const openLesson = (lessonId) => {
    window.location.href = `./lesson.html?track=${encodeURIComponent(track.id)}&lesson=${encodeURIComponent(lessonId)}`;
  };

  lessons.forEach((lesson, idx) => {
    const point = points[idx];
    const entry = progress[lesson.lesson_id] || { done: false, stars: 0 };
    const done = Boolean(entry.done);
    const unlocked = isUnlocked(lessons, idx, progress);
    const locked = !unlocked;
    const current = idx === currentIndex;
    const active = current && unlocked && !done;
    const safeStars = Math.max(0, Math.min(3, Number(entry.stars) || 0));
    const nodeBadgeSymbol = done ? "✓" : locked ? "🔒" : "▶";
    const nodeBadgeStateClass = done ? "is-done" : locked ? "is-locked" : "is-open";

    const item = document.createElement("article");
    item.className = `map-item side-${point.side}`;
    if (done) item.classList.add("is-done");
    if (locked) item.classList.add("is-locked");
    if (current) item.classList.add("is-current");
    if (active) item.classList.add("is-active");
    if (active) {
      activePoint = point;
      activeLessonId = lesson.lesson_id;
    }
    item.style.left = `${point.x}px`;
    item.style.top = `${point.y}px`;

    const nodeBtn = document.createElement("button");
    nodeBtn.type = "button";
    nodeBtn.className = "level-node";
    nodeBtn.setAttribute("aria-label", locked ? `Pelajaran dikunci: ${lesson.tajuk}` : `Buka lesson ${lesson.no}: ${lesson.tajuk}`);
    nodeBtn.innerHTML = `
      <span class="node-core"><span class="node-number">${lesson.no}</span></span>
      <span class="node-badge ${nodeBadgeStateClass}" aria-hidden="true">${nodeBadgeSymbol}</span>
    `;

    const labelBtn = document.createElement("button");
    labelBtn.type = "button";
    labelBtn.className = "map-label lesson-card";
    if (done) labelBtn.classList.add("is-done");
    if (locked) labelBtn.classList.add("is-locked");
    if (current) labelBtn.classList.add("is-current");
    if (active) labelBtn.classList.add("is-active");
    labelBtn.setAttribute("aria-label", locked ? `Dikunci: ${lesson.tajuk}` : `Buka: ${lesson.tajuk}`);
    const starsMeter = [1, 2, 3]
      .map((index) => `<span class="star ${safeStars >= index ? "is-on" : "is-off"}" aria-hidden="true">★</span>`)
      .join("");

    labelBtn.innerHTML = `
      <span class="lesson-main">
        <span class="lesson-title">${lesson.tajuk}</span>
        <span class="lesson-meta-row">
          <span class="mins-chip">${lesson.mins} min</span>
        </span>
      </span>
      <span class="stars ${done && safeStars > 0 ? "spark-once" : ""}" aria-label="Bintang ${safeStars} daripada 3">${starsMeter}</span>
    `;

    const addTempClass = (el, className, ms) => {
      el.classList.remove(className);
      void el.offsetWidth;
      el.classList.add(className);
      window.setTimeout(() => el.classList.remove(className), ms);
    };

    const inspectMessage = () => pickCompanionMessage(mapCompanionController, MAP_COMPANION_CHAT.inspect, "Nak tengok lesson ni?");
    const openMessage = () => pickCompanionMessage(mapCompanionController, MAP_COMPANION_CHAT.open, "Jom mula lesson ni!");
    const lockedMessage = () => pickCompanionMessage(mapCompanionController, MAP_COMPANION_CHAT.locked, "Yang ni masih kunci 🔒");

    const onTap = (event) => {
      event.preventDefault();
      if (locked) {
        queueMapCompanionReaction(mapStage, point, point.side, lockedMessage());
        addTempClass(nodeBtn, "shake", 260);
        addTempClass(labelBtn, "shake", 260);
        showToast("Selesaikan pelajaran sebelum ini untuk buka 😊");
        return;
      }
      queueMapCompanionReaction(mapStage, point, point.side, openMessage());
      addTempClass(nodeBtn, "is-pressed", 180);
      addTempClass(labelBtn, "is-pressed", 180);
      addTempClass(nodeBtn, "is-bounce", 200);
      addTempClass(labelBtn, "is-bounce", 220);

      if (item.dataset.opening === "1") return;
      item.dataset.opening = "1";
      const delay = prefersReducedMotion() ? 0 : 140;
      window.setTimeout(() => {
        openLesson(lesson.lesson_id);
      }, delay);
    };

    nodeBtn.addEventListener("click", onTap);
    labelBtn.addEventListener("click", onTap);
    nodeBtn.addEventListener("pointerenter", () => queueMapCompanionReaction(mapStage, point, point.side, inspectMessage()));
    labelBtn.addEventListener("pointerenter", () => queueMapCompanionReaction(mapStage, point, point.side, inspectMessage()));
    nodeBtn.addEventListener("focus", () => queueMapCompanionReaction(mapStage, point, point.side, inspectMessage()));
    labelBtn.addEventListener("focus", () => queueMapCompanionReaction(mapStage, point, point.side, inspectMessage()));

    item.append(nodeBtn, labelBtn);
    nodesLayer.append(item);

    if (lesson.no % 5 === 0) {
      const flag = document.createElement("span");
      flag.className = "milestone-flag";
      flag.textContent = "🚩";
      flag.style.left = `${point.x + (point.side === "left" ? 30 : -30)}px`;
      flag.style.top = `${point.y - 22}px`;
      nodesLayer.append(flag);
    }
  });

  if (activePoint) {
    const here = document.createElement("span");
    here.className = "you-are-here";
    here.textContent = "You're here!";
    here.style.left = `${activePoint.x}px`;
    here.style.top = `${activePoint.y - 56}px`;
    nodesLayer.append(here);
  }

  const companionAnchorIndex = currentIndex === -1 ? Math.max(0, completedIndex) : currentIndex;
  const companionLessonId = activeLessonId || lessons[companionAnchorIndex]?.lesson_id || "";
  syncMapCompanionPatrol(mapStage, points, {
    anchorIndex: companionAnchorIndex,
    activeLessonId: companionLessonId,
  });

  return { rendered: true };
}

function renderIndex() {
  const cards = document.getElementById("track-cards");
  const overall = document.getElementById("overall-progress");
  const stars = document.getElementById("overall-stars");
  const overallDoneCount = document.getElementById("overall-done-count");
  const overallTotalCount = document.getElementById("overall-total-count");
  const rewardNote = document.getElementById("overall-reward-note");

  cards.innerHTML = "";
  tracksCache.forEach((track) => {
    const p = computeProgressByTrack(track.id);
    const lockedCount = Math.max(0, p.total - p.done);
    const ctaLabel = p.done > 0 ? "Sambung" : "Mulakan";
    const card = document.createElement("a");
    card.className = `card track-card track-card--${track.id}`;
    card.href = `./track.html?track=${encodeURIComponent(track.id)}`;
    card.setAttribute("aria-label", `${track.title}. ${p.done}/${p.total} selesai. ${ctaLabel}`);
    card.innerHTML = `
      <div class="track-card-title">
        <h2>${track.title}</h2>
        <span class="track-icon" aria-hidden="true">${getTrackIcon(track.id)}</span>
      </div>
      <p class="meta">${track.desc}</p>
      <div class="track-card-hud">
        <p class="track-card-ratio"><span>${p.done}</span><span class="track-card-ratio-sep">/</span><span>${p.total}</span></p>
        <p class="track-card-ratio-label">Selesai</p>
      </div>
      <div class="progress-shell dashboard-progress-shell" aria-hidden="true">
        <div class="progress-fill dashboard-progress-fill" style="width:${toPercent(p.done, p.total)}%"></div>
      </div>
      <p class="track-card-meta" aria-label="Stat track">
        ⭐ ${p.stars} bintang • 🔒 ${lockedCount} belum
      </p>
      <div class="track-card-footer">
        <span class="track-card-cta" aria-hidden="true">${ctaLabel}</span>
      </div>
    `;
    cards.append(card);
  });

  const t = totalProgress();
  overall.textContent = `${t.doneLessons}/${t.totalLessons} selesai`;
  if (overallDoneCount) overallDoneCount.textContent = String(t.doneLessons);
  if (overallTotalCount) overallTotalCount.textContent = String(t.totalLessons);
  stars.textContent = String(t.stars);
  if (rewardNote) {
    rewardNote.textContent = `🎁 Ganjaran seterusnya: Badge bila capai 10/${t.totalLessons}`;
  }
  setProgressFill("overall-progress-fill", t.doneLessons, t.totalLessons);

  const resetBtn = document.getElementById("reset-progress-btn");
  const dialog = document.getElementById("reset-dialog");
  const cancelBtn = document.getElementById("cancel-reset-btn");
  const confirmBtn = document.getElementById("confirm-reset-btn");

  resetBtn.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      const accepted = window.confirm("Semua progress akan dipadam. Teruskan?");
      if (accepted) {
        localStorage.removeItem(PROGRESS_KEY);
        window.location.reload();
      }
    }
  });

  cancelBtn.addEventListener("click", () => dialog.close());
  confirmBtn.addEventListener("click", () => {
    localStorage.removeItem(PROGRESS_KEY);
    dialog.close();
    window.location.reload();
  });
}

function renderTrack() {
  const trackId = qs("track");
  const track = getTrack(trackId);

  if (!track) {
    showError("track-error", "Track tidak dijumpai.", true);
    return;
  }

  document.body.dataset.trackTheme = track.id;

  const header = document.getElementById("track-header");
  const progressText = document.getElementById("track-progress");
  const list = document.getElementById("track-lessons");
  const mapCard = document.getElementById("track-map") || document.getElementById("level-map");
  const doneCountEl = document.getElementById("track-done-count");
  const totalCountEl = document.getElementById("track-total-count");
  const chipsWrap = document.getElementById("track-hud-chips");
  const chipCompleteEl = document.getElementById("track-chip-complete");
  const chipStarsEl = document.getElementById("track-chip-stars");

  header.innerHTML = `<p class="meta">${getTrackIcon(track.id)} ${track.desc}</p><h1>${track.title}</h1>`;

  const lessons = lessonsCache
    .filter((lesson) => lesson.track_id === track.id)
    .sort((a, b) => a.no - b.no);

  function renderTrackUI() {
    const progress = loadProgress();
    const p = computeProgressByTrack(track.id);
    progressText.textContent = `Kemajuan: ${p.done}/${p.total} selesai`;
    setProgressFill("track-progress-fill", p.done, p.total);
    if (doneCountEl) doneCountEl.textContent = String(p.done);
    if (totalCountEl) totalCountEl.textContent = String(p.total);
    if (chipCompleteEl) chipCompleteEl.textContent = `✅ ${p.done}/${p.total} selesai`;
    if (chipStarsEl) chipStarsEl.textContent = `⭐ ${p.stars} bintang`;

    const hudKey = `${p.done}|${p.total}|${p.stars}`;
    if (chipsWrap && chipsWrap.dataset.lastHud !== hudKey) {
      chipsWrap.dataset.lastHud = hudKey;
      [chipCompleteEl, chipStarsEl].forEach((chip) => {
        if (!chip) return;
        chip.classList.remove("is-pop");
        void chip.offsetWidth;
        chip.classList.add("is-pop");
      });
    }

    if (!lessons.length) {
      if (mapCard) mapCard.hidden = true;
      list.hidden = true;
      stopMapCompanionController();
      return;
    }

    const mapState = renderZigzagMap(track, lessons, progress);
    if (mapState.rendered) {
      if (mapCard) mapCard.hidden = false;
      list.hidden = true;
      list.innerHTML = "";
    } else {
      if (mapCard) mapCard.hidden = true;
      list.hidden = false;
      stopMapCompanionController();
      renderTrackListFallback(list, track, lessons, progress);
    }
  }

  renderTrackUI();

  if (trackResizeHandler) {
    window.removeEventListener("resize", trackResizeHandler);
  }
  trackResizeHandler = () => {
    window.clearTimeout(trackResizeDebounceTimer);
    trackResizeDebounceTimer = window.setTimeout(() => {
      renderTrackUI();
    }, 120);
  };
  window.addEventListener("resize", trackResizeHandler, { passive: true });

  sessionStorage.removeItem(UI_STAMP_KEY);
}

function getYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch (_error) {
    return "";
  }
  return "";
}

function getYoutubeOverlayUrl(url) {
  const embed = getYoutubeEmbedUrl(url);
  if (!embed) return "";
  try {
    const parsed = new URL(embed);
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("rel", "0");
    parsed.searchParams.set("modestbranding", "1");
    return parsed.toString();
  } catch (_error) {
    return embed;
  }
}

function renderVideo(videoUrl) {
  if (!videoUrl) {
    return {
      html: `
        <div class="placeholder">
          <img src="./assets/placeholder-video.svg" alt="Ilustrasi ruang video" class="placeholder-art" />
          <p class="meta">Video belum diisi</p>
        </div>
      `,
      actionEnabled: false,
    };
  }

  if (isYoutubeUrl(videoUrl)) {
    const embedUrl = getYoutubeEmbedUrl(videoUrl) || videoUrl;
    return {
      html: `<iframe class="embed" src="${embedUrl}" title="Video lesson" allowfullscreen></iframe>`,
      actionEnabled: true,
      actionUrl: videoUrl,
    };
  }

  return {
    html: '<p class="meta">Video tersedia sebagai pautan luar.</p>',
    actionEnabled: true,
    actionUrl: videoUrl,
  };
}

function renderCanva(canvaUrl) {
  if (!canvaUrl) {
    return `
      <div class="placeholder">
        <img src="./assets/placeholder-canva.svg" alt="Ilustrasi ruang Canva" class="placeholder-art" />
        <p class="meta">Canva belum diisi</p>
      </div>
    `;
  }

  return `<iframe class="embed" src="${canvaUrl}" title="Canva lesson"></iframe>`;
}

const LESSON_STEP_KEYS = ["video", "learn", "practice"];

function normalizeLessonSteps(steps) {
  return {
    video: Boolean(steps?.video),
    learn: Boolean(steps?.learn),
    practice: Boolean(steps?.practice),
  };
}

function countDoneLessonSteps(steps) {
  const safe = normalizeLessonSteps(steps);
  return LESSON_STEP_KEYS.reduce((sum, key) => sum + (safe[key] ? 1 : 0), 0);
}

function renderLesson() {
  const trackId = qs("track");
  const lessonId = qs("lesson");

  const track = getTrack(trackId);
  const lesson = getLesson(lessonId);

  if (!track) {
    showError("lesson-error", "Track tidak dijumpai.", true);
    return;
  }

  if (!lesson || lesson.track_id !== track.id) {
    showError("lesson-error", "Lesson tidak dijumpai.", true);
    return;
  }

  document.body.dataset.trackTheme = track.id;

  const backLink = document.getElementById("lesson-back-link");
  const header = document.getElementById("lesson-header");
  const videoActionBtn = document.getElementById("video-action-btn");
  const videoContent = document.getElementById("video-content");
  const canvaContent = document.getElementById("canva-content");
  const overlay = document.getElementById("overlay");
  const overlayContent = document.getElementById("overlay-content");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayCloseBtn = document.getElementById("overlay-close");
  const stepProgressText = document.getElementById("lesson-steps-progress-text");
  const stepProgressFill = document.getElementById("lesson-steps-progress-fill");
  const starsReadout = document.getElementById("lesson-stars-readout");
  const nextLessonBtn = document.getElementById("next-lesson-btn");
  const stepCards = Array.from(document.querySelectorAll(".step-card"));
  const stepButtons = Array.from(document.querySelectorAll("[data-step-action]"));
  const stepMenuToggles = Array.from(document.querySelectorAll("[data-step-menu-toggle]"));
  const stepMenuItems = Array.from(document.querySelectorAll("[data-step-menu-action]"));
  const starsSelect = document.getElementById("stars-select");
  const status = document.getElementById("lesson-status");
  const trackLessons = lessonsCache
    .filter((item) => item.track_id === track.id)
    .sort((a, b) => a.no - b.no);
  const currentLessonIndex = trackLessons.findIndex((item) => item.lesson_id === lesson.lesson_id);
  const nextLesson = currentLessonIndex >= 0 ? trackLessons[currentLessonIndex + 1] || null : null;
  let overlayLastActiveElement = null;
  let overlayFallbackTimer = null;

  backLink.href = `./track.html?track=${encodeURIComponent(track.id)}`;
  backLink.textContent = `← Kembali ke ${track.title}`;

  header.innerHTML = `
    <p class="lesson-track-name">${track.title}</p>
    <h1>${lesson.no}. ${lesson.tajuk}</h1>
    <p class="lesson-mini-meta">${lesson.mins} min</p>
  `;

  const videoRender = renderVideo(lesson.video_url);
  videoContent.innerHTML = videoRender.html;
  canvaContent.innerHTML = renderCanva(lesson.canva_embed_url);

  function safeOverlayUrl(url) {
    if (!url) return "";
    try {
      return new URL(url, window.location.href).toString();
    } catch (_error) {
      return "";
    }
  }

  function clearOverlayContent() {
    if (overlayFallbackTimer) {
      window.clearTimeout(overlayFallbackTimer);
      overlayFallbackTimer = null;
    }
    if (overlayContent) {
      overlayContent.innerHTML = "";
    }
  }

  function getOverlayFocusableElements() {
    if (!overlay) return [];
    return Array.from(
      overlay.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("hidden") && !el.closest("[hidden]"));
  }

  function closeOverlay() {
    if (!overlay || overlay.hidden) return;
    clearOverlayContent();
    overlay.hidden = true;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onOverlayKeydown, true);
    if (overlayLastActiveElement && typeof overlayLastActiveElement.focus === "function") {
      overlayLastActiveElement.focus();
    }
    overlayLastActiveElement = null;
  }

  function onOverlayKeydown(event) {
    if (!overlay || overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeOverlay();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getOverlayFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      if (overlayCloseBtn) overlayCloseBtn.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !overlay.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !overlay.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function openOverlay({ type, url, title, message }) {
    if (!overlay || !overlayContent || !overlayCloseBtn) return;

    const normalizedType = type || "html";
    const normalizedUrl = safeOverlayUrl(url);
    const contentTitle = title || "Viewer";
    const placeholderMessage = message || "Kandungan belum diisi.";

    overlayLastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    clearOverlayContent();

    if (overlayTitle) {
      overlayTitle.textContent = contentTitle;
    }

    if (normalizedType === "youtube" && normalizedUrl) {
      const embedUrl = getYoutubeOverlayUrl(normalizedUrl);
      if (embedUrl) {
        overlayContent.innerHTML = `<iframe class="overlay-frame" src="${embedUrl}" title="${contentTitle}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      } else {
        overlayContent.innerHTML = `<div class="overlay-placeholder"><h3>Tidak dapat paparkan video</h3><p>Link video tidak sah.</p></div>`;
      }
    } else if (normalizedType === "canva" && normalizedUrl) {
      overlayContent.innerHTML = `<iframe class="overlay-frame" src="${normalizedUrl}" title="${contentTitle}" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    } else if (normalizedType === "html" || !normalizedUrl) {
      overlayContent.innerHTML = `<div class="overlay-placeholder"><h3>${contentTitle}</h3><p>${placeholderMessage}</p></div>`;
    } else {
      overlayContent.innerHTML = `
        <div class="overlay-stack">
          <iframe class="overlay-frame" src="${normalizedUrl}" title="${contentTitle}" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <div class="overlay-fallback" hidden>
            <p>Jika kandungan tidak dapat dipaparkan, buka di tab baru.</p>
            <button type="button" class="btn secondary overlay-open-tab-btn" data-overlay-open-tab>Buka di tab baru</button>
          </div>
        </div>
      `;

      const fallback = overlayContent.querySelector(".overlay-fallback");
      if (fallback) {
        overlayFallbackTimer = window.setTimeout(() => {
          fallback.hidden = false;
        }, 1400);
      }

      const openTabBtn = overlayContent.querySelector("[data-overlay-open-tab]");
      if (openTabBtn) {
        openTabBtn.addEventListener("click", () => {
          window.open(normalizedUrl, "_blank", "noopener,noreferrer");
        });
      }
    }

    overlay.hidden = false;
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onOverlayKeydown, true);

    window.setTimeout(() => {
      overlayCloseBtn.focus();
    }, 0);
  }

  if (overlayCloseBtn) {
    overlayCloseBtn.addEventListener("click", closeOverlay);
  }

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      const target = event.target;
      if (target === overlay || (target instanceof HTMLElement && target.dataset.overlayClose === "backdrop")) {
        closeOverlay();
      }
    });
  }

  if (videoActionBtn) {
    videoActionBtn.disabled = false;
    videoActionBtn.addEventListener("click", () => {
      if (videoRender.actionEnabled) {
        openOverlay({
          type: isYoutubeUrl(videoRender.actionUrl) ? "youtube" : "default",
          url: videoRender.actionUrl,
          title: "Lihat Video",
        });
      } else {
        openOverlay({
          type: "html",
          title: "Lihat Video",
          message: "Video belum diisi",
        });
      }
    });
  }

  function closeStepMenus() {
    stepCards.forEach((card) => {
      const menu = card.querySelector(".step-menu");
      const toggle = card.querySelector("[data-step-menu-toggle]");
      if (menu) menu.hidden = true;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function persistLessonSteps(stepKey, doneValue) {
    const nextProgress = loadProgress();
    const existing = nextProgress[lesson.lesson_id] || {};
    const nextSteps = normalizeLessonSteps(existing.steps);
    nextSteps[stepKey] = Boolean(doneValue);
    const doneCount = countDoneLessonSteps(nextSteps);

    nextProgress[lesson.lesson_id] = {
      done: doneCount === LESSON_STEP_KEYS.length,
      stars: doneCount,
      updatedAt: Date.now(),
      steps: nextSteps,
    };

    saveProgress(nextProgress);
    renderStepUI(nextProgress[lesson.lesson_id]);
    return doneCount;
  }

  function renderStepUI(entry) {
    const hasStoredSteps =
      typeof entry?.steps === "object" && LESSON_STEP_KEYS.some((key) => typeof entry.steps[key] === "boolean");
    let steps = normalizeLessonSteps(entry?.steps);

    if (!hasStoredSteps) {
      const legacyStars = Math.max(0, Math.min(3, Number(entry?.stars) || 0));
      LESSON_STEP_KEYS.forEach((stepKey, index) => {
        steps[stepKey] = index < legacyStars;
      });
      if (entry?.done && legacyStars === 0) {
        steps = { video: true, learn: true, practice: true };
      }
    }
    const doneCount = countDoneLessonSteps(steps);
    stepProgressText.textContent = `Kemajuan Pelajaran: ${doneCount}/3 langkah selesai`;
    stepProgressFill.style.width = `${Math.round((doneCount / LESSON_STEP_KEYS.length) * 100)}%`;

    const stars = Math.max(0, Math.min(3, doneCount));
    starsReadout.innerHTML = `
      <span class="stars-title">Bintang</span>
      <span class="stars-badge">
        <span class="star-icon ${stars >= 1 ? "on" : "off"}">⭐</span>
        <span class="star-icon ${stars >= 2 ? "on" : "off"}">⭐</span>
        <span class="star-icon ${stars >= 3 ? "on" : "off"}">⭐</span>
      </span>
      <span class="stars-count">${stars}/3</span>
    `;
    starsSelect.value = String(stars);

    if (nextLessonBtn) {
      const complete = doneCount === LESSON_STEP_KEYS.length;
      nextLessonBtn.hidden = !complete;
      if (complete && nextLesson) {
        nextLessonBtn.disabled = false;
        nextLessonBtn.textContent = "Pelajaran Seterusnya →";
      } else if (complete) {
        nextLessonBtn.disabled = false;
        nextLessonBtn.textContent = "Kembali ke Track";
      }
    }

    stepCards.forEach((card) => {
      const stepKey = card.dataset.step;
      const done = Boolean(steps[stepKey]);
      const statusChip = card.querySelector(".step-status");
      const startBtn = card.querySelector("[data-step-action]");
      const menuDoneBtn = card.querySelector('[data-step-menu-action="done"]');
      const menuUndoneBtn = card.querySelector('[data-step-menu-action="undone"]');

      card.classList.toggle("is-done", done);
      card.classList.toggle("is-pending", !done);

      if (statusChip) {
        statusChip.textContent = done ? "Selesai" : "Belum mula";
        statusChip.classList.toggle("done", done);
        statusChip.classList.toggle("pending", !done);
      }

      if (startBtn) {
        startBtn.disabled = done;
        startBtn.textContent = done ? "✓" : "Mula";
        startBtn.classList.toggle("is-done", done);
      }

      if (menuDoneBtn) menuDoneBtn.hidden = done;
      if (menuUndoneBtn) menuUndoneBtn.hidden = !done;
    });
  }

  const progress = loadProgress();
  const current = progress[lesson.lesson_id];
  if (current) {
    status.textContent = current.done ? "Semua aktiviti selesai. Tekan pelajaran seterusnya." : "";
  } else {
    status.textContent = "";
  }
  renderStepUI(current);

  if (nextLessonBtn) {
    nextLessonBtn.addEventListener("click", () => {
      if (nextLesson) {
        window.location.href = `./lesson.html?track=${encodeURIComponent(track.id)}&lesson=${encodeURIComponent(
          nextLesson.lesson_id
        )}`;
      } else {
        window.location.href = `./track.html?track=${encodeURIComponent(track.id)}`;
      }
    });
  }

  stepMenuToggles.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const stepKey = toggleBtn.dataset.stepMenuToggle;
      const menu = document.querySelector(`[data-step-menu="${stepKey}"]`);
      if (!menu) return;

      const willOpen = menu.hidden;
      closeStepMenus();
      menu.hidden = !willOpen;
      toggleBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  stepMenuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", (event) => {
      event.stopPropagation();
      const stepKey = menuItem.dataset.stepTarget;
      const action = menuItem.dataset.stepMenuAction;
      if (!LESSON_STEP_KEYS.includes(stepKey)) return;

      const doneCount = persistLessonSteps(stepKey, action === "done");
      closeStepMenus();

      if (doneCount === LESSON_STEP_KEYS.length) {
        status.textContent = "Semua aktiviti selesai. Tekan pelajaran seterusnya.";
      } else if (action === "done") {
        status.textContent = `Langkah ditanda selesai (${doneCount}/3).`;
      } else {
        status.textContent = `Langkah ditanda belum selesai (${doneCount}/3).`;
      }
      showToast(action === "done" ? "Ditanda selesai" : "Ditanda tak selesai");
    });
  });

  document.addEventListener("click", () => {
    closeStepMenus();
  });

  stepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepKey = btn.dataset.stepAction;
      if (!LESSON_STEP_KEYS.includes(stepKey)) return;

      let overlayConfig = {
        type: "html",
        title: "Aktiviti",
        message: "Content belum diisi",
      };

      if (stepKey === "video") {
        if (!lesson.video_url) {
          overlayConfig = {
            type: "html",
            title: "Lihat Video",
            message: "Video belum diisi",
          };
          openOverlay(overlayConfig);
          showToast("Video belum diisi");
          return;
        }
        overlayConfig = {
          type: isYoutubeUrl(lesson.video_url) ? "youtube" : "default",
          url: lesson.video_url,
          title: "Lihat Video",
        };
      } else if (stepKey === "learn") {
        if (!lesson.canva_embed_url) {
          overlayConfig = {
            type: "html",
            title: "Pembelajaran",
            message: "Bahan pembelajaran belum diisi",
          };
          openOverlay(overlayConfig);
          showToast("Content belum diisi");
          return;
        }
        overlayConfig = {
          type: "canva",
          url: lesson.canva_embed_url,
          title: "Pembelajaran",
        };
      } else if (stepKey === "practice") {
        if (!lesson.public_github_url) {
          overlayConfig = {
            type: "html",
            title: "Latihan Mengira",
            message: "Latihan belum diisi",
          };
          openOverlay(overlayConfig);
          showToast("Content belum diisi");
          return;
        }
        overlayConfig = {
          type: "default",
          url: lesson.public_github_url,
          title: "Latihan Mengira",
        };
      }

      const doneCount = persistLessonSteps(stepKey, true);
      openOverlay(overlayConfig);

      if (doneCount === LESSON_STEP_KEYS.length) {
        status.textContent = "Semua aktiviti selesai. Tekan pelajaran seterusnya.";
        showToast("Hebat! 3/3 selesai");
      } else {
        status.textContent = `Langkah disimpan (${doneCount}/3).`;
        showToast("Disimpan");
      }
    });
  });
}

async function init() {
  try {
    [tracksCache, lessonsCache, checkpointsCache] = await Promise.all([
      loadJSON("./data/tracks.json"),
      loadJSON("./data/lessons.json"),
      loadCheckpointConfig(),
    ]);

    applyMascotTips();

    const page = document.body.dataset.page;

    if (page === "index") {
      renderIndex();
    } else if (page === "track") {
      renderTrack();
    } else if (page === "lesson") {
      renderLesson();
    }

    applyPopInStagger();
  } catch (error) {
    const fallback = document.createElement("div");
    fallback.className = "container";
    fallback.innerHTML = `<div class="error">Ralat semasa memuat data: ${error.message}</div>`;
    document.body.innerHTML = "";
    document.body.append(fallback);
  }
}

init();
