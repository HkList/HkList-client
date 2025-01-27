import { defineLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { getUrl } from '@main/utils/getUrl.ts'
import { hkListHttp } from '@main/utils/http.ts'

export interface GetLimitReq {
  token: string
}

export interface GetLimitRes {
  count: number
  size: number
  expires_at: string
}

export interface GetConfigRes {
  show_announce: boolean
  announce: string
  custom_button: string
  show_hero: boolean
  name: string
  logo: string
  debug: boolean
  max_once: number
  min_single_filesize: number
  max_single_filesize: number
  max_all_filesize: number
  need_password: boolean
  have_account: boolean
}

export default defineLoader(() => {
  /** 获取当前卡密信息 */
  defineIpcHandle('parse.getLimit', async (_, params: GetLimitReq) => {
    return await hkListHttp.request<GetLimitRes>('get', getUrl('/user/parse/limit'), { params })
  })

  defineIpcHandle('parse.getConfig', async () => {
    return await hkListHttp.request<GetConfigRes>('get', getUrl('/user/parse/config'))
  })
})
