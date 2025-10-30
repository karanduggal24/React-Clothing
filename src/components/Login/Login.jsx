import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/Slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { User, KeyRound } from 'lucide-react' // ✅ Import icons

function Login() {
  useEffect(() => {
    document.title = 'Clothing Store - Login'
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    if (username === 'admin' && password === 'admin123') {
      dispatch(login({ username, password }))
      navigate('/ProductForm')
    } else if (username && password) {
      dispatch(login({ username, password }))
      navigate('/')
    } else {
      setError('Invalid credentials. Use admin/admin123 for admin access')
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
          {/* Username field */}
          <div className="relative text-left" style={{ marginBottom: '20px' }}>
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded text-gray-800 text-base focus:border-gray-500 outline-none"
              style={{ padding: '12px 10px 12px 40px' }}
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded text-base font-medium hover:bg-gray-800 transition-colors"
            style={{ padding: '12px 20px', marginTop: '10px' }}
          >
            Login
          </button>
        </form>

        <div
          className="text-sm text-gray-600 border-t border-gray-200 leading-6"
          style={{ marginTop: '30px', paddingTop: '20px' }}
        >
          <p>Admin: admin / admin123</p>
          <p>User: any username / any password</p>
        </div>
      </div>
    </div>
  )
}

export default Login
