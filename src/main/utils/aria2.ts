import type { Aria2DownloadStatus } from '@huan_kong/maria2'

export const getTaskName = (task: Aria2DownloadStatus) => {
  let path = task?.files?.[0]?.path
  if (path === '') path = task?.files?.[0]?.uris?.[0]?.uri ?? '未知'
  const index = path.lastIndexOf('/')
  const fileNameAndQueryString = path.substring(index + 1)
  const queryStringStartPos = fileNameAndQueryString.indexOf('?')
  let fileName = fileNameAndQueryString
  if (queryStringStartPos > 0) fileName = fileNameAndQueryString.substring(0, queryStringStartPos)
  return decodeURIComponent(fileName)
}

export const calcProgress = (task: Aria2DownloadStatus) => {
  const { completedLength, totalLength } = task
  return completedLength === '0' && totalLength === '0'
    ? '0'
    : ((parseFloat(completedLength) / parseFloat(totalLength)) * 100).toFixed(2)
}

export const matchStatus = (status: Aria2DownloadStatus['status']) => {
  switch (status) {
    case 'active':
      return '下载中'
    case 'waiting':
      return '等待中'
    case 'paused':
      return '暂停中'
    case 'error':
      return '错误啦'
    case 'complete':
      return '完成啦'
    case 'removed':
      return '已移除'
    default:
      return '未知状态'
  }
}
