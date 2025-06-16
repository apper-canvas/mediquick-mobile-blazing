import ApperIcon from '@/components/ApperIcon'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variantClasses = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    prescription: 'bg-warning/20 text-warning-800 border border-warning/30'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3 mr-1" />}
      {children}
    </span>
  )
}

export default Badge