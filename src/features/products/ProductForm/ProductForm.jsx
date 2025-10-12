import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, deleteProduct } from "../../Slices/AddProductSlice";
import { nanoid } from "@reduxjs/toolkit";
import styles from "./ProductForm.module.css";

function ProductForm() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [NewName, setNewName] = useState("");
  const [NewPrice, setNewPrice] = useState('');
  const [NewCategory, setNewCategory] = useState("");
  const handleAddProduct = (event) => {
    event.preventDefault();
    if (!NewName.trim() || !NewPrice.trim() || !NewCategory.trim()) {
      alert('Enter Data in all the fields')
      return;
    }

    const newProduct = {
      id: nanoid(),
      name: NewName,
      price: NewPrice,
      category: NewCategory,
    };
    dispatch(addProduct(newProduct));
    setNewName("");
    setNewPrice(0);
    setNewCategory("");
  };
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

        <button type="submit" className={styles.submitButton}>Add Product</button>
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
                    <button 
                      onClick={() => dispatch(deleteProduct(product.id))}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
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
