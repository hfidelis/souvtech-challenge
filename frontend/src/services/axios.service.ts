import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

class AxiosService {
  private static instance: AxiosService
  private axiosInstance: AxiosInstance
  private token: string | null = null
  private onUnauthenticated: (() => void) | null = null

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/',
      timeout: 60000,
    })

    this.initializeInterceptors()
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService()
    }
    return AxiosService.instance
  }

  private initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error: unknown) => Promise.reject(error),
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          if (this.onUnauthenticated) {
            this.onUnauthenticated()
          }
        }
        return Promise.reject(error)
      },
    )
  }

  public setOnUnauthenticated(callback: () => void) {
    this.onUnauthenticated = callback
  }

  public setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  public clearToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  public getAxios(): AxiosInstance {
    return this.axiosInstance
  }
}

const axiosService = AxiosService.getInstance()
export default axiosService