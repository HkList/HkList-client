<template>
  <t-list-item>
    <div class="task__taskList__info">
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
        <t-link theme="primary" v-if="task.status === 'active'" @click="pauseTask"> 暂停 </t-link>
        <t-link theme="primary" v-if="task.status === 'paused'" @click="unpauseTask"> 开始 </t-link>

        <t-link theme="primary" @click="removeTaskDownloadResult" v-if="task.status === 'removed'">
          删除任务
        </t-link>
        <t-popconfirm
          theme="danger"
          content="是否要删除文件"
          @cancel="removeTask(false)"
          @confirm="removeTask(true)"
          v-else
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
import { ref, watch } from 'vue'

const { task } = defineProps<{ task: Aria2DownloadStatus }>()

const progress = ref(calcProgress(task))
const filename = ref(getTaskName(task))

watch(
  () => task,
  (value) => {
    progress.value = calcProgress(value)
    filename.value = getTaskName(value)
  }
)

const pauseTask = async () => {
  await invoke('aria2.pauseTask', { gids: [task.gid] })
}

const unpauseTask = async () => {
  await invoke('aria2.unpauseTask', { gids: [task.gid] })
}

const removeTask = async (removeFile: boolean) => {
  await invoke('aria2.removeTask', { gids: [task.gid], removeFile })
}

const removeTaskDownloadResult = async () => {
  await invoke('aria2.removeTaskResult', { gids: [task.gid] })
}

const openTaskFolder = async () => {
  await invoke('aria2.openTaskFolder', { gid: task.gid })
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
