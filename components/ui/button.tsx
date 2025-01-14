interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50'

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-500',
    outline: 'border border-slate-800/50 hover:bg-slate-800/50'
  }

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3',
    lg: 'h-12 px-6'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}