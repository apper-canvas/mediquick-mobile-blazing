import Home from '@/components/pages/Home'
import Medicines from '@/components/pages/Medicines'
import Orders from '@/components/pages/Orders'
import Admin from '@/components/pages/Admin'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  medicines: {
    id: 'medicines',
    label: 'Medicines',
    path: '/medicines',
    icon: 'Pill',
    component: Medicines
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'ShoppingBag',
    component: Orders
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: 'Shield',
    component: Admin
  }
}

export const routeArray = Object.values(routes)