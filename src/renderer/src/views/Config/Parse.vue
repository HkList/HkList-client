<template>
  <t-card>
    <t-form :data="config.parse" :rules="formRules" @submit="submitForm">
      <t-form-item name="server" label="服务器地址">
        <t-input v-model="config.parse.server" @change="triggerChange" />
      </t-form-item>

      <t-form-item name="token" label="服务器卡密">
        <t-input v-model="config.parse.token" @change="triggerChange" />
      </t-form-item>

      <t-form-item name="parse_password" label="服务器密码" help="无密码留空即可">
        <t-input v-model="config.parse.parse_password" @change="triggerChange" />
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
import { useSaveFirst } from '@renderer/utils/use/useSaveFirst.ts'
import { storeToRefs } from 'pinia'
import type { FormProps } from 'tdesign-vue-next'
import { httpUrlValidator } from '@renderer/utils/httpUrlValidator.ts'
import { formatBytes } from '@renderer/utils/format.ts'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [haveChanged, triggerChange] = useSaveFirst()

const formRules: FormProps['rules'] = {
  server: [
    { required: true, message: '请输入服务器地址' },
    {
      validator: httpUrlValidator
    }
  ],
  token: [{ required: true, message: '请输入服务器卡密' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await configStore.saveConfig()
  haveChanged.value = false
  MessagePlugin.success('保存成功')
}

const parseStore = useParseStore()
const { GetLimitReq, GetLimitRes, GetFileListReq, GetLimitError } = storeToRefs(parseStore)

const getConfig = async (): Promise<void> => {
  if (haveChanged.value) {
    MessagePlugin.warning('请先保存配置')
    return
  }

  await parseStore.getConfig()
  MessagePlugin.success('测试连接成功')

  GetLimitReq.value.token = config.value.parse.token
  GetFileListReq.value.parse_password = config.value.parse.parse_password

  await parseStore.getLimit()
  if (GetLimitError.value === '') {
    MessagePlugin.success('获取卡密配额成功')
    const { count, size, expires_at } = GetLimitRes.value
    MessagePlugin.success(`剩余解析大小: ${formatBytes(size)}`)
    MessagePlugin.success(`剩余解析次数: ${count}`)
    MessagePlugin.success(`过期时间: ${expires_at}`)
  }

  await parseStore.getFileList(true)
  MessagePlugin.success('服务器密码校验成功')
}
</script>

<style lang="scss" scoped></style>
