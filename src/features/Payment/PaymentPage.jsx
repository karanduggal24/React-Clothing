import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '../Slices/CartSlice';
import PaymentDetailsForm from './PaymentDetailsForm';

function PaymentPage() {
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  useEffect(() => {
    document.title = `Clothing Store - Payment Page`;
    console.log("Payment Page Loaded");
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  return (
    <div
      className='bg-white min-h-screen'
      style={{ padding: '25px'}}
    >
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Payment Form Section */}
          <div className='flex-1 lg:w-[70%]'>
            <div className='border border-black bg-white shadow-lg'>
              <PaymentDetailsForm />
            </div>
          </div>
          
          {/* Cart Summary Section */}
          <div className='lg:w-[30%]'>
            <h2
                className='text-2xl text-black tracking-wider'
                style={{ paddingBottom: '1.5px', marginBottom: '3px' }}
              >
                Order Summary
              </h2>
            <div
              className='border border-dotted rounded border-black bg-blue-50 shadow-lg top-4'
              style={{ padding: '3px' }}
            >
              
              
              {/* Cart Items */}
              <div
                className='space-y-4'
                style={{ marginBottom: '3px' }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-4 border-b border-gray-200'
                    style={{ padding: '3px' }}
                  >
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className='w-16 h-16 object-cover border-2 border-black shrink-0' 
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-black uppercase tracking-wide truncate'>
                        {item.name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-bold text-black'>
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div
                className='space-y-3 border-t-2 border-black'
                style={{ paddingTop: '1rem' }}
              >
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-black uppercase tracking-wider'>
                    Total Items:
                  </span>
                  <span className='text-sm font-bold text-black'>
                    {totalItems}
                  </span>
                </div>
                
                <div className='flex justify-between items-center text-lg'>
                  <span className='font-bold text-black uppercase tracking-wider'>
                    Total Amount:
                  </span>
                  <span className='font-bold text-black'>
                    Rs {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
