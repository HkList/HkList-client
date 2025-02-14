import { ClipboardObserver } from '@huan_kong/electron-clipboard-observer'
import { defineLoader } from '@main/loader.ts'

export default defineLoader((_ipc, emitter, windows) => {
  const clipboardObserver = new ClipboardObserver({ interval: 100 })

  clipboardObserver.addEventListener((data) => {
    if (!windows.main) return
    emitter.send(windows.main.webContents, 'clipboard.change', data)
  })

  clipboardObserver.startMonitoring()
})
