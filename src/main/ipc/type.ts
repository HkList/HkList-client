import type { ClipboardObserverData } from '@huan_kong/electron-clipboard-observer'
import type {
  Aria2ClientGlobalOptions,
  Aria2DownloadGid,
  Aria2DownloadStatus,
  Aria2ServerVersion
} from '@huan_kong/maria2'
import type { AddTask, GetTask, OpenTaskFolder, OperateTask, RemoveTask } from '@main/ipc/aria2.ts'
import type { Config } from '@main/ipc/config.ts'
import type {
  GetConfigRes,
  GetDownloadLinksReq,
  GetDownLoadLinksRes,
  GetFileListReq,
  GetFileListRes,
  GetLimitReq,
  GetLimitRes,
  GetVcodeReq,
  GetVcodeRes
} from '@main/ipc/parse.ts'
import type { IsMaximized, SelectedFolder } from '@main/ipc/window.ts'
import type { SuccessResponse } from '@main/utils/response.ts'

export type BaseIpcEvents = {
  'window.minimize': () => null
  'window.maximize': () => null
  'window.unMaximize': () => null
  'window.getIsMaximized': () => IsMaximized
  'window.close': () => null
  'window.selectFoloder': () => SelectedFolder
  'window.alert': () => null

  'config.get': () => Config
  'config.set': (config: Config) => null

  'aria2.start': () => null
  'aria2.stop': () => null
  'aria2.restart': () => null
  'aria2.getVersion': () => Aria2ServerVersion
  'aria2.addTask': (params: AddTask) => { gid: Aria2DownloadGid[] }
  'aria2.getActive': () => Aria2DownloadStatus[]
  'aria2.getWaiting': (params: GetTask) => Aria2DownloadStatus[]
  'aria2.getStopped': (params: GetTask) => Aria2DownloadStatus[]
  'aria2.unpauseTask': (params: OperateTask) => null
  'aria2.pauseTask': (params: OperateTask) => null
  'aria2.removeTask': (params: RemoveTask) => null
  'aria2.removeTaskResult': (params: OperateTask) => null
  'aria2.openTaskFolder': (params: OpenTaskFolder) => null
  'aria2.getGlobalOption': () => Aria2ClientGlobalOptions
  'aria2.changeGlobalOption': (params: Aria2ClientGlobalOptions) => null

  'parse.getLimit': (params: GetLimitReq) => GetLimitRes
  'parse.getConfig': () => GetConfigRes
  'parse.getFileList': (params: GetFileListReq) => GetFileListRes
  'parse.getVcode': (params: GetVcodeReq) => GetVcodeRes
  'parse.getDownloadLinks': (params: GetDownloadLinksReq) => GetDownLoadLinksRes
}

export type IpcEvents = {
  [K in keyof BaseIpcEvents]: BaseIpcEvents[K] extends (...args: infer P) => infer R
    ? (...args: P) => SuccessResponse<R>
    : never
}

export type IpcRendererEvent = {
  'clipboard.change': [ClipboardObserverData]
}
