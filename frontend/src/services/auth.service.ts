import axiosService from './axios.service'
import type { AxiosInstance } from 'axios'

import { LoginCredentials, AuthResponse } from '@/interfaces/auth'
import { User } from '@/interfaces/user'

class AuthService {
  private static instance: AuthService
  private axios: AxiosInstance
  private service: typeof axiosService

  private constructor() {
    this.axios = axiosService.getAxios()
    this.service = axiosService
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.axios.post<AuthResponse>('auth/login', credentials)
    this.service.setToken(data.access_token)
    return data
  }

  async register(credentials: LoginCredentials): Promise<User> {
    const { data } = await this.axios.post<User>(
      'auth/register',
      credentials,
    )

    return data
  }

  async getCurrentUser() {
    const { data } = await this.axios.get('users/me')
    return data
  }

  logout() {
    axiosService.clearToken()
  }
}

const authService = AuthService.getInstance()

export default authService
