import { createSlice } from '@reduxjs/toolkit'

// Load auth state from localStorage
const loadAuthState = () => {
  try {
    const savedAuth = localStorage.getItem('authState')
    return savedAuth ? JSON.parse(savedAuth) : {
      user: null,
      isAuthenticated: false,
      isAdmin: false
    }
  } catch {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false
    }
  }
}

const initialState = loadAuthState()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload
      const normalizedUsername = username.trim().toLowerCase()
      
      if (normalizedUsername === 'admin' && password === 'admin123') {
        state.user = { username, role: 'admin' }
        state.isAuthenticated = true
        state.isAdmin = true
      } else {
        state.user = { username, role: 'user' }
        state.isAuthenticated = true
        state.isAdmin = false
      }
      
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }))
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      
      // Clear from localStorage
      localStorage.removeItem('authState')
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
