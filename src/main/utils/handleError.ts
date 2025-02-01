import { failure } from '@main/utils/response.ts'
import { AxiosError } from 'axios'

export function handleError(error: unknown) {
  console.log(error)

  if (error instanceof AxiosError) {
    return failure(`Axios请求失败: ${error.response?.data.message ?? error.message ?? '未知错误'}`)
  } else if (error instanceof Error) {
    return failure(error.message ?? '未知错误')
  } else {
    return failure('有二臂抛错误没按照规范写')
  }
}
