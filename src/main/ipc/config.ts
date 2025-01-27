import { is } from '@electron-toolkit/utils'
import { defineLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { success } from '@main/utils/response.ts'
import { app } from 'electron'
import { existsSync, mkdirsSync, readJSONSync, writeJsonSync } from 'fs-extra'
import { join } from 'node:path'

const configPath = join(process.cwd(), '/config')
const configFile = join(configPath, '/config.json')
const downloadPath = join(app.getPath('downloads'), 'hklist-client')

export const getConfig = (): config => {
  const json = readJSONSync(configFile)
  json.dev = is.dev || process.argv.includes('--dev')
  return {
    ...defaultConfig,
    ...json
  }
}

export const saveConfig = (config: config) => {
  writeJsonSync(configFile, config, { spaces: 2 })
}

export interface config {
  dev: boolean
  general: {
    theme: 'system' | 'light' | 'dark'
  }
  parse: {
    server: string
  }
  aria2: {
    dir: string
    'rpc-listen-port': number
    'rpc-secret': string
    'max-concurrent-downloads': number
    split: number
    'max-overall-download-limit': number
  }
}

export const defaultConfig: config = {
  dev: false,
  general: {
    theme: 'system'
  },
  parse: {
    server: 'http://127.0.0.1:8000'
  },
  aria2: {
    dir: downloadPath,
    'rpc-listen-port': 26800,
    'rpc-secret': 'hklist-client',
    'max-concurrent-downloads': 16,
    split: 16,
    'max-overall-download-limit': 0
  }
}

if (!existsSync(configPath)) mkdirsSync(configPath)
if (!existsSync(configFile)) saveConfig(defaultConfig)
if (!existsSync(downloadPath)) mkdirsSync(downloadPath)

export let nowConfig = getConfig()

export default defineLoader(() => {
  defineIpcHandle<null, config>('config.get', () => {
    return success(nowConfig)
  })

  defineIpcHandle<config>('config.save', (_, config) => {
    saveConfig(config)
    nowConfig = getConfig()
    return success()
  })
})
