import createWindow from '@main/function/createWindow.ts'
import { defineLoader } from '@main/loader.ts'
import { app, BrowserWindow } from 'electron'

export default defineLoader((windows) => {
  app.on('activate', () => {
    // 在 macos 中，当点击 dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow(windows)
  })

  // 除了 macOS 外，当所有窗口关闭时退出应用程序。
  // 在 macOS 中，应用程序和菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
})
