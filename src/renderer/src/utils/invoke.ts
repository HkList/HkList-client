import type { BaseResponse } from '@main/utils/response.ts'
import NProgress from '@renderer/utils/progress.ts'
import { MessagePlugin } from 'tdesign-vue-next'

export const invoke = async <T = void>(method: string, data: unknown = null): Promise<T> => {
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

export const defineInvoke =
  <T = void, K = void>(method: string) =>
  (data?: T) =>
    invoke<K>(method, data)
