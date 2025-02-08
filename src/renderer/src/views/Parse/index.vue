<template>
  <div class="flex" v-if="ready">
    <Announce />
    <Form />
    <FileList />
    <LinkList />
  </div>
  <t-loading text="获取服务器数据中..." v-else />
</template>

<script lang="ts" setup>
import Announce from '@renderer/views/Parse/Announce.vue'
import Form from '@renderer/views/Parse/Form.vue'
import FileList from '@renderer/views/Parse/FileList.vue'
import LinkList from '@renderer/views/Parse/LinkList.vue'
import { useParseStore } from '@renderer/stores/parse.ts'
import { onMounted, ref } from 'vue'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const ready = ref(false)
const parseStore = useParseStore()
onMounted(async () => {
  try {
    await parseStore.getConfig()
    await parseStore.getLimit()
    ready.value = true
  } catch (error) {
    MessagePlugin.error('获取配置失败,请前往设置检查解析配置中设置的服务器地址是否正确')
  }
})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
