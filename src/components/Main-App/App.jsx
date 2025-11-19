import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../features/products/ProductForm/ProductForm";
import ProductsList from "../../features/products/ProductList/ProductsList";
import ProductCart from "../../features/products/ProductCart/ProductCart";
import ProductDetail from "../../features/products/ProductDetail/ProductDetail";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import Home from "../Home/Home";
import ProtectedRoute from "../ProtectedRoute";
import Footer from "../Footer/Footer";
import { useCartStockSync } from "../../hooks/useCartStockSync";
import { fetchCartFromBackend } from "../../features/Slices/CartSlice";
import "./App.css";
import ScrollToTop from "../../hooks/scrollToTop";
import { ToastContainer } from "react-toastify";
import PaymentPage from "../../features/Payment/PaymentPage";
import OrderConfirmed from "../../features/Order/OrderConfirmed";
import PaymentProtectedRoute from "../PaymentProtectedRoute";
import NotFound from "./NotFound";
import AdminLayout from "../../features/Admin/AdminLayout";
import AdminDashboard from "../../features/Admin/AdminDashboard";
import AdminProducts from "../../features/Admin/AdminProducts";
import AdminOrders from "../../features/Admin/AdminOrders";
import AdminUsers from "../../features/Admin/AdminUsers";
import UserProfile from "../../features/User/UserProfile";

function App() {
  const dispatch = useDispatch();
  const synced = useSelector((state) => state.cart.synced);
  const products = useSelector((state) => state.products.products);
  
  // Fetch products FIRST, wait 5 seconds, then cart (sequential loading)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Step 1: Fetch products first
        if (products.length === 0) {
          const { fetchProducts } = await import('../../features/Slices/AddProductSlice');
          await dispatch(fetchProducts()).unwrap();
          console.log('Products loaded successfully');
        }
        
        // Step 2: Wait 5 seconds before fetching cart
        if (!synced) {
          console.log('Waiting 5 seconds before loading cart...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          await dispatch(fetchCartFromBackend()).unwrap();
          console.log('Cart loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load data on app load:', error);
      }
    };
    
    loadData();
  }, [dispatch, synced, products.length]);
  
  // Sync cart with product stock changes
  useCartStockSync();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Header and Footer */}
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/ProductsList" element={<><Header /><ProductsList /><Footer /></>} />
        <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/signup" element={<><Header /><Signup /><Footer /></>} />
        <Route path="/cart" element={<><Header /><ProductCart /><Footer /></>} />
        <Route path="/order-confirmed" element={<><Header /><OrderConfirmed /><Footer /></>} />
        <Route 
          path="/Payment" 
          element={
            <>
              <Header />
              <PaymentProtectedRoute>
                <PaymentPage />
              </PaymentProtectedRoute>
              <Footer />
            </>
          } 
        />
        <Route
          path="/profile"
          element={
            <>
              <Header />
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />

        {/* Legacy Admin Route (redirect to new admin panel) */}
        <Route
          path="/ProductForm"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminProducts />} />
        </Route>

        {/* Admin Panel Routes with Sidebar (No Header/Footer) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
      </Routes>

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        limit={3}
        newestOnTop={true}
        preventDuplicates={true}
        toastStyle={{
          backgroundColor: "#ffffff",
          color: "#000000",
          borderRadius: "8px",
          border: "2px solid #000000",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          minHeight: "60px",
        }}
        progressStyle={{
          background: "#000000",
        }}
        style={{
          bottom: "20px",
          left: "20px",
        }}
        progressStyle={{
          background: "#fff",
        }}
      />
    </>
  );
}

export default App;
