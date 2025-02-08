import type { IpcEvents } from '@/src/main/ipc/type.ts'
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import NProgress from '@renderer/utils/progress.ts'
import { toRaw } from 'vue'

const ipc = new IpcEmitter<IpcEvents>()

const ignoreMethods: (keyof IpcEvents)[] = [
  'window.getIsMaximized',
  'window.minimize',
  'window.maximize',
  'window.unMaximize',
  'window.selectFoloder',
  'aria2.getActive',
  'aria2.getWaiting',
  'aria2.getStopped'
]

export const invoke = async <T extends keyof IpcEvents>(
  method: Extract<T, string>,
  ...args: Parameters<IpcEvents[T]>
): Promise<ReturnType<IpcEvents[T]>['data']> => {
  // 还原所有类型为 ref 的参数
  args = args.map((arg) => toRaw(arg)) as Parameters<IpcEvents[T]>
  const inIgnoreMethods = ignoreMethods.includes(method)
  if (!inIgnoreMethods) NProgress.start()
  const res = await ipc.invoke(method, ...args)
  if (!inIgnoreMethods) NProgress.done()
  if (res.success) {
    return res.data
  } else {
    console.log(res)
    MessagePlugin.error(res.message)
    return Promise.reject(res)
  }
}
