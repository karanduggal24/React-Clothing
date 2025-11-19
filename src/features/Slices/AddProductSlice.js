import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import SuperHero from '/src/assets/Superhero.jpg'
import { API_ENDPOINTS } from '../../config/api'

const API_URL = `${API_ENDPOINTS.products}/`

// Async thunk to fetch products from backend
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to add product to backend
export const addProductToBackend = createAsyncThunk(
    'products/addProductToBackend',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productData.name,
                    Category: productData.category,
                    Price: parseInt(productData.price),
                    Description: productData.description || 'No description',
                    Image: productData.img || '',
                    Quantity: parseInt(productData.stockQuantity)
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add product');
            }
            
            const data = await response.json();
            return {
                id: data.product_id.toString(),
                name: productData.name,
                price: productData.price,
                category: productData.category,
                img: productData.img,
                stockQuantity: productData.stockQuantity
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update product in backend
export const updateProductInBackend = createAsyncThunk(
    'products/updateProductInBackend',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}${productData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productData.name,
                    Category: productData.category,
                    Price: parseInt(productData.price),
                    Description: productData.description || 'No description',
                    Image: productData.img || '',
                    Quantity: parseInt(productData.stockQuantity)
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update product');
            }
            
            const data = await response.json();
            return {
                id: productData.id.toString(),
                name: productData.name,
                price: productData.price,
                category: productData.category,
                img: productData.img,
                stockQuantity: productData.stockQuantity
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to delete product from backend
export const deleteProductFromBackend = createAsyncThunk(
    'products/deleteProductFromBackend',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}${productId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete product');
            }
            
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch products with filters
export const fetchProductsWithFilters = createAsyncThunk(
    'products/fetchProductsWithFilters',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('min_price', filters.minPrice);
            if (filters.maxPrice) params.append('max_price', filters.maxPrice);
            if (filters.search) params.append('search', filters.search);
            if (filters.inStock !== undefined) params.append('in_stock', filters.inStock);
            
            const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Load products from sessionStorage if available
const loadProductsFromSession = () => {
    try {
        const savedProducts = sessionStorage.getItem('products');
        if (savedProducts) {
            return JSON.parse(savedProducts);
        }
    } catch (error) {
        console.error('Failed to load products from session:', error);
    }
    return [{ id:"1", name:'T-Shirt',price:299,category:"Men's Clothing", img:SuperHero, stockQuantity:0 }];
};

const initialState = {
    products: loadProductsFromSession(),
    loading: false,
    error: null
}

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
        },

        updateProductStock: (state, action) => {
            const { productId, quantity } = action.payload;
            const product = state.products.find(p => p.id === productId);
            if (product) {
                product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
            }
        },

        restoreProductStock: (state, action) => {
            const { productId, quantity } = action.payload;
            const product = state.products.find(p => p.id === productId);
            if (product) {
                product.stockQuantity += quantity;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const backendProducts = action.payload.map(product => ({
                    id: product.id.toString(),
                    name: product.name,
                    price: product.Price,
                    category: product.Category,
                    img: product.Image,
                    stockQuantity: product.Quantity
                }));
                
                const existingIds = new Set(state.products.map(p => p.id));
                const newProducts = backendProducts.filter(p => !existingIds.has(p.id));
                state.products = [...state.products, ...newProducts];
                
                // Save products to sessionStorage
                try {
                    sessionStorage.setItem('products', JSON.stringify(state.products));
                } catch (error) {
                    console.error('Failed to save products to session:', error);
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch products with filters
            .addCase(fetchProductsWithFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsWithFilters.fulfilled, (state, action) => {
                state.loading = false;
                const backendProducts = action.payload.map(product => ({
                    id: product.id.toString(),
                    name: product.name,
                    price: product.Price,
                    category: product.Category,
                    img: product.Image,
                    stockQuantity: product.Quantity
                }));
                state.products = backendProducts;
            })
            .addCase(fetchProductsWithFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add product to backend
            .addCase(addProductToBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductToBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProductToBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update product in backend
            .addCase(updateProductInBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductInBackend.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProductInBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete product from backend
            .addCase(deleteProductFromBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductFromBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p.id !== action.payload.toString());
            })
            .addCase(deleteProductFromBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
}
)

export const {addProduct, deleteProduct, updateProduct, updateProductStock, restoreProductStock} = AddProductSlice.actions;
export default AddProductSlice.reducer