import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/Slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Extract token and user from URL parameters
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');
    const errorMessage = searchParams.get('message');

    // Handle OAuth errors (cancellation, failure, etc.)
    if (error) {
      const errorType = error;
      const message = errorMessage ? decodeURIComponent(errorMessage) : 'OAuth authentication failed';
      
      console.error('OAuth error:', errorType, message);
      
      // Show user-friendly error message
      if (errorType === 'oauth_cancelled') {
        toast.warning(message, { autoClose: 5000 });
      } else {
        toast.error(message, { autoClose: 5000 });
      }
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
      return;
    }

    // Handle successful OAuth
    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        console.log('OAuth successful - User data:', user);
        
        // Store token and dispatch login action
        dispatch(login({ user, token }));
        
        toast.success(`Welcome back, ${user.name}!`, { autoClose: 3000 });
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Failed to parse OAuth user data:', err);
        toast.error('Authentication failed. Please try again.', { autoClose: 5000 });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      }
    } else {
      // Missing required parameters
      console.error('OAuth callback: Missing token or user data');
      toast.error('Invalid authentication response. Please try again.', { autoClose: 5000 });
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    }
  }, [searchParams, dispatch, navigate]);

  return <Loader fullScreen text="Completing login..." />;
}

export default OAuthCallback;
