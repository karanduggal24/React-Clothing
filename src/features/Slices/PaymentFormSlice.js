import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: {
    name: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    address: ""
  },
  paymentInfo: {
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  },
  orderInfo: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    orderDate: null,
    orderId: null
  },
  isFormValid: false
}

export const PaymentFormSlice = createSlice({ 
    name: 'payment',
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
        updatePaymentInfo: (state, action) => {
            state.paymentInfo = { ...state.paymentInfo, ...action.payload };
        },
        setOrderInfo: (state, action) => {
            state.orderInfo = {
                items: action.payload.items,
                totalItems: action.payload.totalItems,
                totalPrice: action.payload.totalPrice,
                orderDate: new Date().toISOString(),
                orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
        },
        setFormValid: (state, action) => {
            state.isFormValid = action.payload;
        },
        resetPaymentForm: (state) => {
            return initialState;
        }
    }
})

export const { 
    updateUserInfo, 
    updatePaymentInfo, 
    setOrderInfo, 
    setFormValid, 
    resetPaymentForm 
} = PaymentFormSlice.actions;

// Selectors
export const selectUserInfo = (state) => state.payment.userInfo;
export const selectPaymentInfo = (state) => state.payment.paymentInfo;
export const selectOrderInfo = (state) => state.payment.orderInfo;
export const selectIsFormValid = (state) => state.payment.isFormValid;

export default PaymentFormSlice.reducer