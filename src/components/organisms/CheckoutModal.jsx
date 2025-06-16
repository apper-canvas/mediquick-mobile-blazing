import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { orderService, cartService } from '@/services'

const CheckoutModal = ({ cartItems, total, onClose, onComplete }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    prescription: null
  })

  const hasPrescriptionItems = cartItems.some(item => item.requiresPrescription)

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        prescription: file
      }))
    }
  }

  const validateStep = () => {
    if (step === 1) {
      const { street, city, state, pincode } = formData.address
      return street && city && state && pincode
    }
    if (step === 2 && hasPrescriptionItems) {
      return formData.prescription
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1 && hasPrescriptionItems) {
        setStep(2)
      } else {
        handlePlaceOrder()
      }
    } else {
      toast.error('Please fill all required fields')
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        userId: 'user123',
        items: cartItems.map(item => ({
          medicineId: item.medicineId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        prescriptionUrl: formData.prescription ? '/prescriptions/uploaded.jpg' : '',
        totalAmount: total,
        deliveryAddress: formData.address
      }

      await orderService.create(orderData)
      await cartService.clearCart()
      
      toast.success('Order placed successfully!')
      onComplete()
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1 ? 'Delivery Address' : 'Upload Prescription'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Street Address"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  required
                />
                <Input
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  required
                />
                <Input
                  label="State"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  required
                />
                <Input
                  label="Pincode"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                  required
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-warning/10 rounded-lg">
                  <div className="flex items-center">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning mr-2" />
                    <p className="text-sm text-warning-800">
                      Your order contains prescription medicines. Please upload a valid prescription.
                    </p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrescriptionUpload}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <ApperIcon name="Upload" className="w-12 h-12 text-surface-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {formData.prescription ? formData.prescription.name : 'Click to upload prescription'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, PDF
                    </p>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-primary">
              ₹{total.toFixed(2)}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              loading={loading}
              className="flex-1"
            >
              {step === 1 && hasPrescriptionItems
                ? 'Next'
                : 'Place Order'
              }
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CheckoutModal