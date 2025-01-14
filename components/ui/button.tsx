import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all rounded-lg'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/20',
    secondary: 'text-slate-400 hover:text-white',
    ghost: 'hover:bg-slate-800/50'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}