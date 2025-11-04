import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  totalOrders: 0
}

// Helper function to generate order ID based on date + product IDs + quantities + random numbers
const generateOrderId = (orderDate, items) => {
  // Generate 2 random numbers (2-digit each)
  const randomNum1 = Math.floor(Math.random() * 90) + 10; // Random number between 10-99
  const randomNum2 = Math.floor(Math.random() * 90) + 10; // Random number between 10-99
  
  if (!items || items.length === 0) {
    return `ORD-${Date.now()}-${randomNum1}${randomNum2}`
  }
  
  const date = new Date(orderDate)
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD format
  
  // Create a string from product IDs and quantities
  const itemsStr = items
    .map(item => `${item.id}x${item.quantity}`)
    .join('-')
    .substring(0, 50) // Limit length to keep ID manageable
  
  return `ORD-${dateStr}-${itemsStr}-${randomNum1}${randomNum2}`
}

export const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const orderDate = action.payload.orderDate || new Date().toISOString()
      const items = action.payload.orderInfo?.items || []
      
      const newOrder = {
        ...action.payload,
        id: action.payload.orderId || generateOrderId(orderDate, items),
        status: 'Confirmed',
        shippingId: '',
        shippingCompany: '',
        orderDate
      }
      state.orders.push(newOrder)
      state.totalOrders = state.orders.length
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.status = status
      }
    },
    updateShippingId: (state, action) => {
      const { orderId, shippingId } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.shippingId = shippingId
      }
    },
    updateShippingCompany: (state, action) => {
      const { orderId, shippingCompany } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.shippingCompany = shippingCompany
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload)
      state.totalOrders = state.orders.length
    },
    clearOrders: (state) => {
      state.orders = []
      state.totalOrders = 0
    }
  }
})

export const { 
  addOrder, 
  updateOrderStatus, 
  updateShippingId,
  updateShippingCompany,
  deleteOrder, 
  clearOrders 
} = OrdersSlice.actions

// Selectors
export const selectAllOrders = (state) => state.orders.orders
export const selectTotalOrders = (state) => state.orders.totalOrders
export const selectOrderById = (state, orderId) => 
  state.orders.orders.find(order => order.id === orderId)

export default OrdersSlice.reducer