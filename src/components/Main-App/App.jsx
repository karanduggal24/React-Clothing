import { Routes, Route } from "react-router-dom";
import ProductForm from "../../features/products/ProductForm/ProductForm";
import ProductsList from "../../features/products/ProductList/ProductsList";
import ProductCart from "../../features/products/ProductCart/ProductCart";
import ProductDetail from "../../features/products/ProductDetail/ProductDetail";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Home from "../Home/Home";
import ProtectedRoute from "../ProtectedRoute";
import Footer from "../Footer/Footer";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import "./App.css";
import ScrollToTop from "../../hooks/scrollToTop";
// import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import PaymentPage from "../../features/Payment/PaymentPage";
import OrderConfirmed from "../../features/Order/OrderConfirmed";
import PaymentProtectedRoute from "../PaymentProtectedRoute";

function App() {
  // Sync cart with product stock changes
  useCartStockSync();

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProductsList" element={<ProductsList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route 
          path="/Payment" 
          element={
            <PaymentProtectedRoute>
              <PaymentPage />
            </PaymentProtectedRoute>
          } 
        />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<ProductCart />} />
        <Route
          path="/ProductForm"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "12px",
          border: "1px solid #fff",
          fontFamily: "Poppins, sans-serif",
          letterSpacing: "0.5px",
          padding: "10px 16px",
          boxShadow: "0 4px 10px rgba(255,255,255,0.1)",
        }}
        progressStyle={{
          background: "#fff",
        }}
      />
      <Footer />
    </>
  );
}

export default App;
