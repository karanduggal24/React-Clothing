import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload
      if (username === 'admin'||'Admin'||'admin '||'Admin '||"ADMIN" && password === 'admin123') {
        state.user = { username, role: 'admin' }
        state.isAuthenticated = true
        state.isAdmin = true
      } else {
        state.user = { username, role: 'user' }
        state.isAuthenticated = true
        state.isAdmin = false
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
