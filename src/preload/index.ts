import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

// 上下文隔离默认使用 contextBridge 来暴露 API
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('ElectronAPI', electronAPI)
} else {
  // @ts-ignore (define in dts)
  window.ElectronAPI = electronAPI
}
