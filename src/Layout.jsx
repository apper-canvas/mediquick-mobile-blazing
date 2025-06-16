import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'
import SearchBar from '@/components/molecules/SearchBar'
import CartIcon from '@/components/molecules/CartIcon'

const Layout = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    // Update cart count based on localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const total = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    }

    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  const filteredRoutes = routeArray.filter(route => {
    if (route.id === 'admin') return isAdmin
    return true
  })

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/home" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Cross" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-gray-900">
                  MediQuick Pro
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {filteredRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <CartIcon count={cartCount} />
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAdmin
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:text-accent hover:bg-surface-50'
                }`}
              >
                {isAdmin ? 'Admin' : 'User'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden bg-white border-b border-surface-200 px-4 py-3">
        <SearchBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-surface-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {filteredRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout