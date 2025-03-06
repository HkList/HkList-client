<template>
  <t-card class="record__history">
    <div class="record-container">
      <div class="record-header">
        <h3>解析记录</h3>
        <t-button theme="primary" @click="batchDelete" :disabled="selectedRowKeys.length === 0">
          批量删除
        </t-button>
      </div>

      <div class="record-list">
        <t-table
          row-key="id"
          resizable
          :bordered="true"
          :data="recordData"
          :pagination="pagination"
          :columns="columns"
          :select-on-row-click="true"
          :selected-row-keys="selectedRowKeys"
          @select-change="handleSelectChange"
          :hover="false"
        >
          <template #expanded-row="{ row }">
            <t-list split size="large">
              <t-list-item v-for="(url, index) in row.urls" :key="url">
                <t-space direction="vertical">
                  <t-space>
                    <t-tag size="large">第 {{ index + 1 }} 条</t-tag>
                    <t-button @click="copyUrl(url)">复制</t-button>
                  </t-space>
                  <p>{{ url }}</p>
                </t-space>
              </t-list-item>
            </t-list>
          </template>
        </t-table>
      </div>
    </div>
  </t-card>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { Link } from 'tdesign-vue-next' // 导入 TDesign 的 Link 组件
import type { TableProps } from 'tdesign-vue-next'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts' // 导入 MessagePlugin

// 示例数据（模拟后端数据）
const recordData = ref([
  {
    id: 1,
    file: { filename: 'z001.part1.rar' },
    ua: 'Mozilla/5.0 (netdisk; P2SP; 3.0.88)',
    created_at: '2025-03-03 21:21:32',
    size: 3932160, // 3.66 GB
    urls: ['https://example.com/download1', 'https://example.com/download2']
  },
  {
    id: 2,
    file: { filename: 'z001.part2.rar' },
    ua: 'Mozilla/5.0 (netdisk; P2SP; 3.0.88)',
    created_at: '2025-03-03 21:21:17',
    size: 3932160, // 3.66 GB
    urls: ['https://example.com/download3', 'https://example.com/download4']
  },
  {
    id: 3,
    file: { filename: 'EdrawMax 10.5.3 简体中文版...' },
    ua: 'Mozilla/5.0 (netdisk; P2SP; 3.0.88)',
    created_at: '2025-03-03 19:58:38',
    size: 196608, // 187.42 MB
    urls: ['https://example.com/download5']
  }
])

// 表格列配置
const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left'
  },
  {
    colKey: 'file.filename',
    title: '文件名',
    ellipsis: true
  },
  {
    colKey: 'ua',
    title: '下载UA',
    cell: (h, { row }) => (
      <Link onClick={() => copyUrl(row.ua)}>
        {row.ua}
      </Link>
    ),
    ellipsis: true
  },
  {
    colKey: 'created_at',
    title: '解析时间',
    ellipsis: true
  },
  {
    colKey: 'size',
    title: '文件大小',
    cell: (h, { row }) => <>{formatBytes(row.size)}</>,
    ellipsis: true
  }
])

// 分页配置
const pagination = ref({
  defaultPageSize: 5,
  total: 3,
  defaultCurrent: 1
})

// 选中行状态
const selectedRowKeys = ref<number[]>([])

// 选中行变化处理
const handleSelectChange = (keys: number[], rows: any[]) => {
  selectedRowKeys.value = keys
}

// 复制功能（使用 MessagePlugin.success 提示）
const copyUrl = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    MessagePlugin.success('已复制到剪贴板') // 使用 MessagePlugin.success 替代 alert
  }).catch(err => {
    MessagePlugin.error('复制失败，请手动复制') // 使用 MessagePlugin.error 提示错误
    console.error('复制失败:', err)
  })
}

// 批量删除
const batchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.warning('请先选择要删除的记录') // 使用 MessagePlugin.warning 提示
    return
  }
  MessagePlugin.confirm({
    content: `确定删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    onConfirm: () => {
      recordData.value = recordData.value.filter(item => !selectedRowKeys.value.includes(item.id))
      pagination.value.total = recordData.value.length
      selectedRowKeys.value = []
      MessagePlugin.success('批量删除成功') // 使用 MessagePlugin.success 提示
    }
  })
}

// 格式化文件大小（模拟 formatBytes 函数）
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
.record-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
}

.record-list {
  width: 100%;
}
</style>

<style lang="scss">
.record__history {
  .t-card__body {
    padding: 0 !important;

    .t-table {
      border-radius: 6px;
      min-height: 580px;

      .t-table__header {
        background-color: #fafafa;
      }

      .t-table__row:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
