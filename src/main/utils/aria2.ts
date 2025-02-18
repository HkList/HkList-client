import type { Aria2ClientInputOptionKey, Aria2DownloadStatus } from '@huan_kong/maria2'

export const getTaskName = (task: Aria2DownloadStatus): string => {
  let path = task?.files?.[0]?.path
  if (path === '') path = task?.files?.[0]?.uris?.[0]?.uri ?? '未知'
  const index = path.lastIndexOf('/')
  const fileNameAndQueryString = path.substring(index + 1)
  const queryStringStartPos = fileNameAndQueryString.indexOf('?')
  let fileName = fileNameAndQueryString
  if (queryStringStartPos > 0) fileName = fileNameAndQueryString.substring(0, queryStringStartPos)
  return decodeURIComponent(fileName)
}

export const calcProgress = (task: Aria2DownloadStatus): string => {
  const { completedLength, totalLength } = task
  return completedLength === '0' && totalLength === '0'
    ? '0'
    : ((parseFloat(completedLength) / parseFloat(totalLength)) * 100).toFixed(2)
}

export const matchStatus = (status: Aria2DownloadStatus['status']): string => {
  switch (status) {
    case 'active':
      return '下载中'
    case 'waiting':
      return '等待中'
    case 'paused':
      return '暂停中'
    case 'error':
      return '出错啦'
    case 'complete':
      return '完成啦'
    case 'removed':
      return '已删除'
    default:
      return '未知状态'
  }
}

export const Aria2ClientInputOptionsKeys: Aria2ClientInputOptionKey[] = [
  'all-proxy',
  'all-proxy-passwd',
  'all-proxy-user',
  'allow-overwrite',
  'allow-piece-length-change',
  'always-resume',
  'async-dns',
  'auto-file-renaming',
  'bt-enable-hook-after-hash-check',
  'bt-enable-lpd',
  'bt-exclude-tracker',
  'bt-external-ip',
  'bt-force-encryption',
  'bt-hash-check-seed',
  'bt-load-saved-metadata',
  'bt-max-peers',
  'bt-metadata-only',
  'bt-min-crypto-level',
  'bt-prioritize-piece',
  'bt-remove-unselected-file',
  'bt-request-peer-speed-limit',
  'bt-require-crypto',
  'bt-save-metadata',
  'bt-seed-unverified',
  'bt-stop-timeout',
  'bt-tracker',
  'bt-tracker-connect-timeout',
  'bt-tracker-interval',
  'bt-tracker-timeout',
  'check-integrity',
  'checksum',
  'conditional-get',
  'connect-timeout',
  'content-disposition-default-utf8',
  'continue',
  'dir',
  'dry-run',
  'enable-http-keep-alive',
  'enable-http-pipelining',
  'enable-mmap',
  'enable-peer-exchange',
  'file-allocation',
  'follow-metalink',
  'follow-torrent',
  'force-save',
  'ftp-passwd',
  'ftp-pasv',
  'ftp-proxy',
  'ftp-proxy-passwd',
  'ftp-proxy-user',
  'ftp-reuse-connection',
  'ftp-type',
  'ftp-user',
  'gid',
  'hash-check-only',
  'header',
  'http-accept-gzip',
  'http-auth-challenge',
  'http-no-cache',
  'http-passwd',
  'http-proxy',
  'http-proxy-passwd',
  'http-proxy-user',
  'http-user',
  'https-proxy',
  'https-proxy-passwd',
  'https-proxy-user',
  'index-out',
  'lowest-speed-limit',
  'max-connection-per-server',
  'max-download-limit',
  'max-file-not-found',
  'max-mmap-limit',
  'max-resume-failure-tries',
  'max-tries',
  'max-upload-limit',
  'metalink-base-uri',
  'metalink-enable-unique-protocol',
  'metalink-language',
  'metalink-location',
  'metalink-os',
  'metalink-preferred-protocol',
  'metalink-version',
  'min-split-size',
  'no-file-allocation-limit',
  'no-netrc',
  'no-proxy',
  'out',
  'parameterized-uri',
  'pause',
  'pause-metadata',
  'piece-length',
  'proxy-method',
  'realtime-chunk-checksum',
  'referer',
  'remote-time',
  'remove-control-file',
  'retry-wait',
  'reuse-uri',
  'rpc-save-upload-metadata',
  'seed-ratio',
  'seed-time',
  'select-file',
  'split',
  'ssh-host-key-md',
  'stream-piece-selector',
  'timeout',
  'uri-selector',
  'use-head',
  'user-agent'
]
