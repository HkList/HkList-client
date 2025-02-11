<template>
  <div class="container">
    <t-card class="tasks">
      <AddTask v-model="showAddTask" />

      <t-tabs :value="selected" placement="left" @change="handlerChange" theme="card" class="tabs">
        <t-tab-panel value="add">
          <template #label>
            <div class="tab-item">
              <AddIcon style="margin-left: 3px" />
              <span>添加任务</span>
            </div>
          </template>
        </t-tab-panel>
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

    <StatusBar />
  </div>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@renderer/stores/task.ts'
import TaskList from '@renderer/views/Task/TaskList/index.vue'
import AddTask from '@renderer/views/Task/AddTask/index.vue'
import StatusBar from '@renderer/views/Task/StatusBar/index.vue'
import { storeToRefs } from 'pinia'
import { ListIcon, PauseIcon, PlayIcon, RectangleFilledIcon, AddIcon } from 'tdesign-icons-vue-next'
import type { TabsProps } from 'tdesign-vue-next'
import { onActivated, onDeactivated, ref } from 'vue'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const selected = ref('all')
const showAddTask = ref(false)

const handlerChange: TabsProps['onChange'] = (value) => {
  if (value === 'add') {
    showAddTask.value = true
    return
  }
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

<style lang="scss" scoped>
.tabs {
  border-radius: 6px;
  min-height: 580px;

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

  .t-tabs__nav-item:nth-child(1) {
    margin-bottom: 50px;
  }
}
</style>
