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
        :selectedRowKeys="selectedRowKeys"
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
                  <t-button @click="addAria2Url(row as GetDownLoadLinksRes[number])">
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
import type { GetDownLoadLinksRes } from '@main/ipc/parse.ts'
import { invoke } from '@renderer/utils/invoke.ts'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'

const parseStore = useParseStore()
const { GetDownLoadLinksRes } = storeToRefs(parseStore)

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
    cell: (_, { row }) => (
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
    cell: (_, { row, rowIndex }) => (
      <>
        <t-button
          onClick={(event: PointerEvent) =>
            reGetDownloadLinks(event, row as GetDownLoadLinksRes[number], rowIndex)
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
  row: GetDownLoadLinksRes[number],
  rowIndex: number
) => {
  event.stopPropagation()
  const res = await parseStore.getDownloadLinks(row.fs_id)
  if (res) GetDownLoadLinksRes.value[rowIndex] = res[0]
}

const selectedRowKeys = ref<number[]>([])
const selectedRows = ref<GetDownLoadLinksRes>([])
const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
  selectedRowKeys.value = value as number[]
  selectedRows.value = (ctx.selectedRowData as GetDownLoadLinksRes).filter((row) => row.urls)
}

watch(GetDownLoadLinksRes, () => {
  selectedRowKeys.value = []
  selectedRows.value = []
})

const handlePageChange = () => {
  selectedRowKeys.value = []
  selectedRows.value = []
}

const copyLink = (event: PointerEvent, link: string) => {
  event.stopPropagation()
  copy(link)
}

const addAria2Url = async (row: GetDownLoadLinksRes[number]) => {
  if (!row.urls) return

  await invoke('aria2.addTask', {
    urls: [row.urls[0]],
    'user-agent': row.ua
  })

  MessagePlugin.success(`文件${row.filename}已开始下载`)
}

const addAria2Urls = async () => {
  selectedRows.value.forEach(addAria2Url)
}
</script>

<style lang="scss" scoped></style>
