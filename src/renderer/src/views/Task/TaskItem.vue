<template>
  <div class="container">
    <p>{{ prop.task }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Aria2DownloadStatus } from '@huan_kong/maria2/index.js'

const prop = defineProps<{ task: Aria2DownloadStatus[] }>()
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
</style>
