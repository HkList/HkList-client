import { fail } from '@main/utils/response.ts'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

export const defineIpcHandle = <T = {}, K = void>(
  channel: string,
  callback: (event: IpcMainInvokeEvent, params: T) => Promise<K> | K
) => {
  ipcMain.handle(channel, async (event, params) => {
    try {
      return await callback(event, params)
    } catch (error) {
      return fail()
    }
  })
}
