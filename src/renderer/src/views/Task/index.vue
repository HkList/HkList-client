<template>
  <t-tabs :value="selected" placement="left" @change="handlerChange" theme="card" class="tabs">
    <t-tab-panel value="all">
      <template #label>
        <div class="tab-item">
          <ListIcon style="margin-left: 3px" />
          <span>全部任务</span>
        </div>
      </template>
      <TaskItem :task="[...active, ...waiting, ...stopped]" />
    </t-tab-panel>
    <t-tab-panel value="active">
      <template #label>
        <div class="tab-item">
          <PlayIcon size="20px" />
          <span>正在下载</span>
        </div>
      </template>
      <TaskItem :task="active" />
    </t-tab-panel>
    <t-tab-panel value="waiting">
      <template #label>
        <div class="tab-item">
          <PauseIcon size="20px" />
          <span>正在等待</span>
        </div>
      </template>
      <TaskItem :task="waiting" />
    </t-tab-panel>
    <t-tab-panel value="stoped">
      <template #label>
        <div class="tab-item">
          <RectangleFilledIcon size="10px" style="margin-left: 4px" />
          <span>已完成/已停止</span>
        </div>
      </template>
      <TaskItem :task="stopped" />
    </t-tab-panel>
  </t-tabs>
</template>

<script lang="ts" setup>
import { PauseIcon, PlayIcon, RectangleFilledIcon, ListIcon } from 'tdesign-icons-vue-next'
import type { TabsProps } from 'tdesign-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import { useTaskStore } from '@renderer/stores/task.ts'
import TaskItem from '@renderer/views/Task/TaskItem.vue'
import { storeToRefs } from 'pinia'

const selected = ref('all')
const handlerChange: TabsProps['onChange'] = (value) => {
  selected.value = value.toString()
}

const taskStore = useTaskStore()
const { active, stopped, waiting } = storeToRefs(taskStore)

const getTask = () => {
  taskStore.getAcitve()
  taskStore.getStopped()
  taskStore.getWaiting()
}

onMounted(() => {
  getTask()
  const id = setInterval(getTask, 100)

  onUnmounted(() => {
    clearInterval(id)
  })
})
</script>

<style lang="scss" scoped>
.tabs {
  border-radius: 5px;

  .tab-item {
    display: flex;
    gap: 5px;
    align-items: center;
  }
}
</style>
