import { defineIpcLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { success } from '@main/utils/response.ts'
import fs from 'fs-extra'
import path from 'node:path'

const configPath = path.join(process.cwd(), '/config')
const configFile = path.join(configPath, '/config.json')

export const getConfig = (): config => {
  const json = fs.readJSONSync(configFile)
  return {
    ...defaultConfig,
    ...json
  }
}

export const saveConfig = (config: config) => {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
}

export interface config {
  general: {
    theme: 'system' | 'light' | 'dark'
  }
  parse: {
    server: string
  }
  aria2: {}
}

export const defaultConfig: config = {
  general: {
    theme: 'system'
  },
  parse: {
    server: 'http://127.0.0.1:8000'
  },
  aria2: {}
}

if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true })
if (!fs.existsSync(configFile)) saveConfig(defaultConfig)

export let nowConfig = getConfig()

export default defineIpcLoader(() => {
  defineIpcHandle('config.get', () => {
    return success(nowConfig)
  })

  defineIpcHandle('config.save', (_, config: config) => {
    saveConfig(config)
    nowConfig = getConfig()
    return success()
  })
})
