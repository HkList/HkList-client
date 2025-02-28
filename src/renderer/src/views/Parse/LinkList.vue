<template>
  <t-card v-if="GetDownLoadLinksRes.length > 0">
    <t-space direction="vertical">
      <t-button @click="addAria2Urls()">批量下载</t-button>

      <t-table
        row-key="fs_id"
        resizable
        lazy-load
        :bordered="true"
        :data="GetDownLoadLinksRes"
        :columns="columns"
        :select-on-row-click="true"
        :selected-row-keys="selectedRowKeys"
        @select-change="handleSelectChange"
        @page-change="handlePageChange"
      >
        <template #expandedRow="{ row }">
          <t-list split size="large">
            <t-list-item v-for="(url, index) in row.urls" :key="url">
              <t-space direction="vertical">
                <t-space>
                  <t-tag size="large"> 第 {{ index + 1 }} 条 </t-tag>
                  <t-button @click="copy(url)">复制</t-button>
                  <t-button @click="addAria2Url(row as GetDownLoadLinksResType[number],index)">
                    下载
                  </t-button>
                </t-space>
                <p>
                  {{ url }}
                </p>
              </t-space>
            </t-list-item>
          </t-list>
        </template>
      </t-table>
    </t-space>
  </t-card>
</template>

<script lang="tsx" setup>
import { storeToRefs } from 'pinia'
import { useParseStore } from '@renderer/stores/parse.ts'
import { type TableProps } from 'tdesign-vue-next'
import { ref, watch } from 'vue'
import { copy } from '@renderer/utils/copy.ts'
import { LinkIcon } from 'tdesign-icons-vue-next'
import type { GetDownLoadLinksRes as GetDownLoadLinksResType } from '@main/ipc/parse.ts'
import { invoke } from '@renderer/utils/ipc.ts'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const parseStore = useParseStore()
const { GetDownLoadLinksRes, GetFileListRes } = storeToRefs(parseStore)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left'
  },
  {
    colKey: 'message',
    title: '状态'
  },
  {
    colKey: 'filename',
    title: '文件名'
  },
  {
    colKey: 'ua',
    title: 'UA',
    cell: (_, { row }): string => (
      <t-link onClick={(event: PointerEvent) => copyLink(event, row.ua)}>
        <LinkIcon />
        {row.ua}
      </t-link>
    )
  },
  {
    colKey: 'fs_id',
    title: '文件ID'
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (_, { row, rowIndex }): string => (
      <>
        <t-button
          onClick={(event: PointerEvent) =>
            reGetDownloadLinks(event, row as GetDownLoadLinksResType[number], rowIndex)
          }
        >
          重新解析
        </t-button>
      </>
    )
  }
])

const reGetDownloadLinks = async (
  event: PointerEvent,
  row: GetDownLoadLinksResType[number],
  rowIndex: number
): Promise<void> => {
  event.stopPropagation()
  const res = await parseStore.getDownloadLinks(row.fs_id)
  if (res) GetDownLoadLinksRes.value[rowIndex] = res[0]
}

const selectedRowKeys = ref<number[]>([])
const selectedRows = ref<GetDownLoadLinksResType>([])
const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
  selectedRowKeys.value = value as number[]
  selectedRows.value = (ctx.selectedRowData as GetDownLoadLinksResType).filter((row) => row.urls)
}

watch(GetDownLoadLinksRes, () => {
  selectedRowKeys.value = []
  selectedRows.value = []
})

const handlePageChange = (): void => {
  selectedRowKeys.value = []
  selectedRows.value = []
}

const copyLink = (event: PointerEvent, link: string): void => {
  event.stopPropagation()
  copy(link)
}

const addAria2Url = async (row: GetDownLoadLinksResType[number], index: number): Promise<void> => {
  if (!row.urls) return

  let filename = row.filename
  // 查询 path 参数
  if (row.fs_id && GetFileListRes.value) {
    const file = GetFileListRes.value.list.find((file) => file.fs_id === row.fs_id)
    if (file) filename = file.path
  }

  await invoke('aria2.addTask', {
    urls: [row.urls[index]],
    'user-agent': row.ua,
    out: filename
  })

  MessagePlugin.success(`文件${row.filename}已开始下载`)
}

const addAria2Urls = (): void => {
  selectedRows.value.forEach(addAria2Url)
}
</script>

<style lang="scss" scoped></style>
