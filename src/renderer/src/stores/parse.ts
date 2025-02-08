import type {
  GetConfigRes,
  GetFileListReq,
  GetFileListRes,
  GetLimitReq,
  GetLimitRes
} from '@main/ipc/parse.ts'
import { useConfigStore } from '@renderer/stores/config.ts'
import { invoke } from '@renderer/utils/invoke.ts'
import { defineStore, storeToRefs } from 'pinia'
import { ref, toRaw } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

export const useParseStore = defineStore('parse', () => {
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

  const GetLimitReq = ref<GetLimitReq>({
    token: config.value.parse.token
  })
  const GetLimitRes = ref<GetLimitRes>({
    count: 0,
    size: 0,
    expires_at: '1970-01-01 08:00:00'
  })
  const GetLimitError = ref('')

  const getLimit = async (setConfig = false) => {
    if (setConfig) GetLimitReq.value.token = config.value.parse.token
    try {
      const res = await invoke('parse.getLimit', GetLimitReq.value)
      GetLimitRes.value = res
      GetLimitError.value = ''
    } catch (error) {
      const res = error as { message: string }
      const message = res?.message
      if (message) GetLimitError.value = message
      throw error
    }
  }

  const GetFileListReq = ref<GetFileListReq>({
    url: '',
    surl: '',
    pwd: '',
    dir: '/',
    parse_password: config.value.parse.parse_password
  })
  const GetFileListRes = ref<GetFileListRes>()

  const getFileList = async (sample = false) => {
    const req: GetFileListReq = sample
      ? {
          url: 'https://pan.baidu.com/s/1H5PkdA_zMfkOQ7U4maakGA?pwd=ymuk',
          dir: '/',
          parse_password: config.value.parse.parse_password,
          surl: '1H5PkdA_zMfkOQ7U4maakGA',
          pwd: 'ymuk'
        }
      : toRaw(GetFileListReq.value)
    const res = await invoke('parse.getFileList', req)
    GetFileListRes.value = res
  }

  return {
    getConfig,
    GetConfigRes,

    getLimit,
    GetLimitReq,
    GetLimitRes,
    GetLimitError,

    getFileList,
    GetFileListReq,
    GetFileListRes
  }
})
