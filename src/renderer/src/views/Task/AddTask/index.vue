<template>
  <t-dialog v-model:visible="showAddTask" header="添加任务" :footer="false" width="80%">
    <t-form :data="addTask" :rules="formRules" :label-width="130" @submit="submitForm">
      <t-form-item label="下载链接" name="urls">
        <t-textarea v-model="urls" placeholder="支持HTTP链接" @blur="parseUrls" />
      </t-form-item>

      <t-form-item label="保存位置" name="dir">
        <SelectDir v-model="addTask.dir" />
      </t-form-item>

      <t-form-item label="线程数" name="split">
        <t-input-number v-model="addTask.split" :min="1" />
      </t-form-item>

      <t-form-item>
        <t-table row-key="key" :columns="columns" :data="Aria2ClientInputOptionsShow" bordered />
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
import { computed, ref, toRaw, watch } from 'vue'
import SelectOptions from '@renderer/views/Task/AddTask/SelectOptions.vue'
import type { AddTask } from '@main/ipc/aria2.ts'
import type { Aria2ClientInputOptionKey } from '@huan_kong/maria2'
import type { FormProps, TableProps } from 'tdesign-vue-next'
import { Input } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import { httpUrlValidator } from '@renderer/utils/httpUrlValidator.ts'
import { invoke } from '@renderer/utils/ipc.ts'
import { useConfigStore } from '@renderer/stores/config.ts'
import { storeToRefs } from 'pinia'
import SelectDir from '@renderer/components/SelectDir.vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const showAddTask = defineModel<boolean>()

const closeDialog = (): boolean => (showAddTask.value = false)

watch(showAddTask, () => {
  // 初始化参数
  urls.value = ''
  addTask.value = { urls: [], dir: config.value.aria2.dir, split: config.value.aria2.split }
  Aria2ClientInputOptions.value = [
    { key: 'user-agent', value: 'netdisk' },
    { key: 'referer', value: 'https://pan.baidu.com/disk/home' }
  ]
})

const addTask = ref<AddTask>({
  urls: [],
  dir: config.value.aria2.dir,
  split: config.value.aria2.split
})

const formRules: FormProps['rules'] = {
  urls: [
    { required: true, message: '请输入下载链接', trigger: 'blur' },
    { validator: httpUrlValidator, trigger: 'blur' }
  ]
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  const tempAddTask = { ...toRaw(addTask.value) }

  Aria2ClientInputOptions.value.forEach((v) => (tempAddTask[v.key] = v.value))

  await invoke('aria2.addTask', tempAddTask)
  MessagePlugin.success('添加任务成功')

  closeDialog()
}

const urls = ref('')
const parseUrls = (): string[] => (addTask.value.urls = urls.value.split('\n').filter(Boolean))

const Aria2ClientInputOptions = ref<{ key: Aria2ClientInputOptionKey; value: string }[]>([
  { key: 'user-agent', value: 'netdisk' },
  { key: 'referer', value: 'https://pan.baidu.com/disk/home' }
])

const Aria2ClientInputOptionsShow = computed(() => [
  ...Aria2ClientInputOptions.value,
  { key: '', value: '' }
])

const selectedValue = computed(() => Aria2ClientInputOptions.value.map((v) => v.key))

const onDelete = (rowIndex: number): { key: Aria2ClientInputOptionKey; value: string }[] =>
  Aria2ClientInputOptions.value.splice(rowIndex, 1)

const columns: TableProps['columns'] = [
  {
    title: '配置项',
    colKey: 'key',
    width: 100,
    edit: {
      component: SelectOptions,
      props: { selectedValue: selectedValue.value },
      abortEditOnEvent: ['onEnter'],
      on: () => ({
        onEnter: (ctx: { e: { preventDefault: () => void } }): void => {
          ctx?.e?.preventDefault()
        }
      }),
      onEdited: (context): void => {
        const row = Aria2ClientInputOptions.value[context.rowIndex]
        if (row) {
          row.key = context.newRowData.key
        } else {
          Aria2ClientInputOptions.value.push({ key: context.newRowData.key, value: '' })
        }
      }
    }
  },
  {
    title: '配置值',
    colKey: 'value',
    width: 100,
    edit: {
      component: Input,
      props: { autofocus: true },
      abortEditOnEvent: ['onEnter'],
      on: () => ({
        onEnter: (ctx: { e: { preventDefault: () => void } }): void => {
          ctx?.e?.preventDefault()
        }
      }),
      onEdited: (context): void => {
        const row = Aria2ClientInputOptions.value[context.rowIndex]
        if (!row) return
        row.value = context.newRowData.value
      }
    }
  },
  {
    title: '操作',
    width: 28,
    cell: (_, { rowIndex, row }) => (
      <t-button theme="danger" onClick={() => onDelete(rowIndex)} disabled={row.key === ''}>
        删除
      </t-button>
    )
  }
]
</script>

<style lang="scss" scoped></style>
