<template>
  <t-card>
    <t-space direction="vertical">
      Aria2
      <t-space>
        <t-button @click="getVersion">获取版本</t-button>
        <t-button @click="getVersion">获取版本</t-button>
        <t-button @click="getVersion">获取版本</t-button>
        <t-button @click="getVersion">获取版本</t-button>
        <t-button @click="getVersion">获取版本</t-button>
      </t-space>
    </t-space>
  </t-card>
</template>

<script lang="ts" setup>
import { getVersion as getVersionApi } from '@renderer/api/aria2.ts'

const getVersion = async () => {
  const res = await getVersionApi()
  console.log(res)
}
</script>

<style lang="scss" scoped></style>
