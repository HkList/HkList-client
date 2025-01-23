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
import logo from '@/resources/icon.png'
import {
  isMaximized as _isMaximized,
  maximize as _maximize,
  unmaximize as _unmaximize,
  close,
  minimize
} from '@renderer/api/window.ts'
import { useSelectMenu } from '@renderer/utils/use/useSelectMenu.ts'
import { CloseIcon, Fullscreen1Icon, FullscreenExit1Icon, MinusIcon } from 'tdesign-icons-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

const [selectedMenu, changeMenu] = useSelectMenu()

const isMaximized = ref(false)

const sizeChange = async () => (isMaximized.value = await _isMaximized())

onMounted(async () => {
  isMaximized.value = await _isMaximized()
  window.addEventListener('resize', sizeChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', sizeChange)
})

const switchMaximize = async () => {
  await (isMaximized.value ? _unmaximize() : _maximize())
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
