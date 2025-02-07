<template>
  <t-card>
    <t-form :data="config.aria2" :rules="formRules" @submit="submitForm" :labelWidth="120">
      <t-form-item name="dir" label="下载位置" @change="triggerChange">
        <div class="input">
          <t-input v-model="config.aria2.dir" />
          <t-button @click="showSelectDir">选择</t-button>
        </div>
      </t-form-item>

      <t-form-item name="rpc-listen-port" label="RPC端口" @change="triggerChange">
        <t-input v-model="config.aria2['rpc-listen-port']" :min="1" />
      </t-form-item>

      <t-form-item name="rpc-secret" label="RPC密钥" @change="triggerChange">
        <t-input v-model="config.aria2['rpc-secret']" />
      </t-form-item>

      <t-form-item name="max-concurrent-downloads" label="最大同时下载数" @change="triggerChange">
        <t-input-number v-model="config.aria2['max-concurrent-downloads']" :min="1" />
      </t-form-item>

      <t-form-item name="split" label="下载线程数" @change="triggerChange">
        <t-input-number v-model="config.aria2.split" :min="1" />
      </t-form-item>

      <t-form-item
        name="max-overall-download-limit"
        label="下载限速"
        @change="triggerChange"
        help="0为不限速"
      >
        <t-input-number v-model="config.aria2['max-overall-download-limit']" :min="0" />
        <span style="margin-left: 10px">MB/s</span>
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
          <t-button @click="restart"> 重启Aria2 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@renderer/stores/config.ts'
import { invoke } from '@renderer/utils/invoke.ts'
import { useSaveFirst } from '@renderer/utils/use/useSaveFirst.ts'
import { storeToRefs } from 'pinia'
import type { FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [haveChanged, triggerChange] = useSaveFirst()

const formRules: FormProps['rules'] = {
  dir: [{ required: true, message: '请输入下载位置' }],
  'rpc-listen-port': [{ required: true, message: '请输入RPC端口' }],
  'max-concurrent-downloads': [{ required: true, message: '请输入最大同时下载数' }],
  split: [{ required: true, message: '请输入下载线程数' }],
  'max-overall-download-limit': [{ required: true, message: '请输入下载限速' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await configStore.saveConfig()
  haveChanged.value = false
  MessagePlugin.success('保存成功')

  restart()
}

const showSelectDir = async () => {
  const result = await invoke('window.selectFoloder')
  if (result.cancel) {
    MessagePlugin.info('取消选择')
    return
  }
  config.value.aria2.dir = result.folder
}

const restart = async () => {
  await invoke('aria2.restart')
  MessagePlugin.success('重启Aria2成功')
}
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  gap: 20px;
  width: 100%;
}
</style>
