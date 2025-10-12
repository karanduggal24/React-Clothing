import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/Slices/authSlice'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

function Login() {
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

    // Check credentials before dispatching
    if (username === 'admin' && password === 'admin123') {
      dispatch(login({ username, password }))
      navigate('/ProductForm')
    } else if (username && password) {
      // Allow any other credentials as regular user
      dispatch(login({ username, password }))
      navigate('/')
    } else {
      setError('Invalid credentials. Use admin/admin123 for admin access')
    }
  }

  if (isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.alreadyLoggedIn}>
          <h2>Already logged in</h2>
          <p>You are already authenticated.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Login</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username:
            </label>
            <br></br>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <br></br>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={styles.input}
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
        
        <div className={styles.credentialsInfo}>
          <p>Admin: admin / admin123</p>
          <p>User: any username / any password</p>
        </div>
      </div>
    </div>
  )
}

export default Login
