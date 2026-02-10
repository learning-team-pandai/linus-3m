import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.resolve(__dirname, '../src/data/content.csv')
const generatorPath = path.resolve(__dirname, './generate-content-map.js')

const run = () => {
  execFile('node', [generatorPath], (error, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout)
    if (stderr) process.stderr.write(stderr)
    if (error) console.error('Generator failed:', error)
  })
}

run()

fs.watch(csvPath, { persistent: true }, () => {
  run()
})
