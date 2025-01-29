import type { Config } from '@/src/main/ipc/config.ts'
import { useDark } from '@renderer/utils/use/useDark.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@renderer/utils/invoke.ts'

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config>({
    dev: false,
    general: {
      theme: 'system'
    },
    parse: {
      server: ''
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

  const getConfig = async () => {
    config.value = await invoke('config.get')
    useDark()
  }

  const saveConfig = async () => {
    await invoke('config.set', config.value)
    useDark()
  }

  return { config, getConfig, saveConfig }
})
