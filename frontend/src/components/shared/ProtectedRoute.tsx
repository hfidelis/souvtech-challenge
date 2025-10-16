'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { FullScreenLoader } from './FullScreenLoader'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { token } = useAuthStore()
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/')
    } else {
      setIsVerified(true)
    }
  }, [token, router])

  if (!isVerified) {
    return <FullScreenLoader />
  }

  return <>{children}</>
}
