import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuth } from 'firebase-admin/auth'

import { initAdmin } from '@/app/firebase/admin'

export async function getUser() {
  const token = (await cookies()).get('token')?.value

  if (!token) return null

  try {
    initAdmin()
    const decodedToken = await getAuth().verifyIdToken(token)

    return { token, uid: decodedToken.uid }
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) redirect('/signin')

  return user
}