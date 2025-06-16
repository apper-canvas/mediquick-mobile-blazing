import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { cartService } from '@/services'

const MedicineCard = ({ medicine, onAddToCart }) => {
  const {
    Id,
    name,
    genericName,
    brand,
    price,
    stock,
    requiresPrescription,
    imageUrl,
    description
  } = medicine

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        medicineId: Id.toString(),
        name,
        quantity: 1,
        price,
        requiresPrescription
      }
      
      await cartService.addToCart(cartItem)
      toast.success(`${name} added to cart`)
      
      if (onAddToCart) {
        onAddToCart(cartItem)
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const getStockStatus = () => {
    if (stock === 0) return { text: 'Out of Stock', color: 'error' }
    if (stock < 10) return { text: 'Low Stock', color: 'warning' }
    return { text: 'In Stock', color: 'success' }
  }

  const stockStatus = getStockStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative mb-3">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-32 object-cover rounded-lg bg-surface-100"
        />
        {requiresPrescription && (
          <div className="absolute top-2 right-2">
            <Badge variant="prescription" icon="FileText" size="sm">
              Rx
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-600">{genericName}</p>
          <p className="text-xs text-gray-500">{brand}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{price.toFixed(2)}
            </span>
          </div>
          <Badge variant={stockStatus.color} size="sm">
            {stockStatus.text}
          </Badge>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={stock === 0}
            icon="Plus"
            className="w-full"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default MedicineCard