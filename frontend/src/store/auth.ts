import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/interfaces/user'
import authService from '@/services/auth.service'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  fetchUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      async login(email: string, password: string): Promise<boolean> {
        set({ loading: true, error: null })
        try {
          const { access_token } = await authService.login({ email, password })
          set({ token: access_token })
          await get().fetchUser()
          return true
        } catch {
          set({ error: 'Credenciais inválidas' })
          return false
        } finally {
          set({ loading: false })
        }
      },

      async fetchUser() {
        try {
          const user = await authService.getCurrentUser()
          set({ user })
        } catch {
          get().logout()
        }
      },

      logout() {
        authService.logout()
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)
