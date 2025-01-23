<template>
  <router-view />
</template>

<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/config.ts'
import { getRandomColor } from '@renderer/utils/random.ts'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const configStore = useConfigStore()

onMounted(() => {
  configStore.getConfig()

  // 小彩蛋
  console.info(
    `%c
    ██╗  ██╗   ██╗  ██╗   ██╗        ██╗   ███████╗   ████████╗
    ██║  ██║   ██║ ██╔╝   ██║        ██║   ██╔════╝   ╚══██╔══╝
    ███████║   █████╔╝    ██║        ██║   ███████╗      ██║
    ██╔══██║   ██╔═██╗    ██║        ██║   ╚════██║      ██║
    ██║  ██║   ██║  ██╗   ███████╗   ██║   ███████║      ██║
    ╚═╝  ╚═╝   ╚═╝  ╚═╝   ╚══════╝   ╚═╝   ╚══════╝      ╚═╝   `,
    `font-family: courier; background: linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()});-webkit-background-clip: text;color: transparent;`
  )
})
</script>
