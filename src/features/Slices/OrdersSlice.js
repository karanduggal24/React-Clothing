import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ENDPOINTS } from '../../config/api'

const API_URL = API_ENDPOINTS.orders

// Async thunk to fetch orders from backend
export const fetchOrdersFromBackend = createAsyncThunk(
  'orders/fetchOrdersFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      // Add cache busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}?_t=${timestamp}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update order
export const updateOrderInBackend = createAsyncThunk(
  'orders/updateOrderInBackend',
  async ({ orderId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update order');
      }
      
      return { orderId, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete order
export const deleteOrderFromBackend = createAsyncThunk(
  'orders/deleteOrderFromBackend',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete order');
      }
      
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  totalOrders: 0,
  loading: false,
  error: null
}

// Helper function to generate order ID based on date + product IDs + quantities + random numbers
const generateOrderId = (orderDate, items) => {
  // Generate 2 random numbers (2-digit each)
  const randomNum1 = Math.floor(Math.random() * 90) + 10; // Random number between 10-99
  const randomNum2 = Math.floor(Math.random() * 90) + 10; // Random number between 10-99
  
  if (!items || items.length === 0) {
    return `ORD-${Date.now()}-${randomNum1}${randomNum2}`
  }
  
  const date = new Date(orderDate)
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD format
  
  // Create a string from product IDs and quantities
  const itemsStr = items
    .map(item => `${item.id}x${item.quantity}`)
    .join('-')
    .substring(0, 50) // Limit length to keep ID manageable
  
  return `ORD-${dateStr}-${itemsStr}-${randomNum1}${randomNum2}`
}

export const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const orderDate = action.payload.orderDate || new Date().toISOString()
      const items = action.payload.orderInfo?.items || []
      
      const newOrder = {
        ...action.payload,
        id: action.payload.orderId || generateOrderId(orderDate, items),
        status: 'Confirmed',
        shippingId: '',
        shippingCompany: '',
        orderDate
      }
      state.orders.push(newOrder)
      state.totalOrders = state.orders.length
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.status = status
      }
    },
    updateShippingId: (state, action) => {
      const { orderId, shippingId } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.shippingId = shippingId
      }
    },
    updateShippingCompany: (state, action) => {
      const { orderId, shippingCompany } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.shippingCompany = shippingCompany
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload)
      state.totalOrders = state.orders.length
    },
    clearOrders: (state) => {
      state.orders = []
      state.totalOrders = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrdersFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend orders to frontend format
        state.orders = action.payload.map(order => ({
          id: order.order_id,
          orderId: order.order_id,
          userInfo: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            address: order.address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            country: order.country
          },
          orderInfo: {
            items: order.order_items,
            totalItems: order.total_items,
            totalPrice: order.total_price
          },
          status: order.status,
          shippingId: order.shipping_id || '',
          shippingCompany: order.shipping_company || '',
          orderDate: order.order_date
        }));
        state.totalOrders = state.orders.length;
      })
      .addCase(fetchOrdersFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order
      .addCase(updateOrderInBackend.fulfilled, (state, action) => {
        const { orderId, updates } = action.payload;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          if (updates.status) order.status = updates.status;
          if (updates.shipping_id) order.shippingId = updates.shipping_id;
          if (updates.shipping_company) order.shippingCompany = updates.shipping_company;
        }
      })
      // Delete order
      .addCase(deleteOrderFromBackend.fulfilled, (state, action) => {
        const orderId = action.payload;
        state.orders = state.orders.filter(o => o.id !== orderId);
        state.totalOrders = state.orders.length;
      });
  }
})

export const { 
  addOrder, 
  updateOrderStatus, 
  updateShippingId,
  updateShippingCompany,
  deleteOrder, 
  clearOrders 
} = OrdersSlice.actions

// Selectors
export const selectAllOrders = (state) => state.orders.orders
export const selectTotalOrders = (state) => state.orders.totalOrders
export const selectOrderById = (state, orderId) => 
  state.orders.orders.find(order => order.id === orderId)

export default OrdersSlice.reducer