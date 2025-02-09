import { nowConfig } from '@main/ipc/config.ts'
import { join } from 'node:path'

export const getUrl = (url: string) => {
  if (nowConfig.parse.server === '') {
    throw new Error('请先前往配置管理设置解析服务器')
  }
  return join(nowConfig.parse.server, '/api/v1', url)
}
