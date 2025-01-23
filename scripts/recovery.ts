import fs from 'fs'

const info = fs
  .readFileSync('./src/main/utils/http.ts', { encoding: 'utf-8' })
  .replaceAll('@main/utils/rand.js', '@main/utils/fingerprint.js')

fs.writeFileSync('./src/main/utils/http.ts', info)
