import run from '@main/utils/fingerprint.js'
import type { BaseResponse } from '@main/utils/response.ts'
import { fail, success } from '@main/utils/response.ts'
import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer, Method } from 'axios'
import axios from 'axios'
import { stringify } from 'qs'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  baseURL: '',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
}

class Http {
  public axiosInstance: AxiosInstance = axios.create(defaultConfig)
  public isHkList: boolean = false

  constructor(isHkList = false) {
    this.isHkList = isHkList
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.isHkList) {
          return run(config)
        } else {
          return config
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (this.isHkList) {
          return success(response.data.data)
        } else {
          return response.data
        }
      },
      (error) => {
        if (this.isHkList) {
          return fail(
            error?.response?.data?.message ?? '未知错误,可能是服务器地址有误',
            error?.response?.data?.data
          )
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  public request<T>(
    method: Method,
    url: string,
    param?: AxiosRequestConfig
  ): Promise<BaseResponse<T>> {
    return this.axiosInstance.request({
      method,
      url,
      ...param
    })
  }
}

export const http = new Http()
export const hkListHttp = new Http(true)
