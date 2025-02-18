import { nowConfig } from '@main/ipc/config.ts'

export const getUrl = (url: string): string => {
  if (nowConfig.parse.server === '') {
    throw new Error('请先前往配置管理设置解析服务器')
  }
  return `${nowConfig.parse.server}/api/v1${url}`.replaceAll('//', '/')
}
