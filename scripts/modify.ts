import fs from 'node:fs'

const info = fs
  .readFileSync('./src/main/utils/http.ts', { encoding: 'utf-8' })
  .replaceAll('@main/utils/fingerprint.js', '@main/utils/rand.js')

fs.writeFileSync('./src/main/utils/http.ts', info)
