import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteProduct,
  deleteProductFromBackend,
} from "../../Slices/AddProductSlice";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal/DeleteConfirmModal";

function AdminTable({ onEditProduct }) {
  useEffect(() => {
    document.title = "Clothing Store-Products";
  }, []);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await dispatch(deleteProductFromBackend(productToDelete.id)).unwrap();
      toast.success('Product deleted successfully from database');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete product: ${error}`);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 animate-fadeInUp"
      style={{ padding: "40px" }}
    >
      <h3
        className="text-2xl font-light text-center"
        style={{ marginBottom: "32px" }}
      >
        Products List
      </h3>

        {products.length > 0 ? (
          <div
            className="overflow-x-auto border border-gray-200 rounded-md"
            style={{ marginBottom: "0px" }}
          >
            <table className="w-full border-collapse bg-white text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    ID
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Product Name
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Price in Rs
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Category
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Product-ID
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Action
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest"
                    style={{ padding: "20px" }}
                  >
                    Image
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td style={{ padding: "16px" }} className="font-mono text-sm">{product.id}</td>
                    <td style={{ padding: "16px" }}>{product.name}</td>
                    <td style={{ padding: "16px" }}>{product.price}</td>
                    <td style={{ padding: "16px" }}>{product.category}</td>
                    <td style={{padding:"16px"}}>{product.stockQuantity}</td>
                    <td style={{padding:"16px"}}>{product.id}</td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div
                        className="flex justify-center"
                        style={{ gap: "8px" }}
                      >
                        <button
                          onClick={() => onEditProduct && onEditProduct(product)}
                          className="bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                          style={{ padding: "4px 12px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="border-2 border-red-600 text-red-600 bg-white rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition"
                          style={{ padding: "4px 12px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {product.img && (
                        <img
                          src={product.img}
                          alt=""
                          className="w-36 h-48 object-cover rounded-md border"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p
            className="text-center text-gray-500 text-lg font-light border-2 border-dashed border-gray-300 rounded-md bg-gray-50"
            style={{
              padding: "40px 0px",
            }}
          >
            No products yet. Add one above!
          </p>
        )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        loading={loading}
      />
    </div>
  );
}

export default AdminTable;