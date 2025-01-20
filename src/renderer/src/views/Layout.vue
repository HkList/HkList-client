<template>
  <t-layout>
    <t-header class="header">
      <div class="title">
        <img :src="logo" />
        <span>HkList-client</span>
      </div>
      <div class="control">
        <t-space>
          <t-button theme="default" @click="minimize">
            <MinusIcon />
          </t-button>
          <t-button theme="default" @click="switchMaximize">
            <Fullscreen1Icon v-if="!isMaximized" />
            <FullscreenExit1Icon v-else />
          </t-button>
          <t-button theme="default" @click="close">
            <CloseIcon />
          </t-button>
        </t-space>
      </div>
    </t-header>
    <t-layout>
      <t-aside>
        <t-menu v-model="selectedMenu" @change="changeMenu">
          <slot></slot>
        </t-menu>
      </t-aside>
      <t-content>
        <div class="content">
          <RouterView />
        </div>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { useSelectMenu } from '@renderer/utils/use/useSelectMenu.ts'
import logo from '@/resources/icon.png'
import { CloseIcon, FullscreenExit1Icon, Fullscreen1Icon, MinusIcon } from 'tdesign-icons-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import {
  minimize,
  maximize as _maximize,
  unmaximize as _unmaximize,
  close,
  isMaximized as _isMaximized
} from '@renderer/api/window.ts'

const params = defineProps({
  jumpPath: {
    type: String,
    required: true
  },
  defaultValue: {
    type: String,
    required: true
  }
})

const [selectedMenu, changeMenu] = useSelectMenu(params.jumpPath, params.defaultValue)

const isMaximized = ref(false)

onMounted(async () => {
  isMaximized.value = await _isMaximized()

  window.onresize = async () => {
    isMaximized.value = await _isMaximized()
  }
})

onUnmounted(() => {
  window.onresize = null
})

const switchMaximize = async () => {
  if (isMaximized.value) {
    await _unmaximize()
  } else {
    await _maximize()
  }
  isMaximized.value = !isMaximized.value
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 65px;

  .title {
    display: flex;
    align-items: center;
    gap: 15px;

    img {
      width: 50px;
    }

    span {
      font-size: 22px;
      font-weight: bold;
    }
  }

  .control {
    display: flex;
    align-items: center;

    .t-button {
      padding: 10px;
    }
  }
}
</style>
