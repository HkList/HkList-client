import type { Config } from '@/src/main/ipc/config.ts'
import { MB } from '@renderer/utils/format.ts'
import { invoke } from '@renderer/utils/ipc.ts'
import { useDark } from '@renderer/utils/use/useDark.ts'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config>({
    general: {
      theme: 'system'
    },
    parse: {
      server: 'http://127.0.0.1:8000',
      token: 'guest',
      parse_password: ''
    },
    aria2: {
      dir: '',
      'rpc-listen-port': 26800,
      'rpc-secret': 'hklist-client',
      'max-concurrent-downloads': 16,
      split: 16,
      'max-overall-download-limit': 0
    }
  })

  const getConfig = async (): Promise<void> => {
    config.value = await invoke('config.get')
    config.value.aria2['max-overall-download-limit'] =
      config.value.aria2['max-overall-download-limit'] / MB
    useDark()
  }

  const saveConfig = async (): Promise<void> => {
    const tempConfig = toRaw(config.value)
    tempConfig.aria2['max-overall-download-limit'] =
      tempConfig.aria2['max-overall-download-limit'] * MB
    await invoke('config.set', tempConfig)
    await getConfig()
  }

  return { config, getConfig, saveConfig }
})
