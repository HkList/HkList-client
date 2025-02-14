<template>
  <div class="progress" :style="{ width: `${width}px`, height: `${height}px` }">
    <div
      class="progress-inner"
      :class="{ active: active }"
      :style="{ width: `${(width * progress) / 100}px` }"
    />
    <span> {{ progress }}% </span>
  </div>
</template>

<script lang="ts" setup>
const {
  progress = 0,
  active = true,
  width = 200,
  height = 20
} = defineProps<{ progress: number; active: boolean; width?: number; height?: number }>()
</script>

<style lang="scss" scoped>
.progress {
  background: #e9ecef;
  position: relative;
  border-radius: 3px;
  overflow: hidden;

  .progress-inner {
    height: 100%;
    background-color: #208fe5;
    background-size: 20px 20px;

    &.active {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      animation: progressbar 2s linear infinite;
    }
  }

  span {
    position: absolute;
    left: calc(calc(100% - 50px) / 2);
    top: calc(calc(100% - 10px) / 2);
    height: 10px;
    line-height: 10px;
    color: black;
  }
}

@keyframes progressbar {
  0% {
    background-position: 20px 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
