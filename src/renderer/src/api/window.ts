import type { isMaximized } from '@main/ipc/window.ts'
import { defineInvoke } from '@renderer/utils/invoke.ts'

export const close = defineInvoke('window.close')

export const minimize = defineInvoke('window.minimize')

export const maximize = defineInvoke('window.maximize')

export const unmaximize = defineInvoke('window.unMaximize')

export type { isMaximized }

export const getIsMaximized = defineInvoke<null, isMaximized>('window.getIsMaximized')
