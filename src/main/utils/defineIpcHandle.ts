import type { BaseResponse } from '@main/utils/response.ts'
import { fail } from '@main/utils/response.ts'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

export const defineIpcHandle = <T = void, K = void>(
  channel: string,
  callback: (event: IpcMainInvokeEvent, params: T) => Promise<BaseResponse<K>> | BaseResponse<K>
) => {
  ipcMain.handle(channel, async (event, params) => {
    try {
      return await callback(event, params)
    } catch (error) {
      console.log(error)
      return fail()
    }
  })
}
