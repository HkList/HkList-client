import type {
  GetLimitReq as _GetLimitReq,
  GetLimitRes as _GetLimitRes,
  GetConfigRes as _GetConfigRes
} from '@main/ipc/parse.ts'
import { invoke } from '@renderer/utils/invoke.ts'

export type GetConfigRes = _GetConfigRes

export const getConfig = () => invoke<GetConfigRes>('parse.getConfig')

export type GetLimitReq = _GetLimitReq
export type GetLimitRes = _GetLimitRes

export const getLimit = (params: GetLimitReq) => invoke<GetLimitRes>('parse.getLimit', params)
