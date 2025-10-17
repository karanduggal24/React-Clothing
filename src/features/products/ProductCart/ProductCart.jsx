import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '../../Slices/CartSlice'

import styles from './ProductCart.module.css'

function ProductCart() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalItems = useSelector(selectCartTotalItems)
  const totalPrice = useSelector(selectCartTotalPrice)

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2>Cart</h2>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div 
              className={styles.itemImage}
              style={{ backgroundImage: item.img ? `url(${item.img})` : 'none' }}
            />
            <div className={styles.itemDetails}>
              <div className={styles.itemName}>{item.name}</div>
              <div>{item.category}</div>
              <div>Rs {item.price}</div>
            </div>
            <div className={styles.quantityControls}>
              <button 
                className={styles.quantityButton}
                onClick={() => dispatch(decrementQuantity(item.id))}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={() => dispatch(incrementQuantity(item.id))}
              >
                +
              </button>
            </div>
            <div className={styles.itemTotal}>Rs {item.price * item.quantity}</div>
            <button 
              className={styles.removeButton}
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className={styles.cartSummary}>
        <div>
          <div><strong>Items:</strong> {totalItems}</div>
          <div><strong>Total:</strong> Rs {totalPrice}</div>
        </div>
        <button 
          className={styles.clearButton}
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCart