import React, { useEffect } from 'react'
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

function ProductCart() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalItems = useSelector(selectCartTotalItems)
  const totalPrice = useSelector(selectCartTotalPrice)

  useEffect(() => {
    document.title = `Clothing Store - Cart (${totalItems})`
  }, [totalItems])

  if (cartItems.length === 0) {
    return (
      <div
        style={{ padding: '24px' }}
        className='text-center text-gray-800 min-h-screen bg-white flex flex-col items-center justify-center'
      >
        <h2 className='text-2xl font-light text-black mb-2'>Cart</h2>
        <p className='text-gray-500 text-base'>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div
      style={{ padding: '24px' }}
      className='bg-white min-h-screen'
    >
      <h2 className='text-2xl md:text-[28px] font-light text-black border-b border-black pb-2 mb-6'>
        Cart
      </h2>

      <div className='flex flex-col gap-4'>
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{ padding: '20px', marginBottom: '16px' }}
            className='border border-black bg-white transition-all duration-200 ease-in-out hover:shadow-md 
            flex flex-col md:flex-row md:items-center gap-4 md:gap-5'
          >
            {/* Product Image */}
            <div
              className='w-full md:w-20 h-40 md:h-20 bg-cover bg-center bg-gray-100 border border-gray-200 rounded-md'
              style={{ backgroundImage: item.img ? `url(${item.img})` : 'none' }}
            />

            {/* Product Details */}
            <div className='flex-1 text-gray-800'>
              <div className='font-medium text-lg text-black mb-1'>{item.name}</div>
              <div className='text-gray-600 text-sm mb-1'>{item.category}</div>
              <div className='text-black font-medium text-base'>Rs {item.price}</div>
            </div>

            {/* Quantity Controls */}
            <div className='flex items-center gap-3'>
              <button
                onClick={() => dispatch(decrementQuantity(item.id))}
                className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center 
                font-light text-base transition-all hover:bg-black hover:text-white'
              >
                -
              </button>
              <span className='min-w-6 text-center font-medium text-black'>{item.quantity}</span>
              <button
                onClick={() => dispatch(incrementQuantity(item.id))}
                className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center 
                font-light text-base transition-all hover:bg-black hover:text-white'
              >
                +
              </button>
            </div>

            {/* Price & Remove (stacked on mobile) */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-5 w-full md:w-auto'>
              <div className='text-right md:text-right font-medium text-black text-base'>
                Rs {item.price * item.quantity}
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{ padding: '8px 16px' }}
                className='border border-black bg-white text-black text-sm font-normal cursor-pointer 
                transition-all hover:bg-black hover:text-white self-end md:self-auto'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div
        style={{ marginTop: '32px', padding: '20px' }}
        className='flex flex-col md:flex-row justify-between items-start md:items-center border border-black bg-white gap-4'
      >
        <div className='text-gray-800 w-full md:w-auto'>
          <div className='text-base mb-1'>
            <strong className='text-black font-medium'>Items:</strong> {totalItems}
          </div>
          <div className='text-base'>
            <strong className='text-black font-medium'>Total:</strong> Rs {totalPrice}
          </div>
        </div>

        <button
          style={{ padding: '12px 24px' }}
          onClick={() => dispatch(clearCart())}
          className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer 
          transition-all hover:bg-black hover:text-white text-center'
        >
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCart
