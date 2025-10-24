import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // Array of cart items with product info and quantity
  totalItems: 0, // Total number of items in cart
  totalPrice: 0, // Total price of all items
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += 1
      } else {
        // If item doesn't exist, add it to cart
        state.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          category: product.category,
          img: product.img,
          quantity: 1
        })
      }
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.id !== productId)
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.id === productId)
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.id !== productId)
        } else {
          item.quantity = quantity
        }
        
        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    },

    incrementQuantity: (state, action) => {
      const productId = action.payload
      const item = state.items.find(item => item.id === productId)
      
      if (item) {
        item.quantity += 1
        state.totalItems += 1
        state.totalPrice += item.price
      }
    },

    decrementQuantity: (state, action) => {
      const productId = action.payload
      const item = state.items.find(item => item.id === productId)
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
          state.totalItems -= 1
          state.totalPrice -= item.price
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(item => item.id !== productId)
          state.totalItems -= 1
          state.totalPrice -= item.price
        }
      }
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart
} = cartSlice.actions

// Selectors for easy access to cart state
export const selectCartItems = (state) => state.cart.items
export const selectCartTotalItems = (state) => state.cart.totalItems
export const selectCartTotalPrice = (state) => state.cart.totalPrice
export const selectCartItemCount = (state) => state.cart.items.length
export const selectCartItemById = (productId) => (state) => 
  state.cart.items.find(item => item.id === productId)

export default cartSlice.reducer