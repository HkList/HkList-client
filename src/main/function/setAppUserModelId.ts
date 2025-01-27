import { electronApp } from '@electron-toolkit/utils'
import { defineLoader } from '@main/loader.ts'

export default defineLoader(() => {
  // 设置 Win 应用程序名称
  electronApp.setAppUserModelId('com.hklist.client')
})
