import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.resolve(__dirname, '../src/data/content.csv')
const outputPath = path.resolve(__dirname, '../src/data/content-map.json')

const readCsv = (raw) => {
  const rows = []
  let current = []
  let value = ''
  let inQuotes = false

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i]
    const next = raw[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      current.push(value)
      value = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      current.push(value)
      value = ''
      if (current.some((cell) => cell.length > 0)) {
        rows.push(current)
      }
      current = []
      continue
    }

    value += char
  }

  if (value.length || current.length) {
    current.push(value)
    if (current.some((cell) => cell.length > 0)) {
      rows.push(current)
    }
  }

  return rows
}

const trimRow = (row) => row.map((cell) => (cell || '').trim())

const rows = readCsv(fs.readFileSync(csvPath, 'utf8')).map(trimRow)

const normalizeYouTube = (value) => {
  if (!value) return ''
  try {
    const parsed = new URL(value)
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/embed/${id}` : value
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      const match = parsed.pathname.match(/\/embed\/(.+)$/)
      if (match) return `https://www.youtube.com/embed/${match[1]}`
    }
    return value
  } catch {
    return value
  }
}

let bmHeader = null
let mgHeader = null
let mgStart = null

rows.forEach((row, index) => {
  if (row[0]?.startsWith('Bahasa Melayu')) {
    bmHeader = null
  }
  if (row[0] === 'No' && bmHeader === null) {
    bmHeader = index
  }
  if (row[0]?.includes('Matematik - Mengira')) {
    mgStart = index
  }
  if (mgStart !== null && row[0] === 'No' && mgHeader === null) {
    mgHeader = index
  }
})

const bmRows = []
if (bmHeader !== null) {
  for (let i = bmHeader + 1; i < rows.length; i += 1) {
    const row = rows[i]
    if (row[0]?.includes('Matematik - Mengira')) break
    if (row[0] && /^\d+$/.test(row[0])) bmRows.push(row)
  }
}

const mgRows = []
if (mgHeader !== null) {
  for (let i = mgHeader + 1; i < rows.length; i += 1) {
    const row = rows[i]
    if (row[0] && /^\d+$/.test(row[0])) mgRows.push(row)
  }
}

const mapping = {
  'membaca-menulis': {},
  mengira: {},
}

bmRows.forEach((row) => {
  const no = row[0]
  mapping['membaca-menulis'][no] = {
    title: row[1] || '',
    pembelajaran: row[2] || '',
    latihanMembaca: row[3] || '',
    latihanMenulis: row[4] || '',
    video1: normalizeYouTube(row[5] || ''),
    video2: normalizeYouTube(row[6] || ''),
    video3: normalizeYouTube(row[7] || ''),
  }
})

mgRows.forEach((row) => {
  const no = row[0]
  mapping.mengira[no] = {
    title: row[1] || '',
    github: row[2] || '',
    canva: row[3] || '',
    video1: normalizeYouTube(row[4] || ''),
  }
})

fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))
console.log('Generated', outputPath)
