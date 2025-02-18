<template>
  <t-list split class="list">
    <div v-if="tasks.length === 0" class="empty">
      <t-empty />
    </div>
    <TaskItem v-for="task in tasks" v-else :key="task.gid" :task="task" />
  </t-list>
</template>

<script lang="ts" setup>
import type { Aria2DownloadStatus } from '@huan_kong/maria2'
import TaskItem from '@renderer/views/Task/TaskList/TaskItem.vue'

const { tasks } = defineProps<{ tasks: Aria2DownloadStatus[] }>()
</script>

<style lang="scss" scoped>
.list {
  margin: 10px;
  border: 1.5px solid #393939;
  border-radius: 6px;
}

.empty {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
