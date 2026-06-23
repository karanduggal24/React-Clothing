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


    if (error) {
      toast.error(decodeURIComponent(errorMessage || 'OAuth authentication failed'));
      navigate('/login');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        console.log('Parsed user data:', user);
        
        // Dispatch login action
        dispatch(login({ user, token }));
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/');
      } catch (err) {
        console.error('Failed to parse user data:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    } else {
      console.error('Missing token or user data');
      toast.error('Invalid authentication response');
      navigate('/login');
    }
  }, [searchParams, dispatch, navigate]);

  return <Loader fullScreen text="Completing login..." />;
}

export default OAuthCallback;
