<template>
  <t-select-input
    ref="selectInput"
    :value="selectValue"
    :inputValue="inputValue"
    :popupVisible="popupVisible"
    :popupProps="{ overlayInnerStyle: { padding: '6px' } }"
    style="width: 300px"
    placeholder="请选择配置项"
    allow-input
    @popup-visible-change="onPopupVisibleChange"
    @input-change="onInputChange"
  >
    <template #panel>
      <ul class="hklist__select-input-ul-single" v-if="Aria2ClientInputOptionsKeys.length > 0">
        <li
          v-for="item in Aria2ClientInputOptionsKeys"
          :key="item"
          @click="() => onOptionClick(item)"
        >
          {{ item }}
        </li>
      </ul>
      <t-empty v-else style="padding: 20px" />
    </template>
    <template #suffixIcon>
      <ChevronDownIcon />
    </template>
  </t-select-input>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { Aria2ClientInputOptionsKeys as Aria2ClientInputOptionsKeysOrigin } from '@main/utils/aria2.ts'
import type { SelectInputProps } from 'tdesign-vue-next'
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import type { Aria2ClientInputOptionKey } from '@huan_kong/maria2'

const props = defineProps<{
  value: Aria2ClientInputOptionKey
  selectedValue: Aria2ClientInputOptionKey[]
  onChange: (newValue: Aria2ClientInputOptionKey) => void
}>()

const Aria2ClientInputOptionsKeys = ref(Aria2ClientInputOptionsKeysOrigin)
const selectValue = ref(props.value)
const inputValue = ref('')
const popupVisible = ref(false)

const onOptionClick = (item: Aria2ClientInputOptionKey) => {
  popupVisible.value = false
  inputValue.value = ''
  selectValue.value = item
  props.onChange(item)
}

const onInputChange: SelectInputProps['onInputChange'] = (val) => {
  inputValue.value = val
  Aria2ClientInputOptionsKeys.value = Aria2ClientInputOptionsKeysOrigin.filter(
    (key) => key.includes(val) && (!props.selectedValue.includes(key) || key === props.value)
  )
}

const onPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (val) => {
  // 同步弹出层
  popupVisible.value = val
  // 设置输入值并过滤选项
  onInputChange(selectValue.value)
}

const selectInput = ref()

onMounted(() => {
  onInputChange(props.value)
  if (!selectInput.value) return
  nextTick(() => selectInput.value.$refs.selectInputRef.querySelector('input').click())
})
</script>

<style lang="scss" scoped>
.hklist__select-input-ul-single {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow: auto;
}

.hklist__select-input-ul-single > li {
  display: block;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.hklist__select-input-ul-single > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
