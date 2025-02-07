<template>
  <t-card>
    <t-form :data="config.general" :rules="formRules" @submit="submitForm">
      <t-form-item name="version" label="软件版本">
        <t-input v-model="packageJson.version" disabled />
      </t-form-item>

      <t-form-item name="theme" label="主题设置">
        <t-select v-model="config.general.theme" @change="triggerChange">
          <t-option label="浅色模式" value="light" />
          <t-option label="深色模式" value="dark" />
          <t-option label="跟随系统" value="system" />
        </t-select>
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import packageJson from '@/package.json'
import { useConfigStore } from '@renderer/stores/config.ts'
import { useSaveFirst } from '@renderer/utils/use/useSaveFirst.ts'
import { storeToRefs } from 'pinia'
import type { FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [haveChanged, triggerChange] = useSaveFirst()

const formRules: FormProps['rules'] = {
  theme: [{ required: true, message: '请选择主题设置' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await configStore.saveConfig()
  haveChanged.value = false
  MessagePlugin.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
