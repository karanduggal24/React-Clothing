import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../Slices/AddProductSlice";
import { addToCart, addToCartBackend, selectCartItems } from "../../Slices/CartSlice";
import FilterBar from "../FilterBar/FilterBar";
import { selectFilteredProducts, selectFilters } from "../../Slices/filterSlice";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { Button, Pagination } from "../../../components/ui";

function ProductsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const pagination = useSelector((state) => state.products.pagination);
  const filteredProducts = useSelector(selectFilteredProducts);
  const filters = useSelector(selectFilters);
  const loading = useSelector((state) => state.products.loading);
  const cartItems = useSelector(selectCartItems);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "Clothing Store • Products";
    dispatch(fetchProducts({ page: currentPage, pageSize: 20 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart >= product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} in stock.`);
      return;
    }

    dispatch(addToCart(product));

    try {
      await dispatch(addToCartBackend(product)).unwrap();
    } catch (error) {
      console.error("Cart sync failed:", error);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading products…" />;
  }

  if (!products) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <p className="text-xl font-medium text-gray-600">No products available</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "80px",
        paddingTop: "100px",
      }}
    >
      <FilterBar />

      {/* Empty State */}
      {filteredProducts.length === 0 && filters.selectedCategories.length > 0 ? (
        <div className="w-full flex justify-center items-center" style={{ marginTop: "20px" }}>
          <p className="text-xl font-medium text-gray-600">No matching products.</p>
        </div>
      ) : (
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: "28px", marginTop: "24px" }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="
                flex flex-col bg-white rounded-xl border 
                border-gray-200 shadow-sm overflow-hidden transition-all duration-300 
                hover:shadow-md hover:-translate-y-1
              "
              style={{ width: "240px", cursor: "pointer" }}
            >
              {/* Image */}
              <div
                className="bg-gray-100 flex items-center justify-center overflow-hidden"
                style={{ height: "260px" }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ objectPosition: "top" }}
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>

              {/* Text Section */}
              <div className="flex flex-col" style={{ padding: "16px" }}>
                {/* Name */}
                <h3
                  className="font-semibold text-base text-gray-900 hover:text-gray-600 transition"
                  style={{
                    marginBottom: "10px",
                    minHeight: "42px",
                    lineHeight: "1.3",
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>

                {/* Category */}
                <span
                  className="text-xs text-gray-700 border border-gray-300 rounded-full bg-gray-50"
                  style={{
                    padding: "4px 12px",
                    marginBottom: "10px",
                    alignSelf: "flex-start",
                  }}
                >
                  {product.category}
                </span>

                {/* Price */}
                <span
                  className="text-lg font-bold text-black"
                  style={{ marginBottom: "12px" }}
                >
                  ₹{product.price}
                </span>

                {/* Stock */}
                <span
                  className={`text-xs rounded-full font-medium ${
                    product.stockQuantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  style={{
                    padding: "6px 10px",
                    alignSelf: "flex-start",
                    marginBottom: "14px",
                  }}
                >
                  {product.stockQuantity > 0
                    ? `In Stock (${product.stockQuantity})`
                    : "Out of Stock"}
                </span>

                {/* Buttons */}
                <div className="flex" style={{ gap: "10px" }}>
                  {/* Add to Cart */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stockQuantity <= 0}
                    className="flex-1 uppercase"
                  >
                    Add
                  </Button>

                  {/* View */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                    className="flex-1 uppercase"
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page || currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          totalItems={pagination.totalItems}
        />
      )}
    </div>
  );
}

export default ProductsList;
