import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

function ProductFormInputs({
  NewId, setNewId,
  NewName, setNewName,
  NewPrice, setNewPrice,
  NewCategory, setNewCategory,
  NewQuantity, setNewQuantity,
  imagePreview,
  uploadingImage,
  editMode,
  categories,
  onImageChange,
  onSubmit,
  onCancel
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: "32px", marginBottom: "32px" }}>
      <h3 className="text-2xl font-light text-center" style={{ marginBottom: "24px" }}>
        {editMode ? "Edit Product" : "Add New Product"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "20px" }}>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Product ID</label>
          <input type="text" placeholder="Enter Product ID" value={NewId} onChange={(e) => setNewId(e.target.value)} disabled={editMode} className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed" style={{ padding: "10px" }} required />
        </div>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" placeholder="Enter Product Name" value={NewName} onChange={(e) => setNewName(e.target.value)} className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black" style={{ padding: "10px" }} required />
        </div>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Price (₹)</label>
          <input type="number" placeholder="Enter Price" value={NewPrice} onChange={(e) => setNewPrice(e.target.value)} className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black" style={{ padding: "10px" }} required min="0" step="0.01" />
        </div>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select value={NewCategory} onChange={(e) => setNewCategory(e.target.value)} className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black" style={{ padding: "10px" }} required>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" placeholder="Enter Stock Quantity" value={NewQuantity} onChange={(e) => setNewQuantity(e.target.value)} className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black" style={{ padding: "10px" }} required min="0" />
        </div>
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <label className="text-sm font-medium text-gray-700">Product Image</label>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={uploadingImage} sx={{ padding: "10px", borderColor: "#000", color: "#000", "&:hover": { borderColor: "#000", backgroundColor: "#f5f5f5" } }}>
            {uploadingImage ? "Uploading..." : "Upload Image"}
            <VisuallyHiddenInput type="file" accept="image/*" onChange={onImageChange} />
          </Button>
          {imagePreview && (
            <div className="border border-gray-200 rounded overflow-hidden" style={{ marginTop: "8px" }}>
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center" style={{ gap: "12px", marginTop: "24px" }}>
        <button type="submit" disabled={uploadingImage} className="border-2 border-black bg-white text-black text-base font-medium cursor-pointer transition-all hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" style={{ padding: "10px 24px" }}>
          {editMode ? "Update Product" : "Add Product"}
        </button>
        {editMode && (
          <button type="button" onClick={onCancel} className="border-2 border-gray-400 bg-white text-gray-700 text-base font-medium cursor-pointer transition-all hover:bg-gray-100" style={{ padding: "10px 24px" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductFormInputs;
