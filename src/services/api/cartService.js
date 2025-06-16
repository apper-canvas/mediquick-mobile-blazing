const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CartService {
  async getCart() {
    await delay(200)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    return [...cart]
  }

  async addToCart(item) {
    await delay(300)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = cart.findIndex(cartItem => cartItem.medicineId === item.medicineId)
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity
    } else {
      cart.push({ ...item })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    return [...cart]
  }

  async updateQuantity(medicineId, quantity) {
    await delay(200)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const itemIndex = cart.findIndex(item => item.medicineId === medicineId)
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1)
      } else {
        cart[itemIndex].quantity = quantity
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    return [...cart]
  }

  async removeFromCart(medicineId) {
    await delay(200)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updatedCart = cart.filter(item => item.medicineId !== medicineId)
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    return [...updatedCart]
  }

  async clearCart() {
    await delay(200)
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    return []
  }

  async getCartTotal() {
    await delay(100)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
}

export default new CartService()