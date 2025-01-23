import { electronApp } from '@electron-toolkit/utils'
import { defineInitLoader } from '@main/loader.ts'

export default defineInitLoader(() => {
  // 设置 Win 应用程序名称
  electronApp.setAppUserModelId('com.hklist.client')
})
