<template>
  <SetLimit v-model="isShowingLimitDialog" />
  <AddTask v-model="isShowingAddDialog" />

  <t-card class="task__statusBar__card">
    <t-space>
      <t-button @click="showAddTask">添加任务</t-button>
      <t-button @click="showLimitDialog">设置限速</t-button>
      <t-button @click="pauseAllSelected">暂停选中的任务</t-button>
      <t-button @click="unpauseAllSelected">继续选中的任务</t-button>
      <t-popconfirm
        theme="danger"
        content="是否要删除文件"
        @cancel="deleteAllSelected(false)"
        @confirm="deleteAllSelected(true)"
      >
        <t-button>删除选中的任务</t-button>
      </t-popconfirm>
    </t-space>

    <span>下载速度: {{ formatBytes(download) }}/s</span>
  </t-card>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@renderer/stores/task.ts'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { formatBytes } from '@renderer/utils/format.ts'
import SetLimit from '@renderer/views/Task/StatusBar/SetLimit.vue'
import AddTask from '@renderer/views/Task/AddTask/index.vue'
import { invoke } from '@renderer/utils/ipc.ts'
import { Aria2DownloadStatus } from '@huan_kong/maria2'

const taskStore = useTaskStore()
const { active, selectedRows } = storeToRefs(taskStore)

const download = computed(() =>
  active.value.reduce((prev, curr) => prev + parseFloat(curr.downloadSpeed), 0)
)

const isShowingLimitDialog = ref(false)
const isShowingAddDialog = ref(false)

const showLimitDialog = (): void => {
  isShowingLimitDialog.value = true
}

const showAddTask = (): void => {
  isShowingAddDialog.value = true
}

const pauseAllSelected = async (): Promise<void> => {
  await invoke('aria2.pauseTask', {
    gids: Object.values(selectedRows.value)
      .filter((task) => task !== undefined && task.status === 'active')
      .map((task) => (task as Aria2DownloadStatus).gid)
  })
}

const unpauseAllSelected = async (): Promise<void> => {
  await invoke('aria2.unpauseTask', {
    gids: Object.values(selectedRows.value)
      .filter((task) => task !== undefined && ['paused', 'waiting'].includes(task.status))
      .map((task) => (task as Aria2DownloadStatus).gid)
  })
}

const deleteAllSelected = async (removeFile: boolean): Promise<void> => {
  await invoke('aria2.removeTask', {
    gids: Object.values(selectedRows.value)
      .filter((task) => task !== undefined && ['paused', 'waiting'].includes(task.status))
      .map((task) => (task as Aria2DownloadStatus).gid),
    removeFile
  })
}
</script>

<style lang="scss">
.task__statusBar__card {
  .t-card__body {
    display: flex;
    justify-content: space-between;
    padding: 15px !important;
  }

  span {
    line-height: 30px;
  }
}
</style>
