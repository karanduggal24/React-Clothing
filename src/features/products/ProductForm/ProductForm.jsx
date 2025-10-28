import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, deleteProduct, updateProduct } from "../../Slices/AddProductSlice";
import { nanoid } from "@reduxjs/toolkit";
import styles from "./ProductForm.module.css";
// import { styled } from '@mui/material/styles';
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import Button from '@mui/material/Button';
// import { TypingAnimation } from "@/registry/magicui/typing-animation"
function ProductForm() {
  
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [NewName, setNewName] = useState("");
  const [NewPrice, setNewPrice] = useState('');
  const [NewCategory, setNewCategory] = useState("");
  const [NewImage, setNewImage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleImageChange = (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      setNewImage("");
      return;
    }
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = typeof e.target?.result === 'string' ? e.target.result : '';
      setNewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditingId(product.id);
    setNewName(product.name);
    setNewPrice(product.price);
    setNewCategory(product.category);
    setNewImage(product.img);
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (!NewName.trim() || !NewPrice.trim() || !NewCategory.trim()) {
      alert('Enter Data in all the fields')
      return;
    }

    if (editMode && editingId) {
      const updatedProduct = {
        id: editingId,
        name: NewName,
        price: NewPrice,
        category: NewCategory,
        img: NewImage,
      };
      dispatch(updateProduct(updatedProduct));
      setEditMode(false);
      setEditingId(null);
    } else {
      const newProduct = {
        id: nanoid(),
        name: NewName,
        price: NewPrice,
        category: NewCategory,
        img: NewImage,
      };
      dispatch(addProduct(newProduct));
    }

    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setNewImage("");
  };


  const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>Add Product </h2>
        
      </div>
      <div className={styles.formContainer}>
      <form onSubmit={handleAddProduct} className={styles.form}>
        <input
          type="text"
          value={NewName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Product Name"
          className={styles.input}
        />
        <input
          type="number"
          value={NewPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          placeholder="Price in INR"
          className={styles.input}
        />
        <input
          type="text"
          value={NewCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category"
          className={styles.input}
        />
      <div>

        <Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
  startIcon={<CloudUploadIcon />}
>
  Upload files
  <VisuallyHiddenInput
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />
</Button>
        
      </div>

        <button type="submit" className={styles.submitButton}>
          {editMode ? 'Update Product' : 'Add Product' }
        </button>
        {editMode && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              setEditMode(false);
              setEditingId(null);
              setNewName("");
              setNewPrice("");
              setNewCategory("");
              setNewImage("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      </div>

      <div className={styles.productsSection}>
        <h3 className={styles.productsHeading}>Products List:</h3>
        {products.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Product Name</th>
                  <th>Price in Rs</th>
                  <th>Category</th>
                  <th>Action</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
              
              {products.map((product) => (
                <tr key={product.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    {product.name} 
                  </td>
                  <td className={styles.tableCell}>
                    {product.price}
                  </td>
                  <td className={styles.tableCell}>
                    {product.category} 
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => handleEdit(product)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => dispatch(deleteProduct(product.id))}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className={styles.tdimage}> <img src={product.img} alt="" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className={styles.noProducts}>No products yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default ProductForm;
