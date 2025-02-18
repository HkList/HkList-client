<template>
  <SetLimit v-model="isShowingLimitDialog" />
  <AddTask v-model="isShowingAddDialog" />

  <t-card class="task__statusBar__card">
    <t-space>
      <t-button @click="showAddTask">添加任务</t-button>
      <t-button @click="showLimitDialog">设置限速</t-button>
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

const taskStore = useTaskStore()
const { active } = storeToRefs(taskStore)

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
