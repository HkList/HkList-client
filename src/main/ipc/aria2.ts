import type { Conn } from '@huan_kong/maria2'
import { aria2, open } from '@huan_kong/maria2'
import { nowConfig } from '@main/ipc/config.ts'
import { defineLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { success } from '@main/utils/response.ts'
import { app, dialog } from 'electron'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import WebSocket from 'ws'

export const aria2Path = join(process.cwd(), 'aria2')
export const aria2File = join(
  aria2Path,
  process.platform === 'win32' ? 'win32/aria2c.exe' : 'bin/aria2c'
)

let proc: ChildProcessWithoutNullStreams | null = null
let client: Conn | null = null

export const startAria2 = (): Promise<ChildProcessWithoutNullStreams> => {
  return new Promise((resolve, reject) => {
    if (proc) {
      resolve(proc)
      return
    }

    const args = [`--conf-path=${aria2Path}/aria2.conf`]
    for (const key in nowConfig.aria2) args.push(`--${key}=${nowConfig.aria2[key]}`)

    const temp = spawn(aria2File, args)
    let info = ''

    temp.stderr.on('data', (data) => {
      info = data.toString()
    })

    temp.stdout.once('data', async (data) => {
      if (data.toString().includes('IPv4 RPC:')) {
        proc = temp
        client = await open(
          new WebSocket(`ws://localhost:${nowConfig.aria2['rpc-listen-port']}/jsonrpc`),
          {
            secret: nowConfig.aria2['rpc-secret']
          }
        )
        resolve(temp)
      }
    })

    temp.on('exit', (code) => {
      if (code && code !== 0) {
        proc = null
        client = null
        dialog.showErrorBox('aria2 启动失败', info)
        reject(new Error(`aria2 exited with code ${code}`))
      }
    })
  })
}

export const stopAria2 = () => {
  if (proc && !proc.killed) proc.kill()
  proc = null
  client = null
}

export default defineLoader(async () => {
  await startAria2()

  defineIpcHandle('aria2.start', async () => {
    await startAria2()
    return success()
  })

  defineIpcHandle('aria2.stop', () => {
    stopAria2()
    return success()
  })

  defineIpcHandle('aria2.restart', async () => {
    stopAria2()
    await startAria2()
    return success()
  })

  defineIpcHandle('aria2.getVersion', async () => {
    await startAria2()
    return success(await aria2.getVersion(client!))
  })

  app.on('before-quit', () => {
    // 防止有 aria2 进程没有被结束
    stopAria2()
  })
})
