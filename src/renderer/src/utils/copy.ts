import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

export const copy = async (text: string, message = '复制成功') => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  MessagePlugin.success(message)
}
