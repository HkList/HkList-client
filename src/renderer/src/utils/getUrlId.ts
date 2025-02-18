export const getUrlId = (url: string): { surl: string; pwd: string; url: string } | false => {
  if (!url) return false

  const urlMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
  const urlMatch2 = url.match(/surl=([a-zA-Z0-9_-]+)/)

  const pwdMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch2 = url.match(/&pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch3 = url.match(/提取码[:：]\s?([a-zA-Z0-9_-]+)/)

  const surl = urlMatch ? urlMatch[1] : urlMatch2 ? `1${urlMatch2[1]}` : ''
  const pwd = pwdMatch ? pwdMatch[1] : pwdMatch2 ? pwdMatch2[1] : pwdMatch3 ? pwdMatch3[1] : ''

  return {
    surl,
    pwd,
    url: surl === '' ? '' : `https://pan.baidu.com/s/${surl}`
  }
}
