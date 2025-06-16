import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import MedicineCard from '@/components/molecules/MedicineCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { medicineService } from '@/services'

const Home = () => {
  const [featuredMedicines, setFeaturedMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const categories = [
    { name: 'Pain Relief', icon: 'Heart', color: 'bg-red-100 text-red-600' },
    { name: 'Antibiotics', icon: 'Shield', color: 'bg-blue-100 text-blue-600' },
    { name: 'Vitamins', icon: 'Zap', color: 'bg-green-100 text-green-600' },
    { name: 'Digestive Health', icon: 'Activity', color: 'bg-purple-100 text-purple-600' },
    { name: 'Allergy Relief', icon: 'Flower', color: 'bg-pink-100 text-pink-600' },
    { name: 'Heart Health', icon: 'HeartHandshake', color: 'bg-orange-100 text-orange-600' }
  ]

  useEffect(() => {
    loadFeaturedMedicines()
  }, [])

  const loadFeaturedMedicines = async () => {
    setLoading(true)
    setError(null)
    try {
      const medicines = await medicineService.getFeatured()
      setFeaturedMedicines(medicines)
    } catch (err) {
      setError(err.message || 'Failed to load featured medicines')
      toast.error('Failed to load featured medicines')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    navigate(`/medicines?category=${encodeURIComponent(category)}`)
  }

  const handleUploadPrescription = () => {
    toast.info('Prescription upload feature will be available in checkout')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 text-white"
      >
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Your Trusted Medical Store
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Order medicines online with prescription verification and fast delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/medicines')}
              icon="Search"
            >
              Browse Medicines
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleUploadPrescription}
              icon="Upload"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Upload Prescription
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.name)}
              className="p-4 rounded-lg border-2 border-surface-200 hover:border-primary transition-colors bg-white"
            >
              <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3`}>
                <ApperIcon name={category.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">
                {category.name}
              </h3>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Medicines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Featured Medicines
          </h2>
          <Button
            variant="outline"
            onClick={() => navigate('/medicines')}
            icon="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>

        {loading && <SkeletonLoader count={6} type="card" />}

        {error && (
          <ErrorState
            message={error}
            onRetry={loadFeaturedMedicines}
          />
        )}

        {!loading && !error && featuredMedicines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MedicineCard medicine={medicine} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-white rounded-lg border border-surface-200">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Shield" className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verified Medicines</h3>
          <p className="text-sm text-gray-600">All medicines are verified and approved by licensed pharmacists</p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg border border-surface-200">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Clock" className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-sm text-gray-600">Get your medicines delivered within 24 hours in most areas</p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg border border-surface-200">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Lock" className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
          <p className="text-sm text-gray-600">Your payment information is secure with 256-bit encryption</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Home