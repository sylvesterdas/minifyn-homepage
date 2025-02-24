'use client'

import { auth } from '@/app/firebase/init'
import { Button } from '@/components/ui/button'

export const SignOut = () => {
  const handleSignOut = async () => {
    await auth.signOut()
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }

  return (
    <Button 
      variant="ghost"
      onPress={handleSignOut}
    >
      Sign Out
    </Button>
  )
}