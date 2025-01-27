import type { config } from '@main/ipc/config.ts'
import { defineInvoke } from '@renderer/utils/invoke.ts'

export type { config }

export const getConfig = defineInvoke<null, config>('config.get')

export const saveConfig = defineInvoke<config>('config.save')
