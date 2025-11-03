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

        setFormValid: (state, action) => {
            state.isFormValid = action.payload;
        },
        resetPaymentForm: () => {
            return initialState;
        }
    }
})

export const { 
    updateUserInfo, 
    updatePaymentInfo, 
    setFormValid, 
    resetPaymentForm 
} = PaymentFormSlice.actions;

// Selectors
export const selectUserInfo = (state) => state.payment.userInfo;
export const selectPaymentInfo = (state) => state.payment.paymentInfo;
export const selectIsFormValid = (state) => state.payment.isFormValid;

export default PaymentFormSlice.reducer