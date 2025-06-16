import orderData from '../mockData/order.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class OrderService {
  async getAll() {
    await delay(300)
    return [...orderData]
  }

  async getById(id) {
    await delay(200)
    const order = orderData.find(item => item.Id === parseInt(id, 10))
    if (!order) {
      throw new Error('Order not found')
    }
    return { ...order }
  }

  async getPendingOrders() {
    await delay(300)
    return orderData.filter(order => 
      order.status === 'placed' || order.status === 'pending_verification'
    ).map(item => ({ ...item }))
  }

  async getUserOrders(userId) {
    await delay(300)
    return orderData.filter(order => order.userId === userId)
      .map(item => ({ ...item }))
  }

  async create(order) {
    await delay(400)
    const maxId = Math.max(...orderData.map(item => item.Id), 0)
    const newOrder = {
      ...order,
      Id: maxId + 1,
      status: 'placed',
      createdAt: new Date().toISOString()
    }
    orderData.push(newOrder)
    return { ...newOrder }
  }

  async updateStatus(id, status) {
    await delay(300)
    const index = orderData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Order not found')
    }
    orderData[index].status = status
    return { ...orderData[index] }
  }

  async update(id, data) {
    await delay(300)
    const index = orderData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Order not found')
    }
    orderData[index] = { ...orderData[index], ...data }
    return { ...orderData[index] }
  }

  async delete(id) {
    await delay(300)
    const index = orderData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Order not found')
    }
    const deleted = orderData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new OrderService()