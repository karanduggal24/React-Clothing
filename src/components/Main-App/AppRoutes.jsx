import { Routes, Route } from "react-router-dom";
import ProductsList from "../../features/products/ProductList/ProductsList";
import ProductCart from "../../features/products/ProductCart/ProductCart";
import ProductDetail from "../../features/products/ProductDetail/ProductDetail";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import Home from "../Home/Home";
import ProtectedRoute from "../ProtectedRoute";
import Footer from "../Footer/Footer";
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

function AppRoutes() {
  return (
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
  );
}

export default AppRoutes;
