<template>
  <div class="container">
    <StatusBar />

    <t-card class="tasks">
      <t-tabs :value="selected" placement="left" @change="handlerChange" theme="card" class="tabs">
        <t-tab-panel value="all">
          <template #label>
            <ListIcon style="margin-left: 3px" />
            <span>全部任务</span>
          </template>
          <TaskList :tasks="[...active, ...waiting, ...stopped]" />
        </t-tab-panel>
        <t-tab-panel value="active">
          <template #label>
            <PlayIcon size="20px" />
            <span>正在下载</span>
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
            <RectangleFilledIcon size="10px" style="margin-left: 4px" />
            <span>已完成/已停止</span>
          </template>
          <TaskList :tasks="stopped" />
        </t-tab-panel>
      </t-tabs>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@renderer/stores/task.ts'
import TaskList from '@renderer/views/Task/TaskList/index.vue'
import StatusBar from '@renderer/views/Task/StatusBar/index.vue'
import { storeToRefs } from 'pinia'
import { ListIcon, PauseIcon, PlayIcon, RectangleFilledIcon } from 'tdesign-icons-vue-next'
import type { TabsProps } from 'tdesign-vue-next'
import { onActivated, onDeactivated, ref } from 'vue'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const selected = ref('all')

const handlerChange: TabsProps['onChange'] = (value) => {
  selected.value = value.toString()
}

const taskStore = useTaskStore()
const { active, stopped, waiting } = storeToRefs(taskStore)

const getTask = async () => {
  try {
    await Promise.all([taskStore.getAcitve(), taskStore.getStopped(), taskStore.getWaiting()])
    return true
  } catch (error) {
    MessagePlugin.error((error as { message?: string })?.message ?? '未知错误')
    return false
  }
}

const componentActive = ref(false)
const startTaskPolling = async () => {
  const success = await getTask()
  const nextDelay = success ? 500 : 5000
  if (!componentActive.value) return
  window.setTimeout(startTaskPolling, nextDelay)
}

onActivated(() => {
  componentActive.value = true
  startTaskPolling()
})

onDeactivated(() => {
  componentActive.value = false
})
</script>

<style lang="scss">
.tasks {
  .t-card__body {
    padding: 0 !important;
  }
}

.tabs {
  border-radius: 6px;
  min-height: 580px;

  .t-tabs__nav-item-text-wrapper {
    display: flex;
    gap: 5px;
    align-items: center;
  }
}

.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
