export interface BaseResponse<T = void> {
  success: boolean
  message: string
  data: T
}

export interface SuccessResponse<T> extends BaseResponse<T> {
  success: true
}

export interface FailureResponse<T> extends BaseResponse<T> {
  success: false
}

export function success<T>(data: T): SuccessResponse<T>
export function success(): SuccessResponse<null>
export function success<T>(data?: T): SuccessResponse<T | null> {
  return {
    success: true,
    message: '请求成功',
    data: data !== undefined ? data : null
  }
}

export function failure(message: string): FailureResponse<null> {
  return {
    success: false,
    message,
    data: null
  }
}
