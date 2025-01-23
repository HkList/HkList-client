import { nowConfig } from '@main/ipc/config.ts'
import { join } from 'path'

export const getUrl = (url: string) => join(nowConfig.parse.server, '/api/v1', url)
