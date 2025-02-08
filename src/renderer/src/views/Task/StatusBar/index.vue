<template>
  <SetLimit v-model="isShowingLimitDialog" />

  <t-card class="fixed">
    <t-space>
      <span>下载速度: {{ formatBytes(download) }}/s</span>
      <t-button @click="showLimitDialog">设置限速</t-button>
    </t-space>
  </t-card>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@renderer/stores/task.ts'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { formatBytes } from '@renderer/utils/format.ts'
import SetLimit from '@renderer/views/Task/StatusBar/SetLimit.vue'

const taskStore = useTaskStore()
const { active } = storeToRefs(taskStore)

const download = computed(() =>
  active.value.reduce((prev, curr) => prev + parseFloat(curr.downloadSpeed), 0)
)

const isShowingLimitDialog = ref(false)

const showLimitDialog = () => {
  isShowingLimitDialog.value = true
}
</script>

<style lang="scss">
.fixed {
  position: absolute;
  bottom: -75px;
  right: 0;

  .t-card__body {
    padding: 15px !important;

    span {
      line-height: 30px;
    }
  }
}
</style>
