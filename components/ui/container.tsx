interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto p-8 ${className}`}>
      {children}
    </div>
  )
}