import type { config as _config } from '@main/ipc/config.ts'
import { invoke } from '@renderer/utils/invoke.ts'

export type config = _config

export const getConfig = () => invoke<config>('config.get')

export const saveConfig = (config: config) => invoke('config.save', config)
