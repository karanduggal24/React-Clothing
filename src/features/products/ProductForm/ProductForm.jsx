import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
} from "../../Slices/AddProductSlice";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import AdminTable from "./AdminTable";
import OrderTable from "./OrderTable";

// Predefined categories
const categories = [
  "Men's Clothing",
  "Women's Clothing",
  "Kids' Clothing",
  "Accessories",
  "Footwear",
  "Sportswear",
  "Formal Wear",
  "Casual Wear",
  "Ethnic Wear",
  "Winter Collection"
];

function ProductForm() {
  useEffect(() => {
    document.title = "Clothing Store-Admin";
  }, []);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [NewId, setNewId] = useState("");
  const [NewName, setNewName] = useState("");
  const [NewPrice, setNewPrice] = useState("");
  const [NewCategory, setNewCategory] = useState("");
  const [NewImage, setNewImage] = useState("");
  const [NewQuantity, setNewQuantity] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // New state for tab navigation

  const handleImageChange = (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      setNewImage("");
      return;
    }
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result =
        typeof e.target?.result === "string" ? e.target.result : "";
      setNewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditingId(product.id);
    setNewId(product.id);
    setNewName(product.name);
    setNewPrice(product.price);
    setNewCategory(product.category);
    setNewImage(product.img);
    setNewQuantity(product.stockQuantity);
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (!NewName.trim() || !NewPrice.trim() || !NewCategory.trim()|| !NewQuantity.trim() || !NewId.trim()) {
      toast.error("Enter Data in all the fields");
      return;
    }

    else{
      toast.success("Product Added Succesfully")
    }

    // Check if ID already exists when adding new product
    if (!editMode && NewId.trim()) {
      const existingProduct = products.find(p => p.id === NewId.trim());
      if (existingProduct) {
        toast.error("Product ID already exists. Please use a different ID.");
        return;
      }
    }

    if (editMode && editingId) {
      const updatedProduct = {
        id: editingId,
        name: NewName,
        price: NewPrice,
        category: NewCategory,
        img: NewImage,
        stockQuantity: NewQuantity
      };
      dispatch(updateProduct(updatedProduct));
      setEditMode(false);
      setEditingId(null);
    } else {
      const newProduct = {
        id: NewId.trim(), // Use provided ID or generate one
        name: NewName,
        price: NewPrice,
        category: NewCategory,
        img: NewImage,
        stockQuantity: NewQuantity
      };
      dispatch(addProduct(newProduct));
    }

    setNewId("");
    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setNewImage("");
    setNewQuantity("");
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div
      className="w-full mx-auto font-inter bg-gray-200 min-h-screen text-black relative"
      style={{ padding: "24px" }}
    >
      {/* Heading */}
      <div
        className="text-center bg-white rounded-lg shadow-md border border-gray-200"
        style={{ marginBottom: "40px", padding: "32px" }}
      >
        <h2 className="text-4xl font-light text-black">Add Product</h2>
      </div>

      {/* Form */}
      <div
        className="bg-white rounded-lg shadow-md border border-gray-200 animate-fadeInUp"
        style={{ marginBottom: "40px", padding: "40px" }}
      >
        <form
          onSubmit={handleAddProduct}
          className="flex flex-col w-full mx-auto"
          style={{ gap: "24px" }}
        >
          <input
            type="text"
            value={NewId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="Product ID"
            className="border-2 border-gray-200 rounded-md text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition"
            style={{ padding: "16px" }}
            disabled={editMode}
            required
          />
          <input
            type="text"
            value={NewName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product Name"
            className="border-2 border-gray-200 rounded-md text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition"
            style={{ padding: "16px" }}
          />
          <input
            type="number"
            value={NewPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price in INR"
            className="border-2 border-gray-200 rounded-md text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition"
            style={{ padding: "16px" }}
          />
          <select
            value={NewCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border-2 border-gray-200 rounded-md text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition appearance-none bg-white cursor-pointer"
            style={{ 
              padding: "16px",
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
              paddingRight: "3rem"
            }}
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={NewQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Stock Quantity"
            className="border-2 border-gray-200 rounded-md text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition"
            style={{ padding: "16px" }}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            className="bg-black! hover:bg-gray-800!"
            style={{ padding: "10px 16px" }}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <button
            type="submit"
            className="bg-black text-white border-2 border-black rounded-md text-lg font-medium uppercase tracking-wide hover:bg-white hover:text-black transition"
            style={{ padding: "16px" }}
          >
            {editMode ? "Update Product" : "Add Product"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setEditingId(null);
                setNewId("");
                setNewName("");
                setNewPrice("");
                setNewCategory("");
                setNewImage("");
                setNewQuantity("");
              }}
              className="bg-red-600 text-white border-2 border-red-600 rounded-md text-lg font-medium uppercase tracking-wide hover:bg-white hover:text-red-600 transition"
              style={{ padding: "16px" }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Sub Navigation */}
      <div
        className="bg-white rounded-lg shadow-md border border-gray-200 animate-fadeInUp"
        style={{ marginBottom: "40px", padding: "0px" }}
      >
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === "products"
                ? "bg-black text-white border-b-2 border-black"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
            style={{ borderTopLeftRadius: "8px" }}
          >
            Products Management
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === "orders"
                ? "bg-black text-white border-b-2 border-black"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
            style={{ borderTopRightRadius: "8px" }}
          >
            Orders Management
          </button>
        </div>
      </div>

      {/* Conditional Table Rendering */}
      {activeTab === "products" && <AdminTable onEditProduct={handleEdit} />}
      {activeTab === "orders" && <OrderTable />}

    </div>
  );
}

export default ProductForm;
