<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDark } from '@renderer/utils/use/useDark.ts'
import { getRandomColor } from '@renderer/utils/random.ts'

onMounted(() => {
  useDark()

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
