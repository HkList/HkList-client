import { defineLoader } from '@main/loader.ts'
import { success } from '@main/utils/response.ts'
import { app } from 'electron'
import { existsSync, watch } from 'fs'
import { mkdirsSync, readJSONSync, writeJsonSync } from 'fs-extra'
import { join } from 'node:path'

const configPath = join(process.cwd(), '/config')
const configFile = join(configPath, '/config.json')
const downloadPath = join(app.getPath('downloads'), 'hklist-client')

export const getConfig = (): Config => {
  const json = readJSONSync(configFile)
  return {
    ...defaultConfig,
    ...json
  }
}

export const saveConfig = (config: Config) => {
  writeJsonSync(configFile, config, { spaces: 2 })
}

export interface Config {
  general: {
    theme: 'system' | 'light' | 'dark'
  }
  parse: {
    server: string
    token: string
    parse_password: string
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

export const defaultConfig: Config = {
  general: {
    theme: 'system'
  },
  parse: {
    server: '',
    token: '',
    parse_password: ''
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

export default defineLoader((ipc) => {
  watch(configFile, () => {
    nowConfig = getConfig()
  })

  ipc.handle('config.get', () => {
    return success(nowConfig)
  })

  ipc.handle('config.set', (_, config) => {
    saveConfig(config)
    nowConfig = getConfig()
    return success()
  })
})
