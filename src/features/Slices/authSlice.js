import { createSlice } from '@reduxjs/toolkit'

// Load auth state from localStorage
const loadAuthState = () => {
  try {
    const savedAuth = localStorage.getItem('authState')
    return savedAuth ? JSON.parse(savedAuth) : {
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false
    }
  } catch {
    return {
      user: null,
      token: null,
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
      const { user, token } = action.payload
      
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isAdmin = user.role === 'admin'
      
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isAdmin = false
      
      // Clear from localStorage
      localStorage.removeItem('authState')
      // Clear guest cart session
      sessionStorage.removeItem('cart_user_id')
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
