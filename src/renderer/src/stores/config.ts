import { config, getConfig as _getConfig, saveConfig as _saveConfig } from '@renderer/api/config.ts'
import { useDark } from '@renderer/utils/use/useDark.ts'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref<config>({
    general: {
      theme: 'system'
    },
    parse: {
      server: ''
    },
    aria2: {}
  })

  const getConfig = async () => {
    config.value = await _getConfig()
    useDark()
  }

  const saveConfig = async () => {
    await _saveConfig(toRaw(config.value))
    useDark()
  }

  return { config, getConfig, saveConfig }
})
