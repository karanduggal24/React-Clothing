import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, fetchProducts } from '../../Slices/AddProductSlice';
import { addToCart, addToCartBackend, selectCartItems } from '../../Slices/CartSlice';
import FilterBar from '../FilterBar/FilterBar';
import { selectFilteredProducts, selectFilters } from '../../Slices/filterSlice';
import { toast } from "react-toastify";
// toast.configure();
function ProductsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => {
    // console.log('Redux State:', state);
    return state.products.products;
  });
  const filteredProducts = useSelector(selectFilteredProducts);
  const filters = useSelector(selectFilters);
  const loading = useSelector((state) => state.products.loading);

  useEffect(() => {
    document.title = "Clothing Store-Products";
    // Fetch products from backend on component mount
    dispatch(fetchProducts());
    // console.log('Products:', products);
    // console.log('Filtered Products:', filteredProducts);
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    // Add to local state first for immediate feedback
    dispatch(addToCart(product));
    // Then sync with backend
    try {
      await dispatch(addToCartBackend(product)).unwrap();
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    }
  };

  if (loading) {
    return <div className="w-full flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Loading products from database...</p>
      </div>
    </div>;
  }

  if (!products) {
    return <div className="w-full flex justify-center items-center min-h-[400px]">
      <p className="text-xl font-medium text-gray-600">No products available</p>
    </div>;
  }

  return (
    <div className="min-h-screen w-full mb-20 px-4" style={{marginBottom:"80px"}} >
      <FilterBar />
      
      {filteredProducts.length === 0 && filters.selectedCategories.length > 0 ? (
        <div style={{marginTop:"12px"}} className="w-full flex justify-center items-center mt-12">
          <p className="text-xl font-medium text-gray-600">
            No products found for selected categories
          </p>
        </div>
      ) : (
        <div style={{marginTop:"8px"}} className="flex justify-center flex-wrap gap-6 mt-8">
          {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white w-72 rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{marginTop:"12px"}}
          >
            {/* Image Container - Fixed aspect ratio */}
            <div
              className="w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer relative group"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.img ? (
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="text-gray-400 text-sm">No Image</div>
              )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col p-4 gap-3 bg-white">
              {/* Product Name */}
              <h3 
                className="font-bold text-lg text-gray-900 cursor-pointer hover:text-gray-600 transition line-clamp-2 min-h-[3.5rem]"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>

              {/* Category Badge */}
              <div className="flex justify-center">
                <span className="text-xs text-gray-700 px-3 py-1 border border-gray-300 rounded-full bg-gray-50">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-center">
                <span className="text-xl font-bold text-white bg-black px-4 py-2 rounded-md">
                  ₹{product.price}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex justify-center">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  product.stockQuantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.stockQuantity <= 0}
                  className={`flex-1 py-2.5 px-4 rounded-md border border-black text-xs font-semibold uppercase tracking-wide transition-all ${
                    product.stockQuantity > 0 
                      ? 'bg-white text-black hover:bg-black hover:text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  }`}
                >
                  {product.stockQuantity > 0 ? 'Add To Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-md bg-black text-white border border-black text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default ProductsList;
