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

export interface GetFileListReq {
  url: string
  surl: string
  pwd: string
  dir: string
  page?: number
  num?: number
  order?: 'time' | 'filename'
  parse_password: string
}

export interface File {
  category: number
  fs_id: number
  is_dir: boolean
  local_ctime: number
  local_mtime: number
  md5: string
  path: string
  server_ctime: number
  server_mtime: number
  server_filename: string
  size: number
  dlink: string
}

export interface GetFileListRes {
  uk: number
  shareid: number
  randsk: string
  list: File[]
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

  ipc.handle('parse.getFileList', async (_, data) => {
    const res = await hkListHttp.request<GetFileListRes>(
      'post',
      getUrl('/user/parse/get_file_list'),
      {
        data
      }
    )
    return success(res)
  })
})
