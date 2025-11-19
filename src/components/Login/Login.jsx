import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/Slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { User, KeyRound } from 'lucide-react'
import { toast } from 'react-toastify'

function Login() {
  useEffect(() => {
    document.title = 'Clothing Store - Login'
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      // Dispatch login action with user data and token
      dispatch(login({ 
        user: data.user, 
        token: data.token 
      }))

      // Sync cart after login
      const { syncGuestCartToUser } = await import('../../features/Slices/CartSlice')
      dispatch(syncGuestCartToUser(data.user.email))

      toast.success(`Welcome back, ${data.user.name}!`)
      
      // Navigate based on role
      if (data.user.role === 'admin') {
        navigate('/ProductForm')
      } else {
        navigate('/')
      }
    } catch (error) {
      setError(error.message || 'Invalid email or password')
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-300 font-sans">
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
    <div className="flex justify-center items-center min-h-screen bg-gray-300 font-sans">
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

        {error && (
          <div
            className="bg-red-100 text-red-700 border border-red-300 rounded text-sm"
            style={{ padding: '10px 16px', marginBottom: '20px' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Email field */}
          <div className="relative text-left" style={{ marginBottom: '20px' }}>
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded text-gray-800 text-base focus:border-gray-500 outline-none"
              style={{ padding: '12px 10px 12px 40px' }}
              disabled={loading}
            />
          </div>

          {/* Password field */}
          <div className="relative text-left" style={{ marginBottom: '20px' }}>
            <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded text-gray-800 text-base focus:border-gray-500 outline-none"
              style={{ padding: '12px 10px 12px 40px' }}
              disabled={loading}
            />
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
