<template>
  <Layout>
    <t-menu-item value="/parse">
      <template #icon>
        <AppIcon />
      </template>
      外链解析
    </t-menu-item>
    <t-menu-item value="/account">
      <template #icon>
        <UserIcon />
      </template>
      账号管理
    </t-menu-item>
    <t-menu-item value="/task">
      <template #icon>
        <DownloadIcon />
      </template>
      下载管理
    </t-menu-item>
    <t-submenu title="配置管理">
      <template #icon>
        <ToolsIcon />
      </template>
      <t-menu-item value="/config/general"> 通用配置 </t-menu-item>
      <t-menu-item value="/config/parse"> 解析配置 </t-menu-item>
      <t-menu-item value="/config/aria2"> Aria2配置 </t-menu-item>
    </t-submenu>
    <t-menu-item value="/debug" v-if="config.dev">
      <template #icon>
        <SettingIcon />
      </template>
      Debug
    </t-menu-item>
  </Layout>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@renderer/stores/config.ts'
import Layout from '@renderer/views/Layout.vue'
import { storeToRefs } from 'pinia'
import { AppIcon, DownloadIcon, SettingIcon, ToolsIcon, UserIcon } from 'tdesign-icons-vue-next'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
</script>

<style lang="scss" scoped></style>
