import dayjs from 'dayjs'

export const KB = 1024
export const MB = 1024 * 1024
export const GB = 1024 * 1024 * 1024

export const formatBytes = (bytes: number | string, decimals = 2) => {
  if (typeof bytes === 'string') bytes = parseFloat(bytes)
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i]
}

export const formatDateToString = (timeString: dayjs.ConfigType, format = 'YYYY/MM/DD HH:mm:ss') =>
  dayjs(timeString).format(format)

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return formatDateToString(date)
}
