import { useEffect, useState } from 'react';

function CartDebug() {
  const [status, setStatus] = useState('Checking...');
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        // Test root endpoint
        const rootResponse = await fetch('http://127.0.0.1:8000/');
        const rootData = await rootResponse.json();
        console.log('Root endpoint:', rootData);

        // Test cart endpoint
        const cartResponse = await fetch('http://127.0.0.1:8000/cart/');
        const cartData = await cartResponse.json();
        console.log('Cart endpoint:', cartData);

        setCartData(cartData);
        setStatus('✅ Backend is working!');
      } catch (err) {
        console.error('Backend test failed:', err);
        setError(err.message);
        setStatus('❌ Backend connection failed');
      }
    };

    testBackend();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Cart Backend Debug</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      {cartData && (
        <div>
          <p><strong>Cart Items:</strong> {cartData.length}</p>
          <pre>{JSON.stringify(cartData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CartDebug;
