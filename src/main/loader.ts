import type { BrowserWindow } from 'electron'

export type windows = {
  main?: BrowserWindow
}

export type loader<T> = (windows: windows) => Promise<T> | T

export const defineLoader = <T = void>(loader: loader<T>) => loader
