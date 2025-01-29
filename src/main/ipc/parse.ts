import { defineLoader } from '@main/loader.ts'
import { getUrl } from '@main/utils/getUrl.ts'
import { hkListHttp } from '@main/utils/http.ts'
import { success } from '@main/utils/response.ts'

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

export default defineLoader((ipc) => {
  ipc.handle('parse.getConfig', async () => {
    const res = await hkListHttp.request<GetConfigRes>('get', getUrl('/user/parse/config'))
    return success(res)
  })

  ipc.handle('parse.getLimit', async (_, params) => {
    const res = await hkListHttp.request<GetLimitRes>('get', getUrl('/user/parse/limit'), {
      params
    })
    return success(res)
  })
})
