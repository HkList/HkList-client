<template>
  <t-card v-if="GetFileListRes">
    <t-table
      row-key="fs_id"
      class="parse__file-list"
      resizable
      lazy-load
      :bordered="true"
      :data="GetFileListRes.list"
      :max-height="500"
      :columns="columns"
      :select-on-row-click="true"
      :selected-row-keys="selectedRowKeys"
      @select-change="parseStore.handleSelectChange"
    />
  </t-card>
</template>

<script lang="tsx" setup>
import { storeToRefs } from 'pinia'
import { useParseStore } from '@renderer/stores/parse.ts'
import { ref } from 'vue'
import type { TableProps } from 'tdesign-vue-next'
import { formatBytes, formatTimestamp } from '@renderer/utils/format.ts'
import type { File } from '@main/ipc/parse.ts'
import { getFileIcon, iconList } from '@renderer/utils/genFileIcon.ts'

const parseStore = useParseStore()
const { GetFileListReq, GetFileListRes, selectedRowKeys, paths } = storeToRefs(parseStore)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left'
  },
  {
    colKey: 'server_filename',
    title: '文件名',
    cell: (_, { row }): string => (
      <>
        <div class="filename">
          <div
            class="ico"
            style={{
              backgroundImage: `url(${row.is_dir ? iconList['folder'] : getFileIcon(row.server_filename)})`
            }}
          />
          <span>{row.server_filename}</span>
        </div>
      </>
    ),
    ellipsis: true
  },
  {
    colKey: 'server_mtime',
    title: '修改时间',
    cell: (_, { row }): string => <>{formatTimestamp(row.server_mtime)}</>,
    ellipsis: true
  },
  {
    colKey: 'size',
    title: '文件大小',
    cell: (_, { row }): string => <>{formatBytes(row.size)}</>,
    ellipsis: true
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (_, { row }): string =>
      row.is_dir ? (
        <>
          <t-button
            theme="primary"
            onClick={(event: PointerEvent) => getDir(event, row.path, row.category)}
          >
            打开文件夹
          </t-button>
        </>
      ) : (
        <>
          <t-button
            theme="primary"
            onClick={(event: PointerEvent) => parseStore.getDownloadLinks(event, row as File)}
          >
            解析
          </t-button>
        </>
      ),
    width: 130,
    align: 'center',
    fixed: 'right'
  }
])

const getDir = async (event: PointerEvent, path: string, category: number): Promise<void> => {
  event.stopPropagation()

  GetFileListReq.value.dir = path
  if (category === -1) {
    paths.value.pop()
  } else {
    paths.value.push(path)
  }
  await parseStore.getFileList()
}
</script>

<style lang="scss">
.parse__file-list {
  .ico {
    width: 30px;
    height: 30px;
    margin-right: 15px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .filename {
    display: flex;
    align-items: center;
  }
}
</style>
