import { AxiosError } from 'axios'
import { failure } from '@main/utils/response.ts'

export function handleError(error: unknown) {
  console.log(error)

  if (error instanceof AxiosError) {
    return failure(error.response?.data.message ?? error.message ?? '未知错误')
  } else if (error instanceof Error) {
    return failure(error.message ?? '未知错误')
  } else {
    return failure('未知错误')
  }
}
