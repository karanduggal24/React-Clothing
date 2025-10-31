import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../Slices/CartSlice';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const products = useSelector((state) => state.products.products);
  const product = products?.find(p => p.id.toString() === id.toString());

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Clothing Store`;
    }
  }, [product]);

  

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800" style={{marginBottom: "16px"}}>Product Not Found</h2>
        <p className="text-gray-600" style={{marginBottom: "24px"}}>The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/ProductsList')}
          className="bg-black text-white rounded hover:bg-gray-800 transition"
          style={{paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px"}}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{paddingTop: "32px", paddingBottom: "112px", paddingLeft: "16px", paddingRight: "16px"}}>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/ProductsList')}
          className="flex items-center text-gray-600 hover:text-black transition"
          style={{marginBottom: "24px"}}
        >
          <svg className="w-5 h-5" style={{marginRight: "8px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div
                className="w-full h-96 md:h-full bg-cover bg-center bg-no-repeat"
                style={product.img ? { backgroundImage: `url(${product.img})` } : { backgroundColor: '#f3f4f6' }}
              >
                {!product.img && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-lg">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2" style={{padding: "32px"}}>
              <div style={{marginBottom: "16px"}}>
                <span className="inline-block text-sm border border-black rounded-full" style={{paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px"}}>
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900" style={{marginBottom: "16px"}}>{product.name}</h1>
              
              <div style={{marginBottom: "24px"}}>
                <span className="text-3xl font-bold text-black">{product.price} Rs</span>
              </div>

              {/* Product Description */}
              <div style={{marginBottom: "32px"}}>
                <h3 className="text-lg font-semibold" style={{marginBottom: "8px"}}>Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || `Premium quality ${product.name.toLowerCase()} from our exclusive collection. Made with high-quality materials for comfort and style.`}
                </p>
              </div>

              {/* Product Details */}
              <div style={{marginBottom: "32px"}}>
                <h3 className="text-lg font-semibold" style={{marginBottom: "12px"}}>Product Details</h3>
                <div className="text-sm" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium">#{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`w-full rounded-lg font-medium transition duration-200 uppercase tracking-wide ${
                  product.stockQuantity > 0 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{paddingTop: "12px", paddingBottom: "12px", paddingLeft: "24px", paddingRight: "24px"}}
              >
                {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div style={{marginTop: "48px"}}>
          <h2 className="text-2xl font-bold" style={{marginBottom: "24px"}}>You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products
              ?.filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div
                    className="w-full h-48 bg-cover md:bg-center  bg-no-repeat"
                    style={relatedProduct.img ? { backgroundImage: `url(${relatedProduct.img})` } : { backgroundColor: '#f3f4f6' }}
                  />
                  <div style={{padding: "16px"}}>
                    <h3 className="font-semibold text-sm" style={{marginBottom: "8px"}}>{relatedProduct.name}</h3>
                    <p className="text-gray-600 text-xs" style={{marginBottom: "8px"}}>{relatedProduct.category}</p>
                    <p className="font-bold">{relatedProduct.price} Rs</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;