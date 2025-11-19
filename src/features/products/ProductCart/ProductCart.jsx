import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  fetchCartFromBackend,
  updateCartItemBackend,
  removeFromCartBackend,
  clearCartBackend,
  removeOutOfStockItems,
} from '../../Slices/CartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function ProductCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalItems = useSelector(selectCartTotalItems)
  const totalPrice = useSelector(selectCartTotalPrice)
  const loading = useSelector((state) => state.cart.loading)
  const synced = useSelector((state) => state.cart.synced)
  const products = useSelector((state) => state.products.products)

  useEffect(() => {
    document.title = `Clothing Store - Cart (${totalItems})`
    // Fetch cart from backend on mount if not synced
    if (!synced) {
      dispatch(fetchCartFromBackend()).catch(err => {
        console.error('Failed to fetch cart:', err);
        // Continue with local cart if backend fails
      });
    }
  }, [totalItems, synced, dispatch])

  // Don't auto-check stock on load - it causes issues with async loading
  // Stock is checked when user tries to increment quantity or checkout instead

  const handleIncrement = async (item) => {
    // Check if we can add more (stock limit check)
    if (item.quantity >= item.stockQuantity) {
      toast.warning(`${item.name} reached stock limit! Only ${item.stockQuantity} available.`, {
        autoClose: 2000,
      });
      return;
    }
    
    const newQuantity = item.quantity + 1;
    
    // Update local state first
    dispatch(incrementQuantity(item.id));
    
    // Then sync with backend
    if (item.cartItemId) {
      try {
        await dispatch(updateCartItemBackend({ 
          cartItemId: item.cartItemId, 
          quantity: newQuantity 
        })).unwrap();
      } catch (error) {
        console.error('Failed to update quantity in backend:', error);
      }
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      
      // Update local state first
      dispatch(decrementQuantity(item.id));
      
      // Then sync with backend
      if (item.cartItemId) {
        try {
          await dispatch(updateCartItemBackend({ 
            cartItemId: item.cartItemId, 
            quantity: newQuantity 
          })).unwrap();
        } catch (error) {
          console.error('Failed to update quantity in backend:', error);
        }
      }
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = async (item) => {
    if (item.cartItemId) {
      try {
        await dispatch(removeFromCartBackend(item.cartItemId)).unwrap();
      } catch (error) {
        console.error('Failed to remove item from backend:', error);
        // Still remove from local state
        dispatch(removeFromCart(item.id));
      }
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCartBackend()).unwrap();
      } catch (error) {
        console.error('Failed to clear cart from backend:', error);
        // Still clear local cart
        dispatch(clearCart());
      }
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  }

  if (cartItems.length === 0) {
    return (
      <div
        style={{ padding: '24px' }}
        className='text-center text-gray-800 min-h-screen bg-white flex flex-col items-center justify-center'
      >
        <h2
          className='text-2xl font-light text-black'
          style={{ marginBottom: '16px' }}
        >
          Your Cart
        </h2>
        <div className='text-6xl' style={{ marginBottom: '16px' }}>🛒</div>
        <p className='text-gray-500 text-lg' style={{ marginBottom: '24px' }}>Your cart is empty.</p>
        <p className='text-gray-400 text-sm' style={{ marginBottom: '32px' }}>Add some products to get started!</p>
        <button
          onClick={() => navigate('/ProductsList')}
          className='border border-black bg-white text-black text-base font-normal cursor-pointer 
          transition-all hover:bg-black hover:text-white'
          style={{ padding: '12px 24px' }}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div
      className='bg-white min-h-screen'
      style={{ padding: '24px' }}
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
            {/* Mobile Layout */}
            <div className='md:hidden'>
              <div className='flex items-center gap-3' style={{ padding: '12px' }}>
                <div className='w-20 h-20 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-gray-400 transition-colors'>
                  {item.img ? (
                    <img
                      onClick={handleProductClick.bind(null, item.id)}
                      src={item.img}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs'>
                      No Image
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-sm text-black truncate'>{item.name}</div>
                  <div className='text-gray-600 text-xs' style={{ marginBottom: '4px' }}>{item.category}</div>
                  <div className='text-black font-medium text-sm'>Rs {item.price}</div>
                </div>

                <div className='text-right'>
                  <div className='text-sm font-medium text-black'>
                    Rs {item.price * item.quantity}
                  </div>
                </div>
              </div>

              <div
                className='flex items-center justify-between border-t border-gray-100'
                style={{ padding: '8px 12px 12px 12px' }}
              >
                <div className='flex items-center gap-1 bg-gray-50 rounded-md' style={{ padding: '4px' }}>
                  <button
                    onClick={() => handleDecrement(item)}
                    disabled={loading}
                    className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center 
                    text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black disabled:opacity-50'
                  >
                    -
                  </button>
                  <span
                    className='text-sm font-medium text-black min-w-8 text-center'
                    style={{ padding: '0 8px' }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrement(item)}
                    disabled={loading}
                    className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center 
                    text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black disabled:opacity-50'
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item)}
                  disabled={loading}
                  className='text-xs border border-red-300 text-red-600 bg-red-50 rounded 
                  transition-all hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50'
                  style={{ padding: '4px 12px' }}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className='hidden md:flex md:items-center gap-5' style={{ padding: '20px' }}>
              <div 
                className='w-24 h-24 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-colors'
                onClick={handleProductClick.bind(null, item.id)}
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm'>
                    No Image
                  </div>
                )}
              </div>

              <div className='flex-1 text-gray-800'>
                <div className='font-medium text-lg text-black' style={{ marginBottom: '4px' }}>{item.name}</div>
                <div className='text-gray-600 text-sm' style={{ marginBottom: '4px' }}>{item.category}</div>
                <div className='text-black font-medium text-base'>Rs {item.price}</div>
                <div className='text-xs text-gray-500' style={{ marginTop: '4px' }}>
                  Stock: {item.stockQuantity > 0 ? item.stockQuantity : 'Out of stock'}
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  onClick={() => handleDecrement(item)}
                  disabled={loading}
                  className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center 
                  font-light text-base transition-all hover:bg-black hover:text-white disabled:opacity-50'
                >
                  -
                </button>
                <span className='min-w-6 text-center font-medium text-black'>{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item)}
                  disabled={loading}
                  className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center 
                  font-light text-base transition-all hover:bg-black hover:text-white disabled:opacity-50'
                >
                  +
                </button>
              </div>

              <div className='flex flex-row items-center justify-end gap-5'>
                <div className='text-right font-medium text-black text-base'>
                  Rs {item.price * item.quantity}
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  disabled={loading}
                  className='border border-black bg-white text-black text-sm font-normal cursor-pointer 
                  transition-all hover:bg-black hover:text-white disabled:opacity-50'
                  style={{ padding: '8px 16px' }}
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
        className='flex flex-col md:flex-row justify-between items-start md:items-center border border-black bg-white gap-4'
        style={{ marginTop: '32px', padding: '20px' }}
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
          onClick={handleClearCart}
          disabled={loading}
          className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer 
          transition-all hover:bg-black hover:text-white text-center disabled:opacity-50'
          style={{ padding: '12px 24px' }}
        >
          Clear Cart
        </button>
        <button
          onClick={() => navigate('/Payment')}
          className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer 
          transition-all hover:bg-black hover:text-white text-center'
          style={{ padding: '12px 24px' }}
        >
          Proceed to Payment - ₹{totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  )
}

export default ProductCart
