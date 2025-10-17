import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/Slices/AddProductSlice'
import authReducer from '../features/Slices/authSlice'
import cartReducer from '../features/Slices/CartSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
})