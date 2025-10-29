import { createSlice } from '@reduxjs/toolkit'
import SuperHero from '/src/assets/Superhero.jpg'

const initialState = {products: [{ id:1, name:'T-Shirt',price:299,category:"Men's Clothing", img:SuperHero, stockQuantity:10 }]}

export const AddProductSlice = createSlice({
    name:'products',
    initialState,
    reducers:{
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },

        deleteProduct: (state, action) => {
        state.products = state.products.filter(products => products.id !== action.payload);
    },
    updateProduct: (state, action) => {
        const { id, name, price, category, img, stockQuantity } = action.payload;
        const existingProduct = state.products.find(product => product.id === id);
        if (existingProduct) {
            existingProduct.name = name;
            existingProduct.price = price;
            existingProduct.category = category;
            if (img) existingProduct.img = img;
            if (stockQuantity !== undefined) existingProduct.stockQuantity = stockQuantity;
        }
    }
}
}
)

export const {addProduct, deleteProduct, updateProduct} = AddProductSlice.actions;
export default AddProductSlice.reducer