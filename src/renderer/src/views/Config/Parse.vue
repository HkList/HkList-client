<template>
  <t-card>
    <t-form :data="config.parse" :rules="formRules" @submit="submitForm">
      <t-form-item name="server" label="服务器地址">
        <t-input v-model="config.parse.server" @change="triggerChange" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
          <t-button @click="getConfig"> 测试连接 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@renderer/stores/config.ts'
import { useParseStore } from '@renderer/stores/parse.ts'
import { storeToRefs } from 'pinia'
import { FormProps, MessagePlugin } from 'tdesign-vue-next'
import { useSaveFirst } from '@renderer/utils/use/useSaveFirst.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const formRules: FormProps['rules'] = {
  server: [{ required: true, message: '请输入服务器地址' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await configStore.saveConfig()
  haveChanged.value = false
  MessagePlugin.success('保存成功')
}

const parseStore = useParseStore()

const getConfig = async () => {
  if (haveChanged.value) {
    MessagePlugin.warning('请先保存配置')
    return
  }

  await parseStore.getConfig()
  MessagePlugin.success('测试连接成功')
}

const [haveChanged, triggerChange] = useSaveFirst()
</script>

<style lang="scss" scoped></style>
