import type { Aria2DownloadStatus } from '@huan_kong/maria2'
import { invoke } from '@renderer/utils/ipc.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const active = ref<Aria2DownloadStatus[]>([])
  const waiting = ref<Aria2DownloadStatus[]>([])
  const stopped = ref<Aria2DownloadStatus[]>([])

  const getAcitve = async (): Promise<void> => {
    const res = await invoke('aria2.getActive')
    active.value = res
  }

  const getWaiting = async (): Promise<void> => {
    const res = await invoke('aria2.getWaiting', { offset: 0, num: 10000 })
    waiting.value = res
  }

  const getStopped = async (): Promise<void> => {
    const res = await invoke('aria2.getStopped', { offset: 0, num: 10000 })
    stopped.value = res
  }

  return {
    active,
    waiting,
    stopped,
    getAcitve,
    getWaiting,
    getStopped
  }
})
