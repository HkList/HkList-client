<template>
  <t-card>
    <t-space direction="vertical">
      Aria2
      <t-space>
        <t-button @click="getVersion">获取版本</t-button>
        <t-button @click="getActive">获取正在下载</t-button>
        <t-button @click="getWaiting">获取正在等待</t-button>
        <t-button @click="getStopped">获取已完成/已停止</t-button>
        <t-button @click="getVersion">获取版本</t-button>
      </t-space>
    </t-space>
  </t-card>
</template>

<script lang="ts" setup>
import {invoke} from "@renderer/utils/invoke.ts"

const getVersion = async () => {
  const res = await invoke("aria2.getVersion")
  console.log(res)
}

const getActive = async () => {
  const res = await invoke("aria2.getActive")
  console.log(res)
}

const getWaiting = async () => {
  const res = await invoke("aria2.getWaiting",{offset:-1,num:1000})
  console.log(res)
}

const getStopped = async () => {
  const res = await invoke("aria2.getStopped",{offset:-1,num:1000})
  console.log(res)
}
</script>

<style lang="scss" scoped></style>
