import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const initialState = {
  items: [], // Array of cart items with product info and quantity
  totalItems: 0, // Total number of items in cart
  totalPrice: 0, // Total price of all items
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
          // Can't add more - at stock limit
          return;
        }
        existingItem.quantity += 1;

        toast.info(`Increased ${product.name} quantity!`, { autoClose: 2000 });
      } else {
        // Check if product has stock available
        if (product.stockQuantity <= 0) {
          toast.error(`${product.name} is out of stock!`, { autoClose: 2000 });
          // Can't add - out of stock

          return;
        }
        // If item doesn't exist and has stock, add it to cart
        state.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          category: product.category,
          img: product.img,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        });
        toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
      }

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      //  toast.error(`${item.name} removed from cart`, { autoClose: 2000 });
      if (item) {
        state.items = state.items.filter((item) => item.id !== productId);
        toast.error(`${item.name} removed from cart`, { autoClose: 2000 });
      }

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter((item) => item.id !== productId);
        } else {
          item.quantity = quantity;
        }

        // Update totals
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
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
      toast.info("Cart cleared", { autoClose: 2000 });
    },

    removeOutOfStockItems: (state, action) => {
      const products = action.payload; // Array of all products with current stock
      const itemsToRemove = [];

      state.items.forEach((item) => {
        const currentProduct = products.find((p) => p.id === item.id);
        if (!currentProduct || currentProduct.stockQuantity <= 0) {
          itemsToRemove.push(item);
        } else {
          // Update stock quantity in cart item
          item.stockQuantity = currentProduct.stockQuantity;
          // If cart quantity exceeds available stock, adjust it
          if (item.quantity > currentProduct.stockQuantity) {
            item.quantity = currentProduct.stockQuantity;
          }
        }
      });

      // Remove out of stock items
      itemsToRemove.forEach((item) => {
        state.items = state.items.filter((cartItem) => cartItem.id !== item.id);
        toast.error(`${item.name} removed from cart - Out of stock`, {
          autoClose: 3000,
        });
      });

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
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

// Selectors for easy access to cart state
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartItemById = (productId) => (state) =>
  state.cart.items.find((item) => item.id === productId);

export default cartSlice.reducer;
