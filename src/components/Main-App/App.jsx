import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import { fetchCartFromBackend } from "../../features/Slices/CartSlice";
import { fetchAllProducts } from "../../features/Slices/AddProductSlice";
import ScrollToTop from "../../hooks/scrollToTop";
import AppRoutes from "./AppRoutes";
import ToastConfig from "./ToastConfig";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCartFromBackend());
  }, [dispatch]);
  
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
