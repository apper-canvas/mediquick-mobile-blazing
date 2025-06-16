import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import OrderCard from '@/components/molecules/OrderCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { orderService, medicineService } from '@/services'

const Admin = () => {
  const [pendingOrders, setPendingOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')

  const tabs = [
    { id: 'pending', label: 'Pending Orders', icon: 'Clock' },
    { id: 'all', label: 'All Orders', icon: 'ShoppingBag' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pendingOrdersData, allOrdersData, medicinesData] = await Promise.all([
        orderService.getPendingOrders(),
        orderService.getAll(),
        medicineService.getAll()
      ])
      
      setPendingOrders(pendingOrdersData)
      setAllOrders(allOrdersData)
      setMedicines(medicinesData)
    } catch (err) {
      setError(err.message || 'Failed to load admin data')
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus)
      toast.success('Order status updated successfully')
      loadData() // Reload data to reflect changes
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getOrdersByStatus = () => {
    const statusGroups = {
      placed: [],
      pending_verification: [],
      verified: [],
      dispatched: [],
      delivered: []
    }
    
    allOrders.forEach(order => {
      if (statusGroups[order.status]) {
        statusGroups[order.status].push(order)
      }
    })
    
    return statusGroups
  }

  const getLowStockMedicines = () => {
    return medicines.filter(medicine => medicine.stock < 10)
  }

  const ordersByStatus = getOrdersByStatus()
  const lowStockMedicines = getLowStockMedicines()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage orders, prescriptions, and inventory
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-error" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockMedicines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <div>
        {loading && <SkeletonLoader count={3} type="list" />}

        {error && (
          <ErrorState
            message={error}
            onRetry={loadData}
          />
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Pending Orders Tab */}
            {activeTab === 'pending' && (
              <div>
                {pendingOrders.length === 0 ? (
                  <EmptyState
                    title="No pending orders"
                    description="All orders have been processed"
                    icon="CheckCircle"
                  />
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map((order, index) => (
                      <motion.div
                        key={order.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <OrderCard
                          order={order}
                          isAdmin={true}
                          onStatusUpdate={handleOrderStatusUpdate}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* All Orders Tab */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                {Object.entries(ordersByStatus).map(([status, orders]) => (
                  orders.length > 0 && (
                    <div key={status}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Badge variant={status === 'delivered' ? 'success' : 'primary'} className="mr-2">
                          {orders.length}
                        </Badge>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} Orders
                      </h3>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <OrderCard
                            key={order.Id}
                            order={order}
                            isAdmin={true}
                            onStatusUpdate={handleOrderStatusUpdate}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
                  <div className="p-6 border-b border-surface-200">
                    <h3 className="text-lg font-semibold text-gray-900">Medicine Inventory</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-surface-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medicine
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-surface-200">
                        {medicines.map((medicine) => (
                          <tr key={medicine.Id} className="hover:bg-surface-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                                <div className="text-sm text-gray-500">{medicine.genericName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {medicine.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {medicine.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{medicine.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={
                                  medicine.stock === 0
                                    ? 'error'
                                    : medicine.stock < 10
                                    ? 'warning'
                                    : 'success'
                                }
                              >
                                {medicine.stock === 0
                                  ? 'Out of Stock'
                                  : medicine.stock < 10
                                  ? 'Low Stock'
                                  : 'In Stock'
                                }
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Admin