/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IpcListener } from '@electron-toolkit/typed-ipc/main'
import type { IpcEvents } from '@main/ipc/type.ts'
import { handleError } from '@main/utils/handleError.ts'

export const rewriteIpcHandle = (ipc: IpcListener<IpcEvents>): void => {
  ipc.handle = ((originFunction) => {
    originFunction = originFunction.bind(ipc)
    return (name, fn): void =>
      originFunction(name, async (e, ...args): Promise<any> => {
        try {
          return await fn(e, ...args)
        } catch (error) {
          return handleError(error)
        }
      })
  })(ipc.handle)
}
