<template>
  <t-card class="tasks">
    <t-tabs :value="selected" placement="left" @change="handlerChange" theme="card" class="tabs">
      <t-tab-panel value="all">
        <template #label>
          <div class="tab-item">
            <ListIcon style="margin-left: 3px" />
            <span>全部任务</span>
          </div>
        </template>
        <TaskList :tasks="[...active, ...waiting, ...stopped]" />
      </t-tab-panel>
      <t-tab-panel value="active">
        <template #label>
          <div class="tab-item">
            <PlayIcon size="20px" />
            <span>正在下载</span>
          </div>
        </template>
        <TaskList :tasks="active" />
      </t-tab-panel>
      <t-tab-panel value="waiting">
        <template #label>
          <div class="tab-item">
            <PauseIcon size="20px" />
            <span>正在等待</span>
          </div>
        </template>
        <TaskList :tasks="waiting" />
      </t-tab-panel>
      <t-tab-panel value="stoped">
        <template #label>
          <div class="tab-item">
            <RectangleFilledIcon size="10px" style="margin-left: 4px" />
            <span>已完成/已停止</span>
          </div>
        </template>
        <TaskList :tasks="stopped" />
      </t-tab-panel>
    </t-tabs>
  </t-card>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@renderer/stores/task.ts'
import TaskList from '@renderer/views/Task/TaskList.vue'
import { storeToRefs } from 'pinia'
import { ListIcon, PauseIcon, PlayIcon, RectangleFilledIcon } from 'tdesign-icons-vue-next'
import type { TabsProps } from 'tdesign-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

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
  border-radius: 6px;
  min-height: 600px;

  .tab-item {
    display: flex;
    gap: 5px;
    align-items: center;
  }
}
</style>

<style lang="scss">
.tasks {
  .t-card__body {
    padding: 0;
    overflow: hidden;
  }
}
</style>
