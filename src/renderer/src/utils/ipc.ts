import type { IpcEvents, IpcRendererEvent } from '@/src/main/ipc/type.ts'
import { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/renderer'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import NProgress from '@renderer/utils/progress.ts'
import { toRaw } from 'vue'

export const emitter = new IpcEmitter<IpcEvents>()
export const ipc = new IpcListener<IpcRendererEvent>()

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

const ignoreMessages: string[] = ['aria2 启动失败']

export const invoke = async <T extends keyof IpcEvents>(
  method: Extract<T, string>,
  ...args: Parameters<IpcEvents[T]>
): Promise<ReturnType<IpcEvents[T]>['data']> => {
  // 还原所有类型为 ref 的参数
  args = args.map((arg) => toRaw(arg)) as Parameters<IpcEvents[T]>
  const inIgnoreMethods = ignoreMethods.includes(method)
  if (!inIgnoreMethods) NProgress.start()
  const res = await emitter.invoke(method, ...args)
  if (!inIgnoreMethods) NProgress.done()
  if (res.success) {
    return res.data
  } else {
    console.log('IPC调用错误:', res)
    if (!ignoreMessages.every((msg) => res.message.includes(msg))) MessagePlugin.error(res.message)
    return Promise.reject(res)
  }
}
