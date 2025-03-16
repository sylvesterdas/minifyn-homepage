import dynamic from 'next/dynamic'
const AuthForm = dynamic(() => import('@/components/auth/AuthForm'))

export default function SignInPage() {
  return <AuthForm mode="signin" />
}