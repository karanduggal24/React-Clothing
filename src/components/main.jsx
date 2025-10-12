import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import '../../src/index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './Main-App/App'
import { store } from '../app/store'
import { Provider } from 'react-redux'
// import ProductForm from '../features/products/ProductForm'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
  
)
