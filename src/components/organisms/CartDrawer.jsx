import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { cartService } from '@/services'
import EmptyState from '@/components/molecules/EmptyState'
import CheckoutModal from '@/components/organisms/CheckoutModal'

const CartDrawer = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    setLoading(true)
    try {
      const items = await cartService.getCart()
      setCartItems(items)
      const totalAmount = await cartService.getCartTotal()
      setTotal(totalAmount)
    } catch (error) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (medicineId, quantity) => {
    try {
      await cartService.updateQuantity(medicineId, quantity)
      loadCart()
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const removeItem = async (medicineId) => {
    try {
      await cartService.removeFromCart(medicineId)
      toast.success('Item removed from cart')
      loadCart()
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handleOrderComplete = () => {
    setShowCheckout(false)
    onClose()
    loadCart()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="ml-auto w-full max-w-md bg-white h-full shadow-xl"
        >
          <div className="flex items-center justify-center h-full">
            <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="ml-auto w-full max-w-md bg-white h-full shadow-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  title="Your cart is empty"
                  description="Add some medicines to get started"
                  icon="ShoppingCart"
                />
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                      {item.requiresPrescription && (
                        <div className="flex items-center mt-1">
                          <ApperIcon name="FileText" className="w-3 h-3 text-warning mr-1" />
                          <span className="text-xs text-warning">Prescription required</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon name="Minus" className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.medicineId)}
                      className="p-1 text-error hover:text-error/80"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-surface-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                icon="CreditCard"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
          onComplete={handleOrderComplete}
        />
      )}
    </>
  )
}

export default CartDrawer