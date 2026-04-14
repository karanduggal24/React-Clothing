import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { ShieldAlert, Home, LogIn } from 'lucide-react'

function ProtectedRoute({ children, requireAdmin = false, requireUser = false }) {
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Validate user role from backend
  const userRole = user?.role

  // If admin access required but user is not admin
  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ padding: '20px' }}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border-2 border-red-200" style={{ padding: '40px' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto" style={{ marginBottom: '20px' }}>
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>
              Access Denied
            </h2>
            
            <p className="text-gray-600" style={{ marginBottom: '8px' }}>
              You need administrator privileges to access this page.
            </p>
            
            <div className="bg-gray-50 rounded-lg" style={{ padding: '16px', marginTop: '20px', marginBottom: '24px' }}>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current Role:</span> {userRole || 'Unknown'}
              </p>
              <p className="text-sm text-gray-700" style={{ marginTop: '4px' }}>
                <span className="font-semibold">Required Role:</span> Admin
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black border-2 border-black rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <LogIn className="w-5 h-5" />
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user access required but user is admin (optional check)
  if (requireUser && userRole !== 'user') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ padding: '20px' }}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border-2 border-orange-200" style={{ padding: '40px' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto" style={{ marginBottom: '20px' }}>
              <ShieldAlert className="w-8 h-8 text-orange-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>
              Access Restricted
            </h2>
            
            <p className="text-gray-600" style={{ marginBottom: '8px' }}>
              This page is only accessible to regular users.
            </p>
            
            <div className="bg-gray-50 rounded-lg" style={{ padding: '16px', marginTop: '20px', marginBottom: '24px' }}>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current Role:</span> {userRole || 'Unknown'}
              </p>
              <p className="text-sm text-gray-700" style={{ marginTop: '4px' }}>
                <span className="font-semibold">Required Role:</span> User
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Validate that isAdmin flag matches user role (consistency check)
  if (isAdmin !== (userRole === 'admin')) {
    console.warn('Role mismatch detected. isAdmin flag does not match user.role')
  }

  // If authenticated and has required permissions
  return children
}

export default ProtectedRoute
