import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import CartDrawer from '@/components/organisms/CartDrawer'

const CartIcon = ({ count = 0 }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDrawerOpen(true)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors"
      >
        <ApperIcon name="ShoppingCart" className="w-6 h-6" />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isDrawerOpen && (
          <CartDrawer onClose={() => setIsDrawerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default CartIcon