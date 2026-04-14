import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import { fetchCartFromBackend } from "../../features/Slices/CartSlice";
import { fetchProducts } from "../../features/Slices/AddProductSlice";
import ScrollToTop from "../../hooks/scrollToTop";
import AppRoutes from "./AppRoutes";
import ToastConfig from "./ToastConfig";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCartFromBackend());
  }, []);
  
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
