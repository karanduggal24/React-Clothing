const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_BASE_URL = BASE_URL;

export const API_ENDPOINTS = {
  products: `${BASE_URL}/products`,
  cart: `${BASE_URL}/cart`,
  orders: `${BASE_URL}/orders`,
  auth: `${BASE_URL}/auth`,
  uploads: `${BASE_URL}/uploads`,
};

// Default headers
const defaultHeaders = (token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Core request handler
const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || `Request failed: ${response.status}`);
  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request(`${API_ENDPOINTS.auth}/login`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password, phone) =>
    request(`${API_ENDPOINTS.auth}/signup`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ name, email, password, phone }),
    }),

  getUsers: (token) =>
    request(`${API_ENDPOINTS.auth}/users`, {
      headers: defaultHeaders(token),
    }),

  updateRole: (userId, role, token) =>
    request(`${API_ENDPOINTS.auth}/users/${userId}/role?role=${role}`, {
      method: 'PATCH',
      headers: defaultHeaders(token),
    }),

  deleteUser: (userId, token) =>
    request(`${API_ENDPOINTS.auth}/users/${userId}`, {
      method: 'DELETE',
      headers: defaultHeaders(token),
    }),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${API_ENDPOINTS.products}/${query ? `?${query}` : ''}`);
  },

  getById: (id) =>
    request(`${API_ENDPOINTS.products}/${id}`),

  create: (data) =>
    request(`${API_ENDPOINTS.products}/`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`${API_ENDPOINTS.products}/${id}`, {
      method: 'PUT',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`${API_ENDPOINTS.products}/${id}`, { method: 'DELETE' }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request(`${API_ENDPOINTS.products}/upload-image`, {
      method: 'POST',
      body: formData, // No Content-Type header — browser sets multipart boundary
    });
  },

  reduceStock: (id, quantity) =>
    request(`${API_ENDPOINTS.products}/${id}/reduce-stock?quantity=${quantity}`, {
      method: 'PATCH',
    }),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  getByUser: (userId) =>
    request(`${API_ENDPOINTS.cart}/?user_id=${userId}`),

  add: (item) =>
    request(`${API_ENDPOINTS.cart}/`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(item),
    }),

  update: (cartItemId, quantity) =>
    request(`${API_ENDPOINTS.cart}/${cartItemId}`, {
      method: 'PUT',
      headers: defaultHeaders(),
      body: JSON.stringify({ quantity }),
    }),

  remove: (cartItemId) =>
    request(`${API_ENDPOINTS.cart}/${cartItemId}`, { method: 'DELETE' }),

  clearByUser: (userId) =>
    request(`${API_ENDPOINTS.cart}/user/${userId}`, { method: 'DELETE' }),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${API_ENDPOINTS.orders}/${query ? `?${query}` : ''}`);
  },

  getByEmail: (email) =>
    request(`${API_ENDPOINTS.orders}/?customer_email=${email}`),

  create: (data) =>
    request(`${API_ENDPOINTS.orders}/`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    }),

  update: (orderId, data) =>
    request(`${API_ENDPOINTS.orders}/${orderId}`, {
      method: 'PATCH',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (orderId) =>
    request(`${API_ENDPOINTS.orders}/${orderId}`, { method: 'DELETE' }),
};
