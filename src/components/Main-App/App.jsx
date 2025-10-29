import { Routes, Route } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm/ProductForm'
import ProductsList from '../../features/products/ProductList/ProductsList'
import ProductCart from '../../features/products/ProductCart/ProductCart'
import Header from '../Header/Header'
import Login from '../Login/Login'
import Home from '../Home/Home'
import ProtectedRoute from '../ProtectedRoute'
import Footer from '../Footer/Footer'
import './App.css'
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

      <ToastContainer position="top-right" autoClose={2000} />
       {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <Footer />
    </>
  )
}

export default App
