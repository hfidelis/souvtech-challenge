'use client'

import { useEffect } from 'react'
import axiosService from '@/services/axios.service'
import { useAuthStore } from '@/store/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    axiosService.setOnUnauthenticated(logout)
  }, [logout])

  return <>{children}</>
}
