<template>
  <div class="selectDir">
    <t-input v-model="model" />
    <t-button @click="showSelectDir">选择</t-button>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from '@renderer/utils/ipc.ts'

const model = defineModel()

const showSelectDir = async () => {
  const result = await invoke('window.selectFoloder')
  if (result.cancel) return
  model.value = result.folder
}
</script>

<style lang="scss" scoped>
.selectDir {
  display: flex;
  gap: 20px;
  width: 100%;
}
</style>
