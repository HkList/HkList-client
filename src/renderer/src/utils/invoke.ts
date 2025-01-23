import type { BaseResponse } from '@main/utils/response.ts'
import { MessagePlugin } from 'tdesign-vue-next'
import NProgress from '@renderer/utils/progress.ts'

export const invoke = async <T = void>(method: string, data = {}) => {
  NProgress.start()
  const res = (await window.ElectronAPI.ipcRenderer.invoke(method, data)) as BaseResponse<T>
  NProgress.done()
  if (res.code === 200) {
    return res.data
  } else {
    MessagePlugin.error(res.message)
    return Promise.reject(res)
  }
}
