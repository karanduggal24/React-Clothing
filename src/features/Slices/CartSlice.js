import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const API_URL = 'http://127.0.0.1:8000/cart';

// Helper to get user ID (use logged-in user email or generate guest session ID)
const getUserId = (getState) => {
  // Try to get logged-in user first
  if (getState) {
    const state = getState();
    if (state.auth?.isAuthenticated && state.auth?.user?.email) {
      return state.auth.user.email;
    }
  }
  
  // Fallback to guest session ID
  let userId = sessionStorage.getItem('cart_user_id');
  if (!userId) {
    userId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('cart_user_id', userId);
  }
  return userId;
};

// Async thunk to fetch cart from backend
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchCartFromBackend',
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getUserId(getState);
      const response = await fetch(`${API_URL}/?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cart fetch error:', error);
      // Return empty array on error to prevent crash
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add item to cart in backend
export const addToCartBackend = createAsyncThunk(
  'cart/addToCartBackend',
  async (product, { rejectWithValue, getState }) => {
    try {
      const userId = getUserId(getState);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: parseInt(product.id),
          product_name: product.name,
          product_price: parseInt(product.price),
          product_category: product.category,
          product_image: product.img || '',
          quantity: 1
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add to cart');
      }
      
      const data = await response.json();
      return { ...data, product };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update cart item quantity
export const updateCartItemBackend = createAsyncThunk(
  'cart/updateCartItemBackend',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update cart');
      }
      
      const data = await response.json();
      return { cartItemId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove item from cart
export const removeFromCartBackend = createAsyncThunk(
  'cart/removeFromCartBackend',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${cartItemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to remove from cart');
      }
      
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to clear cart
export const clearCartBackend = createAsyncThunk(
  'cart/clearCartBackend',
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getUserId(getState);
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear cart');
      }
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to sync guest cart to user cart on login
export const syncGuestCartToUser = createAsyncThunk(
  'cart/syncGuestCartToUser',
  async (userEmail, { rejectWithValue, getState }) => {
    try {
      const guestId = sessionStorage.getItem('cart_user_id');
      
      // If no guest cart, just fetch user cart
      if (!guestId) {
        const response = await fetch(`${API_URL}/?user_id=${userEmail}`);
        if (!response.ok) throw new Error('Failed to fetch user cart');
        return await response.json();
      }
      
      // Fetch guest cart items
      const guestResponse = await fetch(`${API_URL}/?user_id=${guestId}`);
      if (!guestResponse.ok) throw new Error('Failed to fetch guest cart');
      const guestItems = await guestResponse.json();
      
      // If guest cart is empty, just fetch user cart
      if (guestItems.length === 0) {
        const response = await fetch(`${API_URL}/?user_id=${userEmail}`);
        if (!response.ok) throw new Error('Failed to fetch user cart');
        return await response.json();
      }
      
      // Migrate guest cart items to user cart
      for (const item of guestItems) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userEmail,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            product_category: item.product_category,
            product_image: item.product_image,
            quantity: item.quantity
          })
        });
      }
      
      // Clear guest cart
      await fetch(`${API_URL}/user/${guestId}`, { method: 'DELETE' });
      sessionStorage.removeItem('cart_user_id');
      
      // Fetch updated user cart
      const response = await fetch(`${API_URL}/?user_id=${userEmail}`);
      if (!response.ok) throw new Error('Failed to fetch user cart');
      return await response.json();
    } catch (error) {
      console.error('Cart sync error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [], // Array of cart items with product info and quantity
  totalItems: 0, // Total number of items in cart
  totalPrice: 0, // Total price of all items
  loading: false,
  error: null,
  synced: false, // Track if cart is synced with backend
};

// Helper to recalculate totals
const recalculateTotals = (state) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      // Check if we can add more of this item
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stockQuantity) {
          toast.warning(`${product.name} reached stock limit!`, {
            autoClose: 2000,
          });
          return;
        }
        existingItem.quantity += 1;
        toast.info(`Increased ${product.name} quantity!`, { autoClose: 2000 });
      } else {
        // Check if product has stock available
        if (product.stockQuantity <= 0) {
          toast.error(`${product.name} is out of stock!`, { autoClose: 2000 });
          return;
        }
        // If item doesn't exist and has stock, add it to cart
        state.items.push({
          id: product.id,
          cartItemId: null, // Will be set when synced with backend
          name: product.name,
          price: Number(product.price),
          category: product.category,
          img: product.img,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        });
        toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
      }

      recalculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item) {
        state.items = state.items.filter((item) => item.id !== productId);
        toast.error(`${item.name} removed from cart`, { autoClose: 2000 });
      }
      recalculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        recalculateTotals(state);
      }
    },

    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item && item.quantity < item.stockQuantity) {
        toast.info(`Increased ${item.name} quantity!`, { autoClose: 2000 });
        item.quantity += 1;
        state.totalItems += 1;
        state.totalPrice += item.price;
      } else if (item && item.quantity >= item.stockQuantity) {
        toast.warning(`${item.name} reached stock limit!`, { autoClose: 2000 });
      }
    },

    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      toast.error(`Decreased ${item.name} quantity!`, { autoClose: 2000 });

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalItems -= 1;
          state.totalPrice -= item.price;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter((item) => item.id !== productId);
          state.totalItems -= 1;
          state.totalPrice -= item.price;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.synced = false;
      toast.info("Cart cleared", { autoClose: 2000 });
    },

    removeOutOfStockItems: (state, action) => {
      const products = action.payload;
      const itemsToRemove = [];

      state.items.forEach((item) => {
        const currentProduct = products.find((p) => p.id === item.id);
        if (!currentProduct || currentProduct.stockQuantity <= 0) {
          itemsToRemove.push(item);
        } else {
          item.stockQuantity = currentProduct.stockQuantity;
          if (item.quantity > currentProduct.stockQuantity) {
            item.quantity = currentProduct.stockQuantity;
          }
        }
      });

      itemsToRemove.forEach((item) => {
        state.items = state.items.filter((cartItem) => cartItem.id !== item.id);
        toast.error(`${item.name} removed from cart - Out of stock`, {
          autoClose: 3000,
        });
      });

      recalculateTotals(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart from backend
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.synced = true;
        // Map backend cart items to frontend format
        state.items = action.payload.map(item => ({
          id: item.product_id.toString(),
          cartItemId: item.id,
          name: item.product_name,
          price: item.product_price,
          category: item.product_category,
          img: item.product_image,
          quantity: item.quantity,
          stockQuantity: 999 // Default, should be updated from products
        }));
        recalculateTotals(state);
      })
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.synced = true; // Mark as synced even on error to prevent infinite retries
        console.error('Failed to fetch cart from backend:', action.payload);
      })
      // Add to cart backend
      .addCase(addToCartBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.loading = false;
        const { product, action: actionType, cart_item_id, quantity } = action.payload;
        
        if (actionType === 'added') {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.cartItemId = cart_item_id;
            existingItem.quantity = quantity;
          } else {
            state.items.push({
              id: product.id,
              cartItemId: cart_item_id,
              name: product.name,
              price: Number(product.price),
              category: product.category,
              img: product.img,
              quantity: quantity,
              stockQuantity: product.stockQuantity,
            });
          }
          // toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
        } else if (actionType === 'updated') {
          const item = state.items.find(item => item.id === product.id);
          if (item) {
            item.quantity = quantity;
            item.cartItemId = cart_item_id;
          }
          // toast.info(`${product.name} quantity updated!`, { autoClose: 2000 });
        }
        recalculateTotals(state);
      })
      .addCase(addToCartBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Failed to add to cart: ${action.payload}`);
      })
      // Update cart item backend
      .addCase(updateCartItemBackend.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find(item => item.cartItemId === cartItemId);
        if (item) {
          item.quantity = quantity;
          recalculateTotals(state);
        }
      })
      // Remove from cart backend
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        const cartItemId = action.payload;
        const item = state.items.find(item => item.cartItemId === cartItemId);
        if (item) {
          toast.error(`${item.name} removed from cart`, { autoClose: 2000 });
          state.items = state.items.filter(item => item.cartItemId !== cartItemId);
          recalculateTotals(state);
        }
      })
      // Clear cart backend
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        toast.info("Cart cleared", { autoClose: 2000 });
      })
      // Sync guest cart to user cart
      .addCase(syncGuestCartToUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncGuestCartToUser.fulfilled, (state, action) => {
        state.loading = false;
        state.synced = true;
        // Map backend cart items to frontend format
        state.items = action.payload.map(item => ({
          id: item.product_id.toString(),
          cartItemId: item.id,
          name: item.product_name,
          price: item.product_price,
          category: item.product_category,
          img: item.product_image,
          quantity: item.quantity,
          stockQuantity: 999 // Default, should be updated from products
        }));
        recalculateTotals(state);
        if (state.items.length > 0) {
          toast.success(`Cart synced! ${state.items.length} items loaded`, { autoClose: 2000 });
        }
      })
      .addCase(syncGuestCartToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to sync cart:', action.payload);
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  removeOutOfStockItems,
} = cartSlice.actions;

// Async thunks are already exported above with 'export const'
// No need to re-export them here

// Selectors for easy access to cart state
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartItemById = (productId) => (state) =>
  state.cart.items.find((item) => item.id === productId);

export default cartSlice.reducer;
