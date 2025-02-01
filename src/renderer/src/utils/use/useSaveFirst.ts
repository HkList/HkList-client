import { MessagePlugin } from 'tdesign-vue-next'
import type { Ref } from 'vue'
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useSaveFirst = (): [Ref<boolean, boolean>, () => boolean] => {
  const haveChanged = ref(false)

  const triggerChange = () => (haveChanged.value = true)

  const router = useRouter()
  const remove = router.beforeEach((_to, _from, next) => {
    if (haveChanged.value) {
      MessagePlugin.warning('请先保存设置')
      next(false)
      return
    }
    next()
  })

  onUnmounted(remove)

  return [haveChanged, triggerChange]
}
