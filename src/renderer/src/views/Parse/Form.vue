<template>
  <t-card>
    <t-space direction="vertical" class="space">
      <t-alert :theme="GetConfigRes.have_account ? 'success' : 'error'">
        {{ GetConfigRes.have_account ? '当前中转账号充足' : '当前中转账号不足' }}
      </t-alert>

      <t-alert :theme="GetLimitError === '' ? 'success' : 'error'">
        <t-space v-if="GetLimitError === ''">
          <span>剩余可解析文件数: {{ GetLimitRes.count }}</span>
          <span>剩余可解析大小: {{ formatBytes(GetLimitRes.size) }}</span>
          <span>到期时间: {{ GetLimitRes.expires_at }}</span>
        </t-space>
        <span v-else>
          {{ GetLimitError }}
        </span>
      </t-alert>
    </t-space>

    <t-form
      :data="GetFileListReq"
      :rules="formRules"
      :labelWidth="120"
      @submit="submitForm"
      class="form"
    >
      <t-form-item name="url" label="链接">
        <t-input v-model.trim="GetFileListReq.url" @blur="parseUrl" @change="clearDir" />
      </t-form-item>

      <t-form-item name="surl" label="提取到的链接">
        <t-input :value="GetFileListReq.surl" disabled />
      </t-form-item>

      <t-form-item name="pwd" label="提取码">
        <t-input v-model.trim="GetFileListReq.pwd" @change="clearDir" />
      </t-form-item>

      <t-form-item name="parse_password" label="解析密码" v-if="GetConfigRes.need_password">
        <t-input v-model.trim="GetFileListReq.parse_password" />
      </t-form-item>

      <t-form-item name="token" label="卡密">
        <t-input v-model.trim="GetLimitReq.token" @blur="parseStore.getLimit" />
      </t-form-item>

      <t-form-item name="dir" label="路径">
        <t-input v-model.trim="GetFileListReq.dir" disabled />
      </t-form-item>

      <template v-if="vcode.hit_captcha">
        <t-form-item label="验证码图片" name="vcode_img">
          <img :src="`${vcode.vcode_img}&t=${timestamp}`" @click="changeTimestamp" />
        </t-form-item>
        <t-form-item label="验证码字符" name="vcode_input">
          <t-input v-model="vcode.vcode_input" />
        </t-form-item>
      </template>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 获取文件列表 </t-button>
          <t-button @click="parseStore.getDownloadLinks"> 批量解析 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="tsx" setup>
import { useParseStore } from '@renderer/stores/parse.ts'
import { storeToRefs } from 'pinia'
import { formatBytes } from '@renderer/utils/format.ts'
import type { FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import { getUrlId } from '@renderer/utils/getUrlId.ts'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { invoke, ipc } from '@renderer/utils/ipc.ts'
import { httpUrlValidator } from '@renderer/utils/httpUrlValidator.ts'

const parseStore = useParseStore()
const {
  GetConfigRes,
  GetLimitReq,
  GetLimitRes,
  GetLimitError,
  GetFileListReq,
  GetFileListRes,
  vcode
} = storeToRefs(parseStore)

onMounted(() => {
  ipc.on('clipboard.change', async (_, data) => {
    const text = data.currentClipboardContent
    if (!text) return
    if (
      httpUrlValidator(text) === true &&
      (text.includes('pan.baidu.com') || text.includes('yun.baidu.com'))
    ) {
      await invoke('window.alert')
      GetFileListReq.value.url = text
      parseUrl()
    }
  })
})

const parseUrl = () => {
  const res = getUrlId(GetFileListReq.value.url)
  if (!res) return

  const { surl, pwd, url } = res
  GetFileListReq.value.surl = surl
  GetFileListReq.value.url = url
  GetFileListReq.value.dir = '/'
  if (pwd) {
    GetFileListReq.value.pwd = pwd
    MessagePlugin.success('已自动填写密码~')
  }
}

const clearDir = () => {
  GetFileListReq.value.dir = '/'
  GetFileListRes.value = undefined
}

const formRules: FormProps['rules'] = {
  url: [{ required: true, message: '链接不能为空' }, { validator: httpUrlValidator }],
  parse_password: [{ required: true, message: '解析密码不能为空' }],
  vcode_input: [{ required: true, message: '验证码不能为空' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  GetFileListReq.value.dir = '/'
  await parseStore.getFileList()
  MessagePlugin.success('获取成功')
}

const timestamp = ref(Date.now())

const changeTimestamp = () => {
  timestamp.value = Date.now()
}
</script>

<style lang="scss" scoped>
.space {
  width: 100%;
}

.form {
  margin-top: 20px;
}

img:hover {
  cursor: pointer;
}
</style>
