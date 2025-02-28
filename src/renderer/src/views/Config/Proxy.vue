<template>
  <t-card>
    <t-form :data="config.proxy" :rules="formRules" @submit="submitForm">
      <t-form-item name="enable" label="启用代理">
        <t-switch v-model="config.proxy.enable" @change="triggerChange" />
      </t-form-item>

      <t-form-item name="http" label="HTTP代理">
        <t-input v-model="config.proxy.http" @change="triggerChange" />
      </t-form-item>

      <t-form-item name="https" label="HTTPSS代理">
        <t-input v-model="config.proxy.https" @change="triggerChange" />
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
import { useConfigStore } from '@renderer/stores/config.ts'
import { useSaveFirst } from '@renderer/utils/use/useSaveFirst.ts'
import { storeToRefs } from 'pinia'
import type { FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [haveChanged, triggerChange] = useSaveFirst()

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await configStore.saveConfig()
  haveChanged.value = false
  MessagePlugin.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
