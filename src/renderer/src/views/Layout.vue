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
            <Fullscreen1Icon v-if="!isMaximized.isMaximized" />
            <FullscreenExit1Icon v-else />
          </t-button>
          <t-button theme="default" @click="close">
            <CloseIcon />
          </t-button>
        </t-space>
      </div>
    </t-header>
    <t-layout class="main">
      <t-aside>
        <t-menu v-model="selectedMenu" @change="changeMenu">
          <slot></slot>
        </t-menu>
      </t-aside>
      <t-content>
        <div class="content">
          <RouterView v-slot="{ Component }">
            <transition name="fade-right" mode="out-in">
              <KeepAlive>
                <component :is="Component" />
              </KeepAlive>
            </transition>
          </RouterView>
        </div>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import logo from '@/resources/icon.png'
import type { IsMaximized } from '@main/ipc/window.ts'
import { invoke } from '@renderer/utils/ipc.ts'
import { useSelectMenu } from '@renderer/utils/use/useSelectMenu.ts'
import { CloseIcon, Fullscreen1Icon, FullscreenExit1Icon, MinusIcon } from 'tdesign-icons-vue-next'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const [selectedMenu, changeMenu] = useSelectMenu()

const isMaximized = ref<IsMaximized>({
  isMaximized: false
})

const sizeChange = async (): Promise<IsMaximized> =>
  (isMaximized.value = await invoke('window.getIsMaximized'))

onMounted(async () => {
  sizeChange()
  window.addEventListener('resize', sizeChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', sizeChange)
})

const minimize = (): Promise<null> => invoke('window.minimize')
const maximize = (): Promise<null> => invoke('window.maximize')
const unMaximize = (): Promise<null> => invoke('window.unMaximize')
const close = (): Promise<null> => invoke('window.close')

const switchMaximize = async (): Promise<void> => {
  await (isMaximized.value.isMaximized ? unMaximize() : maximize())
  sizeChange()
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  height: 56px;
  flex-shrink: 0;

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

.header,
.t-layout__sider {
  opacity: 0.95;
}

.main {
  height: calc(100% - 66px);
}

.fade-right-enter-to,
.fade-right-leave-from {
  opacity: 1;
  transform: none;
}

.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.4s;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
