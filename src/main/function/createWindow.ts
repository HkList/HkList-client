import icon from '@/resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { defineLoader } from '@main/loader.ts'
import { BrowserWindow, screen, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import { autoUpdater } from 'electron-updater'
import { join } from 'node:path'

const width = 1170
const height = 750

export default defineLoader<BrowserWindow>(() => {
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

  contextMenu({
    showSelectAll: false,
    showSearchWithGoogle: false,
    labels: {
      copy: '复制',
      paste: '粘贴',
      cut: '剪切',
      inspect: '开发者工具'
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
    if (is.dev) {
      mainWindow.showInactive()
    } else {
      mainWindow.show()
      // 检查更新
      autoUpdater.checkForUpdatesAndNotify({
        title: '发现新版本',
        body: '发现新版本，将在重启应用后自动安装更新'
      })
    }
  })

  return mainWindow
})
