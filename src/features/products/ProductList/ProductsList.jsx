import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct } from '../../Slices/AddProductSlice';
import { addToCart, selectCartItems } from '../../Slices/CartSlice';
import Styles from './ProductList.module.css'

function ProductsList() {
    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
    console.log(products)
    const cartItems = useSelector(selectCartItems)    
  return (
    <div className={Styles.main}>
      <h2>Products List</h2>
      <div className={Styles.cardcontainer}>
        {products.map((product) => (
              <div
                className={Styles.card}
                key={product.id}
                // style={product.img ? { backgroundImage: `url(${product.img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                <div className={Styles.image}
                style={product.img?{backgroundImage: `url(${product.img})`, backgroundSize: 'cover'}:undefined}></div>
                <div className={Styles.info}>
                <div className={Styles.name}>
                <b><p>{product.name}</p></b>
                </div >
                <div className={Styles.category}>
                <p>{product.category}</p>
                </div>
                <div className={Styles.price}>
                <p>{product.price} Rs</p>
                </div>
                <button onClick={() => dispatch(addToCart(product))} className={Styles.primary}>
                  Add To Cart
                </button>
                </div>
              </div>
            ))}
            {/* <button onClick={()=>{console.log(cartItems)}}>
              View Cart
            </button> */}
      </div>
    </div>
  );
}

export default ProductsList;
