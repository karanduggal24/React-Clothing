import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { selectCartItems } from '../features/Slices/CartSlice';

function PaymentProtectedRoute({ children }) {
  const cartItems = useSelector(selectCartItems);
  const hasShownToast = useRef(false);

  // Show toast only once per component mount when cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !hasShownToast.current) {
      toast.error("Your cart is empty! Add items to proceed to payment.");
      hasShownToast.current = true;
    }
  }, [cartItems.length]);

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // If cart has items, allow access to payment page
  return children;
}

export default PaymentProtectedRoute;