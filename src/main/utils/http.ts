import { version } from '@/package.json'
import { nowConfig } from '@main/ipc/config.ts'
// @ts-ignore 忽略指纹js
import run from '@main/utils/rand.js'
import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer, Method } from 'axios'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { stringify } from 'qs'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 114514000,
  baseURL: '',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': `hklist-client/${version}`
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
        if (nowConfig.proxy.enable) {
          config.proxy = false
          config.httpAgent = new HttpsProxyAgent(nowConfig.proxy.http)
          config.httpsAgent = new HttpsProxyAgent(nowConfig.proxy.https)
        }

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
          return response.data.data
        } else {
          return response.data
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public request<T>(method: Method, url: string, param?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.request({
      method,
      url,
      ...param
    })
  }
}

export const http = new Http()
export const hkListHttp = new Http(true)
