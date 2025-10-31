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
        <h2 className='text-2xl font-light text-black' style={{ marginBottom: '8px' }}>Cart</h2>
        <p className='text-gray-500 text-base'>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div
      style={{ padding: '24px' }}
      className='bg-white min-h-screen'
    >
      <h2 
        className='text-2xl md:text-[28px] font-light text-black border-b border-black'
        style={{ paddingBottom: '8px', marginBottom: '24px' }}
      >
        Cart
      </h2>

      <div className='flex flex-col gap-2 md:gap-4'>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className='border border-black bg-white transition-all duration-200 ease-in-out hover:shadow-md'
          >
            {/* Mobile List Layout */}
            <div className='md:hidden'>
              {/* Top Row: Image, Info, Price */}
              <div className='flex items-center gap-3' style={{ padding: '12px' }}>
                {/* Small Image */}
                <div className='w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0'>
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs'>
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-sm text-black truncate'>{item.name}</div>
                  <div className='text-gray-600 text-xs' style={{ marginBottom: '4px' }}>{item.category}</div>
                  <div className='text-black font-medium text-sm'>Rs {item.price}</div>
                </div>

                {/* Total Price */}
                <div className='text-right'>
                  <div className='text-sm font-medium text-black'>
                    Rs {item.price * item.quantity}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Quantity Controls & Remove */}
              <div className='flex items-center justify-between border-t border-gray-100' style={{ paddingLeft: '12px', paddingRight: '12px', paddingBottom: '12px', paddingTop: '8px' }}>
                {/* Quantity Controls */}
                <div className='flex items-center gap-1 bg-gray-50 rounded-md' style={{ padding: '4px' }}>
                  <button
                    onClick={() => dispatch(decrementQuantity(item.id))}
                    className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center 
                    text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black'
                  >
                    -
                  </button>
                  <span className='text-sm font-medium text-black min-w-8 text-center' style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(incrementQuantity(item.id))}
                    className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center 
                    text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black'
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className='text-xs border border-red-300 text-red-600 bg-red-50 rounded 
                  transition-all hover:bg-red-600 hover:text-white hover:border-red-600'
                  style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '4px', paddingBottom: '4px' }}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Desktop Card Layout */}
            <div className='hidden md:flex md:items-center gap-5' style={{ padding: '20px' }}>
              {/* Product Image */}
              <div className='w-20 h-20 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden'>
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm'>
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className='flex-1 text-gray-800'>
                <div className='font-medium text-lg text-black' style={{ marginBottom: '4px' }}>{item.name}</div>
                <div className='text-gray-600 text-sm' style={{ marginBottom: '4px' }}>{item.category}</div>
                <div className='text-black font-medium text-base'>Rs {item.price}</div>
                <div className='text-xs text-gray-500' style={{ marginTop: '4px' }}>
                  Stock: {item.stockQuantity > 0 ? item.stockQuantity : 'Out of stock'}
                </div>
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

              {/* Price & Remove */}
              <div className='flex flex-row items-center justify-end gap-5'>
                <div className='text-right font-medium text-black text-base'>
                  Rs {item.price * item.quantity}
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  style={{ padding: '8px 16px' }}
                  className='border border-black bg-white text-black text-sm font-normal cursor-pointer 
                  transition-all hover:bg-black hover:text-white'
                >
                  Remove
                </button>
              </div>
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
          <div className='text-base' style={{ marginBottom: '4px' }}>
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
