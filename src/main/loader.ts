import type { BrowserWindow } from 'electron'

export type windows = {
  main?: BrowserWindow
}

export type initLoader = () => Promise<void> | void
export type windowLoader = () => Promise<BrowserWindow> | BrowserWindow
export type ipcLoader = (windows: windows) => Promise<void> | void

export const defineInitLoader = (loader: initLoader) => loader
export const defineWindowLoader = (loader: windowLoader) => loader
export const defineIpcLoader = (loader: ipcLoader) => loader
