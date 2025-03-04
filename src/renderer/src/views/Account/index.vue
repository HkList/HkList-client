<template>
  <t-space style="width: 100%; display: block;">
    <t-tabs
      v-model="value"
      theme="card"
      :addable="true"
      @add="showLoginDialog"
      @remove="removeTab"
      drag-sort
      @drag-sort="onDragend"
    >
      <t-tab-panel
        v-for="data in panelData"
        :key="data.value"
        :value="data.value"
        :label="data.label"
        :removable="data.removable"
        :draggable="data.draggable"
      >
        <div style="padding: 25px; height: 75vh; overflow: auto;">
          <!-- 批量下载按钮 -->
          <t-button
            theme="primary"
            :disabled="selectedFiles.length === 0"
            @click="batchDownload"
            style="margin-bottom: 16px;"
          >
            批量下载 ({{ selectedFiles.length }})
          </t-button>

          <!-- 文件列表 -->
          <t-table
            :data="currentFileList"
            :columns="columns"
            row-key="id"
            :stripe="true"
            :hover="true"
            @sort-change="handleSortChange"
          >
            <template #checkbox="{ row }">
              <t-checkbox
                v-model="row.selected"
                @change="handleCheckboxChange(row, $event)"
              />
            </template>
            <template #size="{ row }">
              {{ formatBytes(row && row.size !== undefined ? row.size : 0) }}
            </template>
            <template #modified="{ row }">
              {{ formatDateToString(row && row.modified !== undefined ? row.modified : '') }}
            </template>
          </t-table>
        </div>
      </t-tab-panel>
    </t-tabs>

    <!-- 登录对话框 -->
    <t-dialog
      v-model:visible="loginVisible"
      header="用户登录"
      :footer="false"
      @confirm="handleLogin"
    >
      <t-form ref="form" :data="loginForm" @submit="handleLogin">
        <t-form-item label="用户名" name="username">
          <t-input v-model="loginForm.username" placeholder="请输入用户名" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit" block>登录</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </t-space>
</template>

<script lang="tsx" setup>
import { ref, computed } from 'vue';
import { formatBytes, formatDateToString } from '@renderer/utils/format.ts';
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts';

// 类型定义
interface FileItem {
  id: number;
  name: string;
  size: number;
  modified: string;
  selected: boolean;
}

interface Panel {
  value: string;
  label: string;
  removable: boolean;
  draggable: boolean;
  files: FileItem[];
}

interface LoginForm {
  username: string;
  password: string;
}

// 状态
let id = 0;
const value = ref('first');
const loginVisible = ref(false);

const panelData = ref<Panel[]>([
  {
    value: 'first',
    label: '文件列表1',
    removable: true,
    draggable: true,
    files: [
      { id: 1, name: '文档1.pdf', size: 1099000, modified: '2025-03-01 10:00', selected: false },
      { id: 2, name: '图片2.jpg', size: 5242880, modified: '2025-03-02 15:30', selected: false },
    ],
  },
  {
    value: 'second',
    label: '文件列表2',
    removable: true,
    draggable: true,
    files: [
      { id: 3, name: '视频3.mp4', size: 10485760, modified: '2025-03-03 09:15', selected: false },
    ],
  },
]);

const columns = ref([
  {
    colKey: 'checkbox',
    title: '选择',
    width: 50,
    fixed: 'left',
    cell: 'checkbox',
  },
  {
    colKey: 'name',
    title: '文件名',
    width: 200,
    sortType: 'all',
    sorter: (a: FileItem, b: FileItem) => a.name.localeCompare(b.name),
  },
  {
    colKey: 'size',
    title: '大小',
    width: 120,
    sortType: 'all',
    sorter: (a: FileItem, b: FileItem) => (a.size || 0) - (b.size || 0),
  },
  {
    colKey: 'modified',
    title: '修改时间',
    width: 180,
    sortType: 'all',
    sorter: (a: FileItem, b: FileItem) => new Date(a.modified || 0).getTime() - new Date(b.modified || 0).getTime(),
  },
]);

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
});

// 计算属性
const currentFileList = computed(() => {
  const currentPanel = panelData.value.find(panel => panel.value === value.value);
  const files = currentPanel && Array.isArray(currentPanel.files) ? currentPanel.files : [];
  console.log('当前文件列表详情:', JSON.stringify(files, null, 2)); // 调试
  return files;
});

const selectedFiles = computed(() => currentFileList.value.filter(file => file.selected));

// 方法
const showLoginDialog = () => {
  loginVisible.value = true;
};

const handleLogin = async ({ validateResult }: { validateResult: boolean }) => {
  if (validateResult === true) {
    if (loginForm.value.username && loginForm.value.password) {
      const loading = MessagePlugin.loading('登录中...');
      try {
        panelData.value.push({
          value: `${id}`,
          label: `新文件列表${id}`,
          removable: true,
          draggable: true,
          files: [],
        });
        value.value = `${id}`;
        id += 1;

        loginForm.value.username = '';
        loginForm.value.password = '';
        loginVisible.value = false;

        MessagePlugin.close(loading);
        await MessagePlugin.success('登录成功');
      } catch (error) {
        MessagePlugin.close(loading);
        await MessagePlugin.error('登录失败');
      }
    } else {
      await MessagePlugin.error('请填写完整的用户名和密码');
    }
  }
};

const removeTab = async ({ value: val, index }: { value: string; index: number }) => {
  if (index < 0) return;
  panelData.value.splice(index, 1);
  await MessagePlugin.info('标签页已删除');
  if (panelData.value.length === 0) {
    value.value = '';
  } else if (value.value === val) {
    value.value = panelData.value[Math.max(index - 1, 0)].value;
  }
};

const onDragend = ({ currentIndex, targetIndex }: { currentIndex: number; targetIndex: number }) => {
  [panelData.value[currentIndex], panelData.value[targetIndex]] = [
    panelData.value[targetIndex],
    panelData.value[currentIndex],
  ];
  MessagePlugin.info('标签页顺序已调整');
};

const handleSortChange = ({ sortBy, descending }: { sortBy: string; descending: boolean }) => {
  const column = columns.value.find(col => col.colKey === sortBy);
  if (column && column.sorter) {
    const currentPanel = panelData.value.find(panel => panel.value === value.value);
    if (currentPanel) {
      currentPanel.files.sort((a, b) => {
        const result = column.sorter(a, b);
        return descending ? -result : result;
      });
      MessagePlugin.info('文件列表已排序');
    }
  }
};

const handleCheckboxChange = (row: FileItem, checked: boolean) => {
  const currentPanel = panelData.value.find(panel => panel.value === value.value);
  if (currentPanel) {
    const fileIndex = currentPanel.files.findIndex(file => file.id === row.id);
    if (fileIndex !== -1) {
      // 直接修改响应式数据
      currentPanel.files[fileIndex].selected = checked;
      console.log('更新后文件列表:', JSON.stringify(currentPanel.files, null, 2));
    }
  }
};

const batchDownload = async () => {
  const filesToDownload = selectedFiles.value;
  if (filesToDownload.length > 0) {
    const loading = MessagePlugin.loading(`正在下载 ${filesToDownload.length} 个文件...`);
    try {
      console.log('开始下载文件：', filesToDownload);
      // 模拟下载过程，等待 3 秒
      await new Promise(resolve => setTimeout(resolve, 3000));

      const currentPanel = panelData.value.find(panel => panel.value === value.value);
      if (currentPanel) {
        currentPanel.files = currentPanel.files.map(file => ({
          ...file,
          selected: file.selected ? false : file.selected,
        }));
        console.log('下载完成后文件列表（已取消选中）:', JSON.stringify(currentPanel.files, null, 2));
      }
      MessagePlugin.close(loading);
      await MessagePlugin.success('下载完成');
    } catch (error) {
      MessagePlugin.close(loading);
      await MessagePlugin.error('下载失败');
      throw error;
    }
  }
};
</script>
