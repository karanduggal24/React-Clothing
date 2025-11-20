import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import { fetchCartFromBackend } from "../../features/Slices/CartSlice";
import ScrollToTop from "../../hooks/scrollToTop";
import AppRoutes from "./AppRoutes";
import ToastConfig from "./ToastConfig";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const synced = useSelector((state) => state.cart.synced);
  const products = useSelector((state) => state.products.products);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (products.length === 0) {
          const { fetchProducts } = await import('../../features/Slices/AddProductSlice');
          await dispatch(fetchProducts()).unwrap();
        }
        if (!synced) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          await dispatch(fetchCartFromBackend()).unwrap();
        }
      } catch (error) {
        console.error('Failed to load data on app load:', error);
      }
    };
    loadData();
  }, [dispatch, synced, products.length]);
  
  useCartStockSync();

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <ToastConfig />
    </>
  );
}

export default App;
