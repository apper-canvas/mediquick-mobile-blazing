import medicineData from '../mockData/medicine.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MedicineService {
  async getAll() {
    await delay(300)
    return [...medicineData]
  }

  async getById(id) {
    await delay(200)
    const medicine = medicineData.find(item => item.Id === parseInt(id, 10))
    if (!medicine) {
      throw new Error('Medicine not found')
    }
    return { ...medicine }
  }

  async searchMedicines(query) {
    await delay(300)
    if (!query) return [...medicineData]
    
    const lowercaseQuery = query.toLowerCase()
    return medicineData.filter(medicine =>
      medicine.name.toLowerCase().includes(lowercaseQuery) ||
      medicine.genericName.toLowerCase().includes(lowercaseQuery) ||
      medicine.brand.toLowerCase().includes(lowercaseQuery)
    )
  }

  async getByCategory(category) {
    await delay(300)
    if (!category) return [...medicineData]
    
    return medicineData.filter(medicine =>
      medicine.category.toLowerCase() === category.toLowerCase()
    )
  }

  async getFeatured() {
    await delay(200)
    return medicineData.slice(0, 6).map(item => ({ ...item }))
  }

  async updateStock(id, newStock) {
    await delay(200)
    const index = medicineData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medicine not found')
    }
    medicineData[index].stock = newStock
    return { ...medicineData[index] }
  }

  async create(medicine) {
    await delay(300)
    const maxId = Math.max(...medicineData.map(item => item.Id), 0)
    const newMedicine = {
      ...medicine,
      Id: maxId + 1
    }
    medicineData.push(newMedicine)
    return { ...newMedicine }
  }

  async update(id, data) {
    await delay(300)
    const index = medicineData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medicine not found')
    }
    medicineData[index] = { ...medicineData[index], ...data }
    return { ...medicineData[index] }
  }

  async delete(id) {
    await delay(300)
    const index = medicineData.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Medicine not found')
    }
    const deleted = medicineData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new MedicineService()