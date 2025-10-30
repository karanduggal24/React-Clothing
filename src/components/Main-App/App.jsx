import { Routes, Route } from "react-router-dom";
import ProductForm from "../../features/products/ProductForm/ProductForm";
import ProductsList from "../../features/products/ProductList/ProductsList";
import ProductCart from "../../features/products/ProductCart/ProductCart";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Home from "../Home/Home";
import ProtectedRoute from "../ProtectedRoute";
import Footer from "../Footer/Footer";
import "./App.css";
// import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProductsList" element={<ProductsList />} />
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
