// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  cart: `${API_BASE_URL}/cart`,
  orders: `${API_BASE_URL}/orders`,
  auth: `${API_BASE_URL}/auth`,
  uploads: `${API_BASE_URL}/uploads`,
};
