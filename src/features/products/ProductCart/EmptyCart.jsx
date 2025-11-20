import { useNavigate } from 'react-router-dom';

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px' }} className='text-center text-gray-800 min-h-screen bg-white flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-light text-black' style={{ marginBottom: '16px' }}>Your Cart</h2>
      <div className='text-6xl' style={{ marginBottom: '16px' }}>🛒</div>
      <p className='text-gray-500 text-lg' style={{ marginBottom: '24px' }}>Your cart is empty.</p>
      <p className='text-gray-400 text-sm' style={{ marginBottom: '32px' }}>Add some products to get started!</p>
      <button onClick={() => navigate('/ProductsList')} className='border border-black bg-white text-black text-base font-normal cursor-pointer transition-all hover:bg-black hover:text-white' style={{ padding: '12px 24px' }}>
        Continue Shopping
      </button>
    </div>
  );
}

export default EmptyCart;
