<template>
  <Layout jump-path="" default-value="parse">
    <t-menu-item value="parse">
      <template #icon>
        <AppIcon />
      </template>
      外链解析
    </t-menu-item>
    <t-menu-item value="account">
      <template #icon>
        <UserIcon />
      </template>
      账号管理
    </t-menu-item>
    <t-menu-item value="record">
      <template #icon>
        <UserListIcon />
      </template>
      记录管理
    </t-menu-item>
    <t-menu-item value="task">
      <template #icon>
        <ListIcon />
      </template>
      下载管理
    </t-menu-item>
    <t-submenu title="配置管理">
      <template #icon>
        <ToolsIcon />
      </template>
      <t-menu-item value="config/general"> 通用配置 </t-menu-item>
      <t-menu-item value="config/parse"> 解析配置 </t-menu-item>
      <t-menu-item value="config/aria2"> Aria2配置 </t-menu-item>
    </t-submenu>
  </Layout>
</template>

<script lang="ts" setup>
import { AppIcon, ListIcon, ToolsIcon, UserIcon, UserListIcon } from 'tdesign-icons-vue-next'
import Layout from '@renderer/views/Layout.vue'
</script>

<style lang="scss" scoped></style>
