export interface BaseResponse<T> {
  code: number
  message: string
  data: T
}

export const success = (data: any = null) => {
  return {
    code: 200,
    message: '请求成功',
    data
  }
}

export const fail = (message = '未捕获的错误', data: any = null) => {
  return { code: 500, message, data }
}
