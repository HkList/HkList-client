import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GetConfigRes, GetLimitReq, GetLimitRes } from '@main/ipc/parse.ts'
import { invoke } from '@renderer/utils/invoke.ts'

export const useParseStore = defineStore('parse', () => {
  const GetLimitReq = ref<GetLimitReq>({
    token: localStorage.getItem('token') ?? 'guest'
  })
  const GetLimitRes = ref<GetLimitRes>({
    count: 0,
    size: 0,
    expires_at: '1970-01-01 08:00:00'
  })
  const GetLimitError = ref('')

  const getLimit = async () => {
    try {
      const res = await invoke('parse.getLimit', GetLimitReq.value)
      GetLimitRes.value = res
      GetLimitError.value = ''
      localStorage.setItem('token', GetLimitReq.value.token)
    } catch (error) {
      console.log(error)
      const res = error as { response: { data: { message: string } } }
      const message = res?.response?.data?.message
      if (message) GetLimitError.value = message
    }
  }

  const GetConfigRes = ref<GetConfigRes>({
    show_announce: false,
    announce: '',
    custom_button: '',
    show_hero: false,
    name: '',
    logo: '',
    debug: false,
    max_once: 0,
    min_single_filesize: 0,
    max_single_filesize: 0,
    max_all_filesize: 0,
    need_password: false,
    have_account: false
  })
  const getConfig = async () => {
    const res = await invoke('parse.getConfig')
    GetConfigRes.value = res
  }

  return {
    GetLimitReq,
    GetLimitRes,
    getLimit,

    GetConfigRes,
    getConfig
  }
})
