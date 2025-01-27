import type { GetConfigRes, GetLimitReq, GetLimitRes } from '@main/ipc/parse.ts'
import { defineInvoke } from '@renderer/utils/invoke.ts'

export type { GetConfigRes }

export const getConfig = defineInvoke<null, GetConfigRes>('parse.getConfig')

export type { GetLimitReq, GetLimitRes }

export const getLimit = defineInvoke<GetLimitReq, GetLimitRes>('parse.getLimit')
