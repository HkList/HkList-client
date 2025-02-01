export const formatBytes = (bytes: number | string, decimals = 2) => {
  if (typeof bytes === 'string') bytes = parseFloat(bytes)
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i]
}
