import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/Slices/authSlice'
import { syncGuestCartToUser } from '../../features/Slices/CartSlice'
import { useNavigate } from 'react-router-dom'
import { User, KeyRound } from 'lucide-react'
import { toast } from 'react-toastify'
import { authApi } from '../../config/api'
import GoogleButton from '../ui/GoogleButton'

function Login() {
  useEffect(() => {
    document.title = 'Clothing Store - Login'
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Changed to an object to track individual field errors alongside general API errors
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Google OAuth login handler
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    window.location.href = `${API_URL}/auth/google/login`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset errors before validation
    let validationErrors = { email: '', password: '', general: '' }
    let hasError = false

    if (!email.trim()) {
      validationErrors.email = 'Email is required'
      hasError = true
    }
    
    if (!password.trim()) {
      validationErrors.password = 'Password is required'
      hasError = true
    }

    if (hasError) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const data = await authApi.login(email.trim(), password)

      dispatch(login({ user: data.user, token: data.token }))
      dispatch(syncGuestCartToUser(data.user.email))

      toast.success(`Welcome back, ${data.user.name}!`)

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Invalid email or password'
      }))
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Clear specific field errors when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }))
    }
  }

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
        <div
          className="bg-white rounded-lg shadow-md w-full max-w-sm text-center"
          style={{ padding: '40px' }}
        >
          <h2
            className="text-2xl text-gray-800 font-semibold"
            style={{ marginBottom: '16px' }}
          >
            Already logged in
          </h2>
          <p className="text-gray-600 text-base">You are already authenticated.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
      <div
        className="bg-white rounded-lg shadow-md w-full max-w-sm text-center relative"
        style={{ padding: '40px' }}
      >
        <h2
          className="text-2xl text-gray-800 pb-2 border-b border-gray-800 inline-block font-semibold"
          style={{ marginBottom: '32px' }}
        >
          Login
        </h2>

        {/* General API error banner */}
        {errors.general && (
          <div
            className="bg-red-100 text-red-700 border border-red-300 rounded text-sm text-left"
            style={{ padding: '10px 16px', marginBottom: '20px' }}
          >
            {errors.general}
          </div>
        )}

        {/* Google Login Button */}
        <GoogleButton 
          onClick={handleGoogleLogin}
          text="Sign in with Google"
          disabled={loading}
        />

        {/* Divider */}
        <div className="flex items-center" style={{ margin: '24px 0' }}>
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Email field */}
          <div className="relative text-left" style={{ marginBottom: '20px' }}>
            <User 
              className={`absolute left-3 top-3 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-500'}`} 
              size={20} 
            />
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter email"
              className={`w-full border rounded text-gray-800 text-base outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-gray-500'
              }`}
              style={{ padding: '12px 10px 12px 40px' }}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="relative text-left" style={{ marginBottom: '20px' }}>
            <KeyRound 
              className={`absolute left-3 top-3 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-500'}`} 
              size={20} 
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              className={`w-full border rounded text-gray-800 text-base outline-none transition-colors ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-gray-500'
              }`}
              style={{ padding: '12px 10px 12px 40px' }}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded text-base font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '12px 20px', marginTop: '10px' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center" style={{ marginTop: '20px' }}>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-black font-medium hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login