import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../Slices/AddProductSlice';
import { addToCart, selectCartItems } from '../../Slices/CartSlice';
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

  useEffect(() => {
    document.title = "Clothing Store-Products";
    // console.log('Products:', products);
    // console.log('Filtered Products:', filteredProducts);
  }, [products, filteredProducts]);

  if (!products) {
    return <div className="w-full flex justify-center items-center min-h-[400px]">
      <p className="text-xl font-medium text-gray-600">Loading products...</p>
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
        <div style={{marginTop:"8px"}} className="flex justify-around flex-wrap gap-6 mt-8">
          {filteredProducts.map((product) => (
          <div
          style={{marginTop:"12px"}}
            key={product.id}
            className=" justify-between flex-col mt-12 bg-white w-60 rounded-lg shadow-md border border-black overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            <div
              className="w-full h-60 bg-contain bg-center bg-no-repeat"
              style={product.img ? { backgroundImage: `url(${product.img})`, backgroundSize: 'cover' } : undefined}
              onClick={() => navigate(`/product/${product.id}`)}
            />

            <div className="bg-white flex flex-col items-center text-center border-t border-black p-3 gap-2">
              <div className="font-bold text-lg" onClick={() => navigate(`/product/${product.id}`)}>
                <p style={{padding:"5px"}} className="m-0 cursor-pointer hover:text-gray-600 transition">{product.name}</p>
              </div>

              <div>
                <p style={{paddingLeft:"7px",paddingRight:"7px"}} className="m-0 text-sm text-black inline-block px-3 py-1 border border-black rounded-full">
                  {product.category}
                </p>
              </div>

              <div>
                <p style={{paddingLeft:"7px",paddingRight:"7px"}} className="m-0 font-bold text-white bg-black inline-block px-3 py-1 rounded-md">{product.price} Rs</p>
              </div>

              {/* Stock Status */}
              <div style={{marginBottom:"4px"}} className="mb-2">
                <span style={{paddingLeft:"4px",paddingRight:"4px",paddingTop:"2px",paddingBottom:"2px"  }} className={`text-xs px-2 py-1 rounded-full ${
                  product.stockQuantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  style={{padding:"7px",margin:"5px",marginBottom:"20px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart(product));
                  }}
                  disabled={product.stockQuantity <= 0}
                  className={`flex-1 rounded px-3 py-2 border border-black uppercase text-xs font-medium transition ${
                    product.stockQuantity > 0 
                      ? 'bg-white text-black hover:bg-black hover:text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stockQuantity > 0 ? 'Add To Cart' : 'Out of Stock'}
                </button>
                <button
                  style={{padding:"7px",margin:"5px",marginBottom:"20px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="flex-1 rounded px-3 py-2 bg-black text-white border border-black uppercase text-xs font-medium hover:bg-gray-800 transition"
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
