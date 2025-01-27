import type { Aria2ServerVersion } from '@huan_kong/maria2'
import { defineInvoke } from '@renderer/utils/invoke.ts'

export const start = defineInvoke('aria2.start')

export const stop = defineInvoke('aria2.stop')

export const restart = defineInvoke('aria2.restart')

export const getVersion = defineInvoke<null, Aria2ServerVersion>('aria2.getVersion')
