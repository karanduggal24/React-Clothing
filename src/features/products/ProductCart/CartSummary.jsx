import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { selectCartItems, updateQuantity, removeFromCart } from '../../Slices/CartSlice';
import { productsApi } from '../../../config/api';

function CartSummary({ totalItems, totalPrice, loading, onClearCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const [checking, setChecking] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to payment.");
      navigate('/login');
      return;
    }

    setChecking(true);
    try {
      // Fetch live stock for all cart items in parallel
      const stockChecks = await Promise.all(
        cartItems.map((item) => productsApi.getById(item.id))
      );

      const issues = [];

      stockChecks.forEach((product, i) => {
        const cartItem = cartItems[i];
        const available = product.Quantity ?? product.stockQuantity ?? 0;

        if (available <= 0) {
          // Out of stock — remove from cart
          dispatch(removeFromCart(cartItem.id));
          issues.push(`"${cartItem.name}" is out of stock and was removed from your cart.`);
        } else if (cartItem.quantity > available) {
          // Requested more than available — adjust quantity
          dispatch(updateQuantity({ productId: cartItem.id, quantity: available }));
          issues.push(`"${cartItem.name}" quantity adjusted to ${available} (only ${available} left in stock).`);
        }
      });

      if (issues.length > 0) {
        issues.forEach((msg) => toast.warning(msg, { autoClose: 5000 }));
        // Don't proceed — let user review the updated cart
        return;
      }

      navigate('/Payment');
    } catch (error) {
      toast.error("Failed to verify stock. Please try again.");
      console.error("Stock check failed:", error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center border border-black bg-white gap-4' style={{ marginTop: '32px', padding: '20px' }}>
      <div className='text-gray-800 w-full md:w-auto'>
        <div className='text-base' style={{ marginBottom: '4px' }}>
          <strong className='text-black font-medium'>Items:</strong> {totalItems}
        </div>
        <div className='text-base'>
          <strong className='text-black font-medium'>Total:</strong> Rs {totalPrice}
        </div>
      </div>

      <button
        onClick={onClearCart}
        disabled={loading || checking}
        className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer transition-all hover:bg-black hover:text-white text-center disabled:opacity-50'
        style={{ padding: '12px 24px' }}
      >
        Clear Cart
      </button>

      {isAuthenticated ? (
        <button
          onClick={handleCheckout}
          disabled={loading || checking}
          className='w-full md:w-auto border border-black bg-black text-white text-base font-normal cursor-pointer transition-all hover:bg-white hover:text-black text-center disabled:opacity-50'
          style={{ padding: '12px 24px' }}
        >
          {checking ? 'Checking stock...' : `Proceed to Payment - ₹${totalPrice.toFixed(2)}`}
        </button>
      ) : (
        <button
          onClick={handleCheckout}
          className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer transition-all hover:bg-black hover:text-white text-center'
          style={{ padding: '12px 24px' }}
        >
          Login to Checkout
        </button>
      )}
    </div>
  );
}

export default CartSummary;
