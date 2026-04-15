import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { selectCartItems } from '../../features/Slices/CartSlice';

function PaymentProtectedRoute({ children }) {
  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector((state) => state.cart.loading);
  const cartSynced = useSelector((state) => state.cart.synced);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hasShownToast = useRef(false);

  // Wait for cart to finish loading before deciding to redirect
  const isCartReady = cartSynced || cartItems.length > 0;

  useEffect(() => {
    if (!isCartReady) return; // don't show toast while loading

    if (!isAuthenticated && !hasShownToast.current) {
      toast.error("Please login to proceed to payment.");
      hasShownToast.current = true;
    } else if (isAuthenticated && cartItems.length === 0 && !hasShownToast.current) {
      toast.error("Your cart is empty! Add items to proceed to payment.");
      hasShownToast.current = true;
    }
  }, [isAuthenticated, cartItems.length, isCartReady]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Don't redirect while cart is still being fetched from backend
  if (!isCartReady && cartLoading) {
    return null;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return children;
}

export default PaymentProtectedRoute;