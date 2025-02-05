import type { CustomValidator } from 'tdesign-vue-next'

export const httpUrlValidator: CustomValidator = (val: string | string[]) => {
  const value = Array.isArray(val) ? val : [val]

  for (const item of value) {
    if (!/^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+(:\d{2,5})?(\/[^\s]*)?$/.test(item)) {
      return {
        result: false,
        message: '链接格式错误',
        type: 'error'
      }
    }
  }

  return true
}
