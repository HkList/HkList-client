<template>
  <div class="page">
    <div class="container">
      <div class="font-h1">:(</div>
      <div class="tip">你的电脑遇到问题, 需要重新启动</div>
      <div class="tip">我们只收集某些错误信息, 然后自动为你重新启动</div>
      <div class="complete">
        <span class="percentage">{{ complete }}</span>
        <span>% 完成</span>
      </div>
      <div class="details">
        <div class="qr-image">
          <img :src="qrcode" />
        </div>
        <div class="stopcode">
          <div class="stopcode-text">
            有关问题的详细信息和可能的解决方法, 请访问 https://cutt.ly/kwErLg0w
          </div>
          <div class="stopcode-text">
            <p>如需致电支持人员, 请向他们提供以下信息:</p>
            <p>终止代码: TRICKED BY RICKROLL</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import qrcode from '@/resources/qrcode.png'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const complete = ref(0)
const timer = ref(0)

function process() {
  complete.value += Math.floor(Math.random() * 10)
  if (complete.value >= 100) {
    complete.value = 100
    router.push('/')
  } else {
    processInterval()
  }
}

const processInterval = () => (timer.value = window.setTimeout(process, Math.random() * 500))

onMounted(() => processInterval())

onBeforeUnmount(() => clearTimeout(timer.value))
</script>

<style lang="scss">
#app {
  margin: 0;
  padding: 0;
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #0078d7;
  color: white;

  .container {
    width: 70vw;
    height: auto !important;

    .font-h1 {
      font-size: 120px;
    }
    .tip {
      font-size: 30px;
      padding-top: 20px;
    }
    .complete {
      font-size: 30px;
      padding: 30px 0;
    }
    .details {
      display: flex;
      align-items: center;
      .qr-image img {
        height: 120px;
        width: 120px;
      }
      .stopcode {
        padding-left: 15px;
        height: 120px;

        .stopcode-text {
          display: block;
          padding: 4px 0;
          font-size: 16px;

          p {
            margin: 5px 0 0 0;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .container {
    width: 90vw !important;
  }
  .tip {
    font-size: 20px !important;
    padding-top: 20px;
  }
  .complete {
    font-size: 20px !important;
    padding: 30px 0;
  }
  .stopcode-text {
    font-size: 15px !important;
  }
}
</style>
