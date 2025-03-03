<template>
  <t-list-item @click="selectRadio">
    <div class="task__taskList__info">
      <t-radio allow-uncheck :checked="selectedRows[task.gid] !== undefined"></t-radio>
      <img :src="getFileIcon(filename)" class="image" />
      <t-space direction="vertical" class="gap">
        <p>{{ filename }}</p>
        <p>{{ formatBytes(task.completedLength) }} / {{ formatBytes(task.totalLength) }}</p>
      </t-space>
      <p class="status">
        {{
          task.status === 'active'
            ? `${formatBytes(task.downloadSpeed)}/s`
            : matchStatus(task.status)
        }}
      </p>
      <Progress :active="task.status === 'active'" :progress="parseFloat(progress)" />
    </div>

    <template #action>
      <div class="gap-action">
        <t-link v-if="task.status === 'active'" theme="primary" @click="pauseTask"> 暂停 </t-link>
        <t-link v-if="task.status === 'paused'" theme="primary" @click="unpauseTask"> 开始 </t-link>

        <t-link v-if="task.status === 'removed'" theme="primary" @click="removeTaskDownloadResult">
          删除任务
        </t-link>
        <t-popconfirm
          v-else
          theme="danger"
          content="是否要删除文件"
          @cancel="removeTask(false)"
          @confirm="removeTask(true)"
        >
          <t-link theme="primary"> 删除任务 </t-link>
        </t-popconfirm>

        <t-link theme="primary" @click="openTaskFolder"> 打开文件位置 </t-link>
      </div>
    </template>
  </t-list-item>
</template>

<script lang="ts" setup>
import type { Aria2DownloadStatus } from '@huan_kong/maria2'
import { calcProgress, getTaskName, matchStatus } from '@main/utils/aria2'
import Progress from '@renderer/components/Progress.vue'
import { formatBytes } from '@renderer/utils/format.ts'
import { getFileIcon } from '@renderer/utils/genFileIcon.ts'
import { invoke } from '@renderer/utils/ipc.ts'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useTaskStore } from '@renderer/stores/task.ts'

const { task } = defineProps<{ task: Aria2DownloadStatus }>()

const taskStore = useTaskStore()
const { selectedRows } = storeToRefs(taskStore)

const progress = ref(calcProgress(task))
const filename = ref(getTaskName(task))

watch(
  () => task,
  (value) => {
    progress.value = calcProgress(value)
    filename.value = getTaskName(value)
  }
)

const pauseTask = async (): Promise<void> => {
  await invoke('aria2.pauseTask', { gids: [task.gid] })
}

const unpauseTask = async (): Promise<void> => {
  await invoke('aria2.unpauseTask', { gids: [task.gid] })
}

const removeTask = async (removeFile: boolean): Promise<void> => {
  await invoke('aria2.removeTask', { gids: [task.gid], removeFile })
}

const removeTaskDownloadResult = async (): Promise<void> => {
  await invoke('aria2.removeTaskResult', { gids: [task.gid] })
}

const openTaskFolder = async (): Promise<void> => {
  await invoke('aria2.openTaskFolder', { gid: task.gid })
}

const selectRadio = (): void => {
  selectedRows.value[task.gid] = selectedRows.value[task.gid] === undefined ? task : undefined
}
</script>

<style lang="scss" scoped>
.task__taskList__info {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  gap: 10px;

  .image {
    width: 50px;
  }

  .gap {
    gap: 5px !important;

    p {
      width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
    }
  }

  .status {
    width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
}

.gap-action {
  min-width: 180px;
  display: flex;
  gap: 5px !important;
  margin-left: 10px;
  justify-content: flex-end;
}
</style>
