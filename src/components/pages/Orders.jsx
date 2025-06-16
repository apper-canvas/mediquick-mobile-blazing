import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import OrderCard from '@/components/molecules/OrderCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { orderService } from '@/services'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const statusFilters = [
    { value: 'all', label: 'All Orders', count: 0 },
    { value: 'placed', label: 'Placed', count: 0 },
    { value: 'pending_verification', label: 'Pending', count: 0 },
    { value: 'verified', label: 'Verified', count: 0 },
    { value: 'dispatched', label: 'Dispatched', count: 0 },
    { value: 'delivered', label: 'Delivered', count: 0 }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const allOrders = await orderService.getAll()
      // Filter by current user in real app
      const userOrders = allOrders.filter(order => order.userId === 'user123')
      setOrders(userOrders)
    } catch (err) {
      setError(err.message || 'Failed to load orders')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = () => {
    if (filter === 'all') return orders
    return orders.filter(order => order.status === filter)
  }

  const getStatusCounts = () => {
    const counts = { all: orders.length }
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })
    return counts
  }

  const filteredOrders = getFilteredOrders()
  const statusCounts = getStatusCounts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          My Orders
        </h1>
        <p className="text-gray-600">
          Track your medicine orders and view order history
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === filterOption.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                }`}
              >
                <span>{filterOption.label}</span>
                <Badge
                  variant={filter === filterOption.value ? 'default' : 'primary'}
                  size="sm"
                  className={filter === filterOption.value ? 'bg-white/20 text-white' : ''}
                >
                  {statusCounts[filterOption.value] || 0}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <div>
        {loading && <SkeletonLoader count={3} type="list" />}

        {error && (
          <ErrorState
            message={error}
            onRetry={loadOrders}
          />
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <EmptyState
            title={filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            description={
              filter === 'all'
                ? 'Start shopping to see your orders here'
                : `You don't have any ${filter} orders at the moment`
            }
            actionLabel="Browse Medicines"
            onAction={() => window.location.href = '/medicines'}
            icon="ShoppingBag"
          />
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Order Status Guide */}
      {!loading && !error && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-surface-50 rounded-lg p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Info" className="w-5 h-5 mr-2" />
            Order Status Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <Badge variant="info">Placed</Badge>
              <span className="text-gray-600">Order received and being processed</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="warning">Pending</Badge>
              <span className="text-gray-600">Awaiting prescription verification</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="primary">Verified</Badge>
              <span className="text-gray-600">Prescription approved, preparing order</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">Dispatched</Badge>
              <span className="text-gray-600">Order shipped and on the way</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="success">Delivered</Badge>
              <span className="text-gray-600">Order successfully delivered</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Orders