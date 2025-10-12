import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct } from '../../Slices/AddProductSlice';
import Styles from './ProductList.module.css'

function ProductsList() {
    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
    console.log(products)
    
  return (
    <div className={Styles.main}>
      <h2>Products List</h2>
      <div className={Styles.cardcontainer}>
        {products.map((product) => (
              <div className={Styles.card} key={product.id}>
                <div className={Styles.name}>
                <h4>{product.name}</h4>
                </div >
                <div className={Styles.category}>
                <h4>{product.category}</h4>
                </div>
                <div className={Styles.price}>
                <h4>{product.price} Rs</h4>
                </div>
              </div>
            ))}
      </div>
            
    </div>
  );
}

export default ProductsList;
