import { createSlice } from '@reduxjs/toolkit'

const initialState = {products: [{ id:1, name:'T-Shirt',price:299,category:'Men', img:""}]}

export const AddProductSlice = createSlice({
    name:'products',
    initialState,
    reducers:{
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },

        deleteProduct: (state, action) => {
        state.products = state.products.filter(products => products.id !== action.payload);
    }
    },
    
})

export const {addProduct,deleteProduct} = AddProductSlice.actions;
export default AddProductSlice.reducer