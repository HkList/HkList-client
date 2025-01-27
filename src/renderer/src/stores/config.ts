import {
  config,
  getConfig as getConfigApi,
  saveConfig as saveConfigApi
} from '@renderer/api/config.ts'
import { useDark } from '@renderer/utils/use/useDark.ts'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref<config>({
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
    config.value = await getConfigApi()
    useDark()
  }

  const saveConfig = async () => {
    await saveConfigApi(toRaw(config.value))
    useDark()
  }

  return { config, getConfig, saveConfig }
})
