<template>
  <t-dialog v-model:visible="showDialog" header="设置限速" :footer="false">
    <t-form :data="setLimit" :rules="formRules" @submit="submitForm">
      <t-form-item label="下载速度" name="max-overall-download-limit" help="0为不限速">
        <t-input-adornment append="MB/s">
          <t-input-number
            v-model="setLimit['max-overall-download-limit']"
            :min="0"
            :auto-width="true"
          />
        </t-input-adornment>
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button theme="default" @click="closeDialog"> 取消 </t-button>
          <t-button type="submit"> 提交 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="tsx" setup>
import { onMounted, ref } from 'vue'
import { invoke } from '@renderer/utils/ipc.ts'
import type { FormProps } from 'tdesign-vue-next'
import type { Aria2ClientGlobalOptions } from '@huan_kong/maria2'
import { MB } from '@renderer/utils/format.ts'

const showDialog = defineModel<boolean>()

const closeDialog = (): boolean => (showDialog.value = false)

const setLimit = ref<Aria2ClientGlobalOptions>({
  'max-overall-download-limit': 0
})

const formRules: FormProps['rules'] = {
  'max-overall-download-limit': [{ required: true, message: '请输入下载速度', trigger: 'blur' }]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await invoke('aria2.changeGlobalOption', {
    ...setLimit.value,
    'max-overall-download-limit': (setLimit.value['max-overall-download-limit'] ?? 0) * MB
  })
  await getGlobalOptions()

  closeDialog()
}

const getGlobalOptions = async (): Promise<void> => {
  const options = await invoke('aria2.getGlobalOption')
  options['max-overall-download-limit'] = (options['max-overall-download-limit'] ?? 0) / MB
  setLimit.value = options
}

onMounted(getGlobalOptions)
</script>

<style lang="scss" scoped></style>
