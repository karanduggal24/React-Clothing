import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
  addProductToBackend,
  updateProductInBackend,
  fetchProducts,
} from "../../Slices/AddProductSlice";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import AdminTable from "./AdminTable";

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
    // Fetch products from backend on component mount
    dispatch(fetchProducts());
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
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      setNewImage("");
      setImagePreview("");
      return;
    }

    const file = fileList[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/products/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Store the path returned from backend
      setNewImage(data.path);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setNewImage("");
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditingId(product.id);
    setNewId(product.id.toString());
    setNewName(product.name);
    setNewPrice(product.price.toString()); // Convert to string
    setNewCategory(product.category);
    setNewImage(product.img);
    setImagePreview(product.img); // Set preview for existing image
    setNewQuantity(product.stockQuantity.toString()); // Convert to string
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    
    // Convert to strings and validate
    const nameStr = String(NewName || '').trim();
    const priceStr = String(NewPrice || '').trim();
    const categoryStr = String(NewCategory || '').trim();
    const quantityStr = String(NewQuantity || '').trim();
    const idStr = String(NewId || '').trim();
    
    if (!nameStr || !priceStr || !categoryStr || !quantityStr || !idStr) {
      toast.error("Enter Data in all the fields");
      return;
    }

    // Check if ID already exists when adding new product
    if (!editMode && idStr) {
      const existingProduct = products.find(p => p.id === idStr);
      if (existingProduct) {
        toast.error("Product ID already exists. Please use a different ID.");
        return;
      }
    }

    if (editMode && editingId) {
      const updatedProduct = {
        id: editingId,
        name: NewName,
        price: parseInt(NewPrice),
        category: NewCategory,
        img: NewImage || '',
        stockQuantity: parseInt(NewQuantity),
        description: `${NewName} - ${NewCategory}`
      };
      
      console.log('Updating product:', updatedProduct);
      
      // Update in backend API
      try {
        const result = await dispatch(updateProductInBackend(updatedProduct)).unwrap();
        console.log('Update result:', result);
        toast.success("Product Updated Successfully in Database");
        
        // Refresh products list
        await dispatch(fetchProducts());
      } catch (error) {
        toast.error(`Failed to update product: ${error}`);
        console.error('Update error:', error);
        return;
      }
      
      setEditMode(false);
      setEditingId(null);
    } else {
      const newProduct = {
        id: NewId.trim(),
        name: NewName,
        price: parseInt(NewPrice),
        category: NewCategory,
        img: NewImage || '',
        stockQuantity: parseInt(NewQuantity),
        description: `${NewName} - ${NewCategory}`
      };
      
      // Add to backend API
      try {
        await dispatch(addProductToBackend(newProduct)).unwrap();
        toast.success("Product Added Successfully to Database");
        
        // Refresh products list
        await dispatch(fetchProducts());
      } catch (error) {
        toast.error(`Failed to add product: ${error}`);
        return;
      }
    }

    // Reset form
    setNewId("");
    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setNewImage("");
    setImagePreview("");
    setNewQuantity("");
    setEditMode(false);
    setEditingId(null);
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
      className="w-full mx-auto font-inter bg-white min-h-screen text-black relative"
      style={{ padding: "0 24px 24px 24px" }}
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

          <div className="flex flex-col gap-2">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              disabled={uploadingImage}
              className="bg-black! hover:bg-gray-800!"
              style={{ padding: "10px 16px" }}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
              />
            </Button>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2 relative">
                <img 
                  src={imagePreview.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${imagePreview}` : imagePreview}
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewImage("");
                    setImagePreview("");
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                  style={{ transform: 'translate(50%, -50%)' }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

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
                setImagePreview("");
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

      {/* Products Table */}
      <AdminTable onEditProduct={handleEdit} />

    </div>
  );
}

export default ProductForm;
