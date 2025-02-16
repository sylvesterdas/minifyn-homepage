"use client"

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '@/app/firebase/init'
import { Button } from '@/components/ui/button'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Sign In</h2>
      <form className="space-y-4" onSubmit={handleSignIn}>
        <input
          required
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" type="submit">Sign In</Button>
      </form>
    </div>
  )
}