import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../Slices/CartSlice';
import { fetchProducts } from '../../Slices/AddProductSlice';
import Loader from '../../../components/Loader/Loader';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const product = products?.find(p => p.id.toString() === id.toString());

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (product) document.title = `${product.name} - Clothing Store`;
  }, [product, products.length, dispatch]);

  if (loading) {
    return <Loader fullScreen text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800" style={{ marginBottom: "16px" }}>
          Product Not Found
        </h2>
        <p className="text-gray-600" style={{ marginBottom: "24px" }}>
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/ProductsList')}
          className="bg-black text-white rounded hover:bg-gray-800 transition"
          style={{ padding: "10px 24px" }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => dispatch(addToCart(product));

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: "32px 16px 112px" }}>
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/ProductsList')}
          className="flex items-center text-gray-600 hover:text-black transition"
          style={{ marginBottom: "28px" }}
        >
          <svg className="w-5 h-5" style={{ marginRight: "8px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* MAIN FLEX LAYOUT */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-200"
          style={{ padding: "28px" }}
        >
          <div className="flex flex-col md:flex-row" style={{ gap: "36px" }}>

            {/* PRODUCT IMAGE */}
            <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center"
                 style={{ padding: "20px", height: "520px" }}>
              {product.img ? (
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                  style={{ objectPosition: "top" }}
                />
              ) : (
                <div className="text-gray-400 text-lg">No Image Available</div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 flex flex-col" style={{ paddingTop: "8px" }}>

              {/* Category Badge */}
              <span
                className="inline-block text-xs font-medium border border-black rounded-full"
                style={{
                  padding: "6px 14px",
                  marginBottom: "18px",
                }}
              >
                {product.category}
              </span>

              {/* Product Name */}
              <h1
                className="text-4xl font-bold text-gray-900 leading-tight"
                style={{ marginBottom: "18px" }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <p
                className="text-3xl font-semibold text-black"
                style={{ marginBottom: "26px" }}
              >
                ₹{product.price}
              </p>

              {/* Description */}
              <div style={{ marginBottom: "32px" }}>
                <h3 className="text-lg font-semibold" style={{ marginBottom: "10px" }}>
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.description ||
                    `Premium ${product.name.toLowerCase()} crafted for comfort, style & durability. A standout piece for every wardrobe.`}
                </p>
              </div>

              {/* Product Details (Flex List) */}
              <div style={{ marginBottom: "36px" }}>
                <h3 className="text-lg font-semibold" style={{ marginBottom: "12px" }}>
                  Product Details
                </h3>

                <div className="text-sm flex flex-col" style={{ gap: "12px" }}>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID</span>
                    <span className="font-medium">#{product.id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span
                      className={`font-medium ${
                        product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stockQuantity > 0
                        ? `In Stock (${product.stockQuantity})`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`w-full rounded-xl font-semibold transition duration-200 uppercase tracking-wide ${
                  product.stockQuantity > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                style={{ padding: "14px 22px" }}
              >
                {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div style={{ marginTop: "60px" }}>
          <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: "28px" }}>
            You Might Also Like
          </h2>

          <div className="flex flex-wrap" style={{ gap: "24px" }}>
            {products
              ?.filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(related => (
                <div
                  key={related.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition"
                  style={{ width: "250px" }}
                  onClick={() => navigate(`/product/${related.id}`)}
                >
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                    {related.img ? (
                      <img
                        src={related.img}
                        alt={related.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No Image</div>
                    )}
                  </div>

                  <div style={{ padding: "16px" }}>
                    <h3 className="font-semibold text-sm" style={{ marginBottom: "6px" }}>
                      {related.name}
                    </h3>
                    <p className="text-gray-600 text-xs" style={{ marginBottom: "6px" }}>
                      {related.category}
                    </p>
                    <p className="font-bold">₹{related.price}</p>
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
