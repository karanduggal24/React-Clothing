import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { selectCartItems } from '../../features/Slices/CartSlice';

function PaymentProtectedRoute({ children }) {
  const cartItems = useSelector(selectCartItems);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      toast.error("Please login to proceed to payment.");
      hasShownToast.current = true;
    } else if (isAuthenticated && cartItems.length === 0 && !hasShownToast.current) {
      toast.error("Your cart is empty! Add items to proceed to payment.");
      hasShownToast.current = true;
    }
  }, [isAuthenticated, cartItems.length]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return children;
}

export default PaymentProtectedRoute;