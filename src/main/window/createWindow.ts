import { defineWindowLoader } from '@main/loader.ts'
import { shell, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '@/resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'

const width = 1120
const height = 720

export default defineWindowLoader(() => {
  const mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    show: false,
    frame: false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev) {
    const displays = screen.getAllDisplays()

    // 找到副屏
    const secondaryDisplay = displays.find(
      (display) => display.bounds.x !== 0 || display.bounds.y !== 0
    )

    if (secondaryDisplay) {
      mainWindow.setPosition(
        Math.round(secondaryDisplay.bounds.x + (secondaryDisplay.size.width - width) / 2),
        Math.round(secondaryDisplay.bounds.y + (secondaryDisplay.size.height - height) / 2)
      )
      mainWindow.setSize(width, height)
    }
  }

  // 使用默认浏览器打开链接
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 加载界面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    if (is.dev) return

    // 检查更新
    autoUpdater.checkForUpdatesAndNotify({
      title: '发现新版本',
      body: '发现新版本，将在重启应用后自动安装更新'
    })
  })

  return mainWindow
})
