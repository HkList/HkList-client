import type { Aria2ClientInputOptions, Conn } from '@huan_kong/maria2'
import { aria2, open } from '@huan_kong/maria2'
import { nowConfig } from '@main/ipc/config.ts'
import { defineLoader } from '@main/loader.ts'
import { getTaskName } from '@main/utils/aria2.ts'
import { success } from '@main/utils/response.ts'
import { app, dialog, shell } from 'electron'
import isPortReachable from 'is-port-reachable'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { spawn } from 'node:child_process'
import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

export const aria2Path = join(process.cwd(), 'aria2')
export const aria2File = join(
  aria2Path,
  process.platform === 'win32' ? 'win32/aria2c.exe' : 'bin/aria2c'
)
export const aria2Config = join(aria2Path, 'aria2.conf')
export const aria2Session = join(aria2Path, 'aria2.session')

let proc: ChildProcessWithoutNullStreams | null = null
let client: Conn | null = null

export const startAria2 = (): Promise<ChildProcessWithoutNullStreams> => {
  return new Promise(async (resolve, reject) => {
    if (proc) {
      resolve(proc)
      return
    }

    const res = await isPortReachable(nowConfig.aria2['rpc-listen-port'], { host: 'localhost' })
    if (res) {
      reject(new Error(`aria2 启动失败: 端口 ${nowConfig.aria2['rpc-listen-port']} 已被占用`))
      return
    }

    const args = [`--conf-path=${aria2Config}`, `--save-session=${aria2Session}`]
    if (existsSync(aria2Session)) args.push(`--input-file=${aria2Session}`)
    for (const key in nowConfig.aria2) args.push(`--${key}=${nowConfig.aria2[key]}`)

    const temp = spawn(aria2File, args)
    let info = ''

    temp.stderr.on('data', (data) => {
      info = data.toString()
    })

    temp.stdout.on('data', async (data: Buffer) => {
      if (data.toString().includes('IPv4 RPC:')) {
        proc = temp
        client = await open(
          new WebSocket(`ws://localhost:${nowConfig.aria2['rpc-listen-port']}/jsonrpc`),
          {
            secret: nowConfig.aria2['rpc-secret']
          }
        )
        temp.stdout.removeAllListeners('data')
        resolve(temp)
      }
    })

    temp.on('exit', (code) => {
      if (code && code !== 0) {
        proc = null
        client = null
        reject(new Error(`aria2 启动失败: ${info}`))
      }
    })
  })
}

export const stopAria2 = async () => {
  if (client) await aria2.shutdown(client)
  if (proc) proc.kill()
  proc = null
  client = null
}

export interface AddTask extends Aria2ClientInputOptions {
  urls: string[]
}

export interface GetTask {
  offset: number
  num: number
}

export interface OperateTask {
  gids: string[]
}

export type RemoveTask = OperateTask & { removeFile: boolean }

export interface OpenTaskFolder {
  gid: string
}

export default defineLoader(async (ipc) => {
  try {
    await startAria2()
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      dialog.showErrorBox('aria2 启动失败', error.message)
    }
  }

  ipc.handle('aria2.start', async () => {
    await startAria2()
    return success()
  })

  ipc.handle('aria2.stop', async () => {
    await stopAria2()
    return success()
  })

  ipc.handle('aria2.restart', async () => {
    await stopAria2()
    await startAria2()
    return success()
  })

  ipc.handle('aria2.getVersion', async () => {
    await startAria2()
    return success(await aria2.getVersion(client!))
  })

  ipc.handle('aria2.addTask', async (_, params) => {
    await startAria2()
    const gid = await aria2.addUri(client!, params.urls, params)
    return success({ gid })
  })

  ipc.handle('aria2.getActive', async () => {
    await startAria2()
    return success(await aria2.tellActive(client!))
  })

  ipc.handle('aria2.getWaiting', async (_, params) => {
    await startAria2()
    return success(await aria2.tellWaiting(client!, params.offset, params.num))
  })

  ipc.handle('aria2.getStopped', async (_, params) => {
    await startAria2()
    return success(await aria2.tellStopped(client!, params.offset, params.num))
  })

  ipc.handle('aria2.unpauseTask', async (_, params) => {
    await startAria2()
    await Promise.all(params.gids.map(async (gid) => await aria2.unpause(client!, gid)))
    return success()
  })

  ipc.handle('aria2.pauseTask', async (_, params) => {
    await startAria2()
    await Promise.all(params.gids.map(async (gid) => await aria2.pause(client!, gid)))
    return success()
  })

  ipc.handle('aria2.removeTask', async (_, params) => {
    await startAria2()
    if (params.removeFile) {
      // 收集文件位置
      const tasks = await Promise.all(
        params.gids.map(async (gid) => await aria2.tellStatus(client!, gid))
      )
      tasks.forEach((task) => {
        let path = task.files?.[0]?.path
        if (path === '') {
          const filename = getTaskName(task)
          path = join(task.dir, filename)
        }
        if (existsSync(path)) unlinkSync(path)
      })
    }
    await Promise.all(params.gids.map(async (gid) => await aria2.remove(client!, gid)))
    return success()
  })

  ipc.handle('aria2.openTaskFolder', async (_, params) => {
    await startAria2()
    const task = await aria2.tellStatus(client!, params.gid)
    shell.openPath(task.dir)
    return success()
  })

  app.on('before-quit', async () => {
    // 防止有 aria2 进程没有被结束
    await stopAria2()
  })
})
