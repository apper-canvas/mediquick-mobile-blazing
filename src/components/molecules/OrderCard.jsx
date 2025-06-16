import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import React from "react";

const OrderCard = ({ order, isAdmin = false, onStatusUpdate }) => {
  // Enhanced validation for order object
  if (!order || typeof order !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="text-center text-gray-500">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 mx-auto mb-2" />
          <p>Order data not available</p>
        </div>
      </div>
    );
  }

  // Safer property access with optional chaining and validation
  const orderId = order?.Id || order?.id || '';
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const orderStatus = order?.status || 'unknown';
  const orderTotal = typeof order?.totalAmount === 'number' ? order.totalAmount : 0;
  const prescriptionUrl = order?.prescriptionUrl || null;
  const deliveryAddress = order?.deliveryAddress || {};
  const createdAt = order?.createdAt || new Date().toISOString();

  // Validate essential order data
  if (!orderId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="text-center text-gray-500">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 mx-auto mb-2" />
          <p>Invalid order data</p>
        </div>
      </div>
    );
  }

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
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-all duration-200">
{/* Header */}
    <div className="flex items-center justify-between mb-4">
        <div>
            <h3 className="font-semibold text-gray-900">Order #{orderId}</h3>
            <p className="text-sm text-gray-600">
                {format(new Date(createdAt), "PPP")}
            </p>
        </div>
        <Badge variant={getStatusVariant(orderStatus)}>
            {getStatusText(orderStatus)}
        </Badge>
    </div>
    {/* Items */}
    <div className="space-y-3 mb-4">
        {orderItems.map((item, index) => <div key={index} className="flex items-center space-x-3">
            {/* Item Image */}
            <div className="flex-shrink-0">
                <img
                    src={`/api/placeholder/200/200`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-surface-100" />
            </div>
            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <span className="text-gray-900 font-medium text-sm block truncate">{item.name}</span>
                        <span className="text-gray-600 text-xs">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-semibold text-sm ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>)}
    </div>
    {/* Prescription */}
    {prescriptionUrl && <div className="flex items-center space-x-2 mb-4 p-2 bg-warning/10 rounded-lg">
        <ApperIcon name="FileText" className="w-4 h-4 text-warning" />
        <span className="text-sm text-warning-800">Prescription uploaded</span>
    </div>}
    {/* Delivery Address */}
    {deliveryAddress && <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Delivery Address:</h4>
        <p className="text-sm text-gray-600">
            {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.state}- {deliveryAddress.pincode}
        </p>
    </div>}
    {/* Footer */}
    <div
        className="flex items-center justify-between pt-4 border-t border-surface-200">
        <div className="text-lg font-bold text-gray-900">Total: ₹{orderTotal.toFixed(2)}
        </div>
        {isAdmin && (orderStatus === "placed" || orderStatus === "pending_verification") && <div className="flex space-x-2">
            {orderStatus === "placed" && <Button
                size="sm"
                variant="accent"
                onClick={() => onStatusUpdate?.(orderId, "verified")}>Verify
                              </Button>}
            {orderStatus === "pending_verification" && <Button
                size="sm"
                variant="primary"
                onClick={() => onStatusUpdate?.(orderId, "verified")}>Approve
                              </Button>}
        </div>}
    </div>
</motion.div>
  )
}

export default OrderCard