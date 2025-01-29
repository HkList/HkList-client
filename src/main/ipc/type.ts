import type { SuccessResponse } from '@main/utils/response.ts'
import type { IsMaximized } from '@main/ipc/window.ts'
import type { Config } from '@main/ipc/config.ts'
import type { Aria2ServerVersion, Aria2DownloadGid, Aria2DownloadStatus } from '@huan_kong/maria2'
import type { GetTask, AddTask } from '@main/ipc/aria2.ts'
import type { GetConfigRes, GetLimitReq, GetLimitRes } from '@main/ipc/parse.ts'

export type BaseIpcEvents = {
  'window.minimize': () => null
  'window.maximize': () => null
  'window.unMaximize': () => null
  'window.getIsMaximized': () => IsMaximized
  'window.close': () => null

  'config.get': () => Config
  'config.set': (config: Config) => null

  'aria2.start': () => null
  'aria2.stop': () => null
  'aria2.restart': () => null
  'aria2.getVersion': () => Aria2ServerVersion
  'aria2.addTask': (params: AddTask) => { gid: Aria2DownloadGid }
  'aria2.getActive': () => Aria2DownloadStatus[]
  'aria2.getWaiting': (params: GetTask) => Aria2DownloadStatus[]
  'aria2.getStopped': (params: GetTask) => Aria2DownloadStatus[]

  'parse.getLimit': (params: GetLimitReq) => GetLimitRes
  'parse.getConfig': () => GetConfigRes
}

export type IpcEvents = {
  [K in keyof BaseIpcEvents]: BaseIpcEvents[K] extends (...args: infer P) => infer R
    ? (...args: P) => SuccessResponse<R>
    : never
}
