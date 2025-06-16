import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import { motion } from 'framer-motion'

const SearchBar = ({ onSearch, placeholder = "Search medicines..." }) => {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        navigate(`/medicines?search=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <ApperIcon
          name="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
            focused
              ? 'border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-surface-300 hover:border-surface-400'
          } bg-white`}
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </form>
  )
}

export default SearchBar