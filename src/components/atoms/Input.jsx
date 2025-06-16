import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const hasValue = value && value.length > 0
  const showLabel = focused || hasValue

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            showLabel
              ? 'top-2 text-xs text-primary font-medium'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          disabled={disabled}
          className={`w-full px-3 py-3 ${icon ? 'pl-10' : ''} ${
            type === 'password' ? 'pr-10' : ''
          } ${
            label ? 'pt-6 pb-2' : ''
          } border-2 rounded-lg transition-all duration-200 focus:outline-none ${
            error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : focused
              ? 'border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-surface-300 hover:border-surface-400'
          } ${disabled ? 'bg-surface-100 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input