import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/Slices/AddProductSlice'
import authReducer from '../features/Slices/authSlice'
import cartReducer from '../features/Slices/CartSlice'
import filterReducer from '../features/Slices/filterSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    filters: filterReducer,
  },
})