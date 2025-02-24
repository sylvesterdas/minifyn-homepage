'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useFirebase } from '../providers/firebase-provider'

export default function AuthLayout({ children }: any) {
  const router = useRouter()
  const { user, isLoading, isAnonymous } = useFirebase()

  useEffect(() => {
    if (!isLoading && user && !isAnonymous) {
      router.push('/dashboard')
    }
  }, [user, isLoading, isAnonymous, router])

  if (isLoading) return <div>Loading...</div>

  return (!user || isAnonymous) ? children : null
}