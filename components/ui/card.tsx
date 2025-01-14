interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={`rounded-lg ${className}`}
      {...props}
    />
  )
}