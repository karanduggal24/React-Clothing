import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/Slices/AddProductSlice'
import authReducer from '../features/Slices/authSlice'
import cartReducer from '../features/Slices/CartSlice'
import filterReducer from '../features/Slices/filterSlice'
import searchReducer from '../features/Slices/SearchSlice'
import paymentReducer from '../features/Slices/PaymentFormSlice'
import ordersReducer from '../features/Slices/OrdersSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    filters: filterReducer,
    search: searchReducer,
    payment: paymentReducer,
    orders: ordersReducer,
  },
})