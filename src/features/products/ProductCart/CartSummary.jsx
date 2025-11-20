import { useNavigate } from 'react-router-dom';

function CartSummary({ totalItems, totalPrice, loading, onClearCart }) {
  const navigate = useNavigate();

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
      <button onClick={onClearCart} disabled={loading} className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer transition-all hover:bg-black hover:text-white text-center disabled:opacity-50' style={{ padding: '12px 24px' }}>
        Clear Cart
      </button>
      <button onClick={() => navigate('/Payment')} className='w-full md:w-auto border border-black bg-white text-black text-base font-normal cursor-pointer transition-all hover:bg-black hover:text-white text-center' style={{ padding: '12px 24px' }}>
        Proceed to Payment - ₹{totalPrice.toFixed(2)}
      </button>
    </div>
  );
}

export default CartSummary;
