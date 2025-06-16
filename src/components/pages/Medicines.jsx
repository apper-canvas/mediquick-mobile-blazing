import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import MedicineCard from '@/components/molecules/MedicineCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { medicineService } from '@/services'

const Medicines = () => {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const categories = [
    'All',
    'Pain Relief',
    'Antibiotics',
    'Vitamins',
    'Digestive Health',
    'Allergy Relief',
    'Heart Health',
    'Diabetes',
    'Respiratory',
    'Cough & Cold'
  ]

  useEffect(() => {
    // Get initial search/category from URL params
    const params = new URLSearchParams(location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    
    if (searchParam) {
      setSearchQuery(searchParam)
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    
    loadMedicines()
  }, [location.search])

  useEffect(() => {
    loadMedicines()
  }, [selectedCategory, searchQuery])

  const loadMedicines = async () => {
    setLoading(true)
    setError(null)
    try {
      let result = []
      
      if (searchQuery.trim()) {
        result = await medicineService.searchMedicines(searchQuery)
      } else if (selectedCategory !== 'All') {
        result = await medicineService.getByCategory(selectedCategory)
      } else {
        result = await medicineService.getAll()
      }
      
      setMedicines(result)
    } catch (err) {
      setError(err.message || 'Failed to load medicines')
      toast.error('Failed to load medicines')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      setSelectedCategory('All')
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchQuery('')
  }

  const getDisplayTitle = () => {
    if (searchQuery.trim()) {
      return `Search results for "${searchQuery}"`
    }
    return selectedCategory === 'All' ? 'All Medicines' : selectedCategory
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          {getDisplayTitle()}
        </h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by medicine name, brand, or generic name..."
            />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-surface-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          {loading && <SkeletonLoader count={8} type="card" />}

          {error && (
            <ErrorState
              message={error}
              onRetry={loadMedicines}
            />
          )}

          {!loading && !error && medicines.length === 0 && (
            <EmptyState
              title="No medicines found"
              description={
                searchQuery.trim()
                  ? `No medicines found for "${searchQuery}". Try searching with different keywords.`
                  : selectedCategory !== 'All'
                  ? `No medicines found in ${selectedCategory} category.`
                  : 'No medicines available at the moment.'
              }
              icon="Search"
            />
          )}

          {!loading && !error && medicines.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {medicines.map((medicine, index) => (
                <motion.div
                  key={medicine.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MedicineCard medicine={medicine} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Medicines