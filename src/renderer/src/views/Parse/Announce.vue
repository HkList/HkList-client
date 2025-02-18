<!-- eslint-disable vue/no-v-html -->

<template>
  <t-card v-if="GetConfigRes.show_announce" title="公告">
    <div v-html="GetConfigRes.announce"></div>
  </t-card>
</template>

<script lang="ts" setup>
import { useParseStore } from '@renderer/stores/parse.ts'
import { storeToRefs } from 'pinia'

const parseStore = useParseStore()
const { GetConfigRes } = storeToRefs(parseStore)
</script>

<style lang="scss" scoped></style>
