import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeOutOfStockItems } from '../features/Slices/CartSlice';

export const useCartStockSync = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (products && cartItems.length > 0) {
      // Check if any cart items are out of stock or have reduced stock
      dispatch(removeOutOfStockItems(products));
    }
  }, [products, dispatch]); // Only trigger when products change, not cartItems

  return null;
};