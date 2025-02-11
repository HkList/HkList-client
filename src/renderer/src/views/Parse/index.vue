<template>
  <div class="container">
    <h1 v-if="config.parse.server === ''">请先前往配置管理设置解析服务器哦~</h1>
    <template v-else>
      <div class="flex" v-if="ready">
        <Announce />
        <Form />
        <FileList />
        <LinkList />
      </div>
      <t-loading text="获取服务器数据中..." v-else />
    </template>
  </div>
</template>

<script lang="ts" setup>
import Announce from '@renderer/views/Parse/Announce.vue'
import Form from '@renderer/views/Parse/Form.vue'
import FileList from '@renderer/views/Parse/FileList.vue'
import LinkList from '@renderer/views/Parse/LinkList.vue'
import { useParseStore } from '@renderer/stores/parse.ts'
import { onActivated, ref } from 'vue'
import { useConfigStore } from '@renderer/stores/config.ts'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const ready = ref(false)
const parseStore = useParseStore()
const { GetLimitReq, GetFileListReq } = storeToRefs(parseStore)

// 进入页面自动更新 token
onMounted(() => {
  GetLimitReq.value.token = config.value.parse.token
  GetFileListReq.value.parse_password = config.value.parse.parse_password
})

// 激活页面后自动获取数据
onActivated(async () => {
  if (config.value.parse.server === '') return

  await parseStore.getConfig()
  await parseStore.getLimit()
  ready.value = true
})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h1 {
  text-align: center;
  margin-top: 50px;
  font-size: 40px;
}
</style>
