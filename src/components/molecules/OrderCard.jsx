import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const OrderCard = ({ order, isAdmin = false, onStatusUpdate }) => {
  const {
    Id,
    items,
    status,
    totalAmount,
    prescriptionUrl,
    deliveryAddress,
    createdAt
  } = order

  const getStatusVariant = (status) => {
    switch (status) {
      case 'placed': return 'info'
      case 'pending_verification': return 'warning'
      case 'verified': return 'primary'
      case 'dispatched': return 'secondary'
      case 'delivered': return 'success'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'placed': return 'Order Placed'
      case 'pending_verification': return 'Pending Verification'
      case 'verified': return 'Verified'
      case 'dispatched': return 'Dispatched'
      case 'delivered': return 'Delivered'
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Order #{Id}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(createdAt), 'PPP')}
          </p>
        </div>
        <Badge variant={getStatusVariant(status)}>
          {getStatusText(status)}
        </Badge>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <span className="text-gray-900">{item.name}</span>
              <span className="text-gray-600 ml-2">× {item.quantity}</span>
            </div>
            <span className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Prescription */}
      {prescriptionUrl && (
        <div className="flex items-center space-x-2 mb-4 p-2 bg-warning/10 rounded-lg">
          <ApperIcon name="FileText" className="w-4 h-4 text-warning" />
          <span className="text-sm text-warning-800">Prescription uploaded</span>
        </div>
      )}

      {/* Delivery Address */}
      {deliveryAddress && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Delivery Address:</h4>
          <p className="text-sm text-gray-600">
            {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
        <div className="text-lg font-bold text-gray-900">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
        
        {isAdmin && (status === 'placed' || status === 'pending_verification') && (
          <div className="flex space-x-2">
            {status === 'placed' && (
              <Button
                size="sm"
                variant="accent"
                onClick={() => onStatusUpdate?.(Id, 'verified')}
              >
                Verify
              </Button>
            )}
            {status === 'pending_verification' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onStatusUpdate?.(Id, 'verified')}
              >
                Approve
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default OrderCard