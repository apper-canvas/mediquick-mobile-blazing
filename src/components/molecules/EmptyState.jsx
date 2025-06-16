import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'Package',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-4"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState