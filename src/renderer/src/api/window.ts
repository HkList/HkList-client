import { invoke } from '@renderer/utils/invoke.ts'

export const close = () => invoke('window.close')

export const minimize = () => invoke('window.minimize')

export const maximize = () => invoke('window.maximize')

export const unmaximize = () => invoke('window.unMaximize')

export const isMaximized = () => invoke<boolean>('window.isMaximized')
