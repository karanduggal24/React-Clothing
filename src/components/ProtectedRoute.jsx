import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth)

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If admin access required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <p>Please login with admin credentials.</p>
      </div>
    )
  }

  // If authenticated and has required permissions
  return children
}

export default ProtectedRoute
