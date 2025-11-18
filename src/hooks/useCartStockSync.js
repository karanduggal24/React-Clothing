import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeOutOfStockItems } from '../features/Slices/CartSlice';

export const useCartStockSync = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      // Sync cart items with latest product stock
      // This updates stockQuantity in cart items and adjusts quantities if needed
      dispatch(removeOutOfStockItems(products));
    }
  }, [products, cartItems.length, dispatch]); // Trigger when products change or cart items count changes

  return null;
};