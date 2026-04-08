import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import { fetchCartFromBackend } from "../../features/Slices/CartSlice";
import ScrollToTop from "../../hooks/scrollToTop";
import AppRoutes from "./AppRoutes";
import ToastConfig from "./ToastConfig";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const { fetchProducts } = await import('../../features/Slices/AddProductSlice');
        dispatch(fetchProducts());
        dispatch(fetchCartFromBackend());
      } catch (error) {
        console.error('Failed to load data on app load:', error);
      }
    };
    loadData();
  }, []); // run once on mount only
  
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
