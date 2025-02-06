<template>
  <t-list-item>
    <div class="flex">
      <img :src="getFileIcon(filename)" class="image" />
      <t-space direction="vertical" class="gap">
        <p>{{ filename }}</p>
        <p>{{ formatBytes(task.completedLength) }} / {{ formatBytes(task.totalLength) }}</p>
      </t-space>
      <p>
        {{
          task.status === 'active'
            ? `${formatBytes(task.downloadSpeed)}/s`
            : matchStatus(task.status)
        }}
      </p>
      <Progress :active="task.status === 'active'" :progress="parseFloat(progress)" />
    </div>

    <template #action>
      <t-space class="gap-action">
        <template v-if="task.status === 'removed'">
          <t-link theme="primary" @click="removeTaskDownloadResult"> 删除任务 </t-link>
        </template>
        <template v-else>
          <t-link theme="primary" v-if="task.status === 'active'" @click="pauseTask"> 暂停 </t-link>
          <t-link theme="primary" v-else @click="unpauseTask"> 开始 </t-link>
          <t-popconfirm
            theme="danger"
            content="是否要删除文件"
            @cancel="removeTask(false)"
            @confirm="removeTask(true)"
          >
            <t-link theme="primary"> 删除任务 </t-link>
          </t-popconfirm>
        </template>
        <t-link theme="primary" @click="openTaskFolder"> 打开文件位置 </t-link>
      </t-space>
    </template>
  </t-list-item>
</template>

<script lang="ts" setup>
import type { Aria2DownloadStatus } from '@huan_kong/maria2'
import { calcProgress, getTaskName, matchStatus } from '@main/utils/aria2'
import Progress from '@renderer/components/Progress.vue'
import { formatBytes } from '@renderer/utils/format.ts'
import { getFileIcon } from '@renderer/utils/genFileIcon.ts'
import { invoke } from '@renderer/utils/invoke.ts'
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
.image {
  width: 50px;
}

.flex {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
}

.gap {
  gap: 5px !important;
  align-items: center;
}

.gap-action {
  gap: 5px !important;
  margin-left: 10px;
}
</style>
