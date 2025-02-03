import { failure } from '@main/utils/response.ts'
import { AxiosError } from 'axios'

export interface Aria2Error {
  code: number
  message: string
}

export function checkIsAria2Error(error: unknown): error is Aria2Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as any).code === 'number' &&
    typeof (error as any).message === 'string'
  )
}

export function handleError(error: unknown) {
  console.log(error)

  if (error instanceof AxiosError) {
    return failure(`Axios请求失败: ${error.response?.data.message ?? error.message ?? '未知错误'}`)
  } else if (error instanceof Error) {
    return failure(error.message ?? '未知错误')
  } else if (checkIsAria2Error(error)) {
    return failure(`aria2请求出错: ${error.message ?? '未知错误'}`)
  } else {
    return failure('有二臂抛错误没按照规范写')
  }
}
