import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ProtectedRoute from "../Routes/ProtectedRoute";
import PaymentProtectedRoute from "../Routes/PaymentProtectedRoute";

// Pages
import Home from "../Home/Home";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import NotFound from "./NotFound";

// Product
import ProductsList from "../../features/products/ProductList/ProductsList";
import ProductDetail from "../../features/products/ProductDetail/ProductDetail";
import ProductCart from "../../features/products/ProductCart/ProductCart";

// Payment & Orders
import PaymentPage from "../../features/Payment/PaymentPage";
import OrderConfirmed from "../../features/Order/OrderConfirmed";

// User
import UserProfile from "../../features/User/UserProfile";

// Admin
import AdminLayout from "../../features/Admin/AdminLayout";
import AdminDashboard from "../../features/Admin/AdminDashboard";
import AdminProducts from "../../features/Admin/AdminProducts";
import AdminOrders from "../../features/Admin/AdminOrders";
import AdminUsers from "../../features/Admin/AdminUsers";

// Wraps a page with Header + Footer
const WithLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<WithLayout><Home /></WithLayout>} />
      <Route path="/ProductsList" element={<WithLayout><ProductsList /></WithLayout>} />
      <Route path="/product/:id" element={<WithLayout><ProductDetail /></WithLayout>} />
      <Route path="/login" element={<WithLayout><Login /></WithLayout>} />
      <Route path="/signup" element={<WithLayout><Signup /></WithLayout>} />
      <Route path="/cart" element={<WithLayout><ProductCart /></WithLayout>} />
      <Route path="/order-confirmed" element={<WithLayout><OrderConfirmed /></WithLayout>} />

      {/* Payment (requires auth + non-empty cart) */}
      <Route
        path="/Payment"
        element={
          <WithLayout>
            <PaymentProtectedRoute>
              <PaymentPage />
            </PaymentProtectedRoute>
          </WithLayout>
        }
      />

      {/* User profile (requires auth) */}
      <Route
        path="/profile"
        element={
          <WithLayout>
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Admin panel (requires admin role, no Header/Footer) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
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

      {/* Legacy admin route */}
      <Route
        path="/ProductForm"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProducts />} />
      </Route>

      <Route path="*" element={<WithLayout><NotFound /></WithLayout>} />
    </Routes>
  );
}

export default AppRoutes;
