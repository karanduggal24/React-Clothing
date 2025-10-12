import { Routes, Route } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm/ProductForm'
import ProductsList from '../../features/products/ProductList/ProductsList'
import Header from '../Header/Header'
import Login from '../Login/Login'
import ProtectedRoute from '../ProtectedRoute'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/login" element={<Login />} />
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
    </>
  )
}

export default App
