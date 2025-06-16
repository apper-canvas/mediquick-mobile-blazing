import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 1, type = 'card' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-32 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-surface-200 rounded w-20"></div>
                <div className="h-6 bg-surface-200 rounded w-16"></div>
              </div>
              <div className="h-8 bg-surface-200 rounded"></div>
            </div>
          </div>
        )
      case 'list':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-surface-200 rounded w-32"></div>
                <div className="h-6 bg-surface-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-full"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              </div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
          </div>
        )
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader