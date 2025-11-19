# Razorpay Integration Guide

## Setup Complete ✅

I've already done:
1. ✅ Installed razorpay package
2. ✅ Added Razorpay script to index.html
3. ✅ Created razorpay.js utility file
4. ✅ Added VITE_RAZORPAY_KEY_ID to .env
5. ✅ Imported Razorpay in PaymentDetailsForm

## Next Steps

### 1. Get Your Razorpay Test Keys

1. Go to https://razorpay.com/
2. Sign up (free, no credit card needed)
3. Go to Dashboard → Settings → API Keys
4. Click "Generate Test Key"
5. Copy the **Key ID** (starts with `rzp_test_`)

### 2. Add Key to .env

Replace in `.env`:
```
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

### 3. Add Payment Method Selection UI

Add this in PaymentDetailsForm.jsx before the submit button:

```jsx
{/* Payment Method Selection */}
<div className="space-y-4">
  <h2 className="text-2xl text-black tracking-wider border-b-2 border-black pb-2">
    Payment Method
  </h2>
  
  <div className="flex flex-col gap-3">
    <label className="flex items-center gap-3 p-4 border-2 border-black rounded cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="paymentMethod"
        value="razorpay"
        checked={paymentMethod === 'razorpay'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-5 h-5"
      />
      <div>
        <div className="font-semibold">Pay Online (Razorpay)</div>
        <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
      </div>
    </label>
    
    <label className="flex items-center gap-3 p-4 border-2 border-black rounded cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="paymentMethod"
        value="cod"
        checked={paymentMethod === 'cod'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-5 h-5"
      />
      <div>
        <div className="font-semibold">Cash on Delivery</div>
        <div className="text-sm text-gray-600">Pay when you receive</div>
      </div>
    </label>
  </div>
</div>
```

### 4. Update handleSubmit Function

Replace the handleSubmit function with this:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isProcessing) {
    toast.info(`Please wait ${countdown} seconds before submitting again`);
    return;
  }

  if (validateForm()) {
    setIsProcessing(true);
    setCountdown(5);
    
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    if (paymentMethod === 'razorpay') {
      // Razorpay Payment
      initiateRazorpayPayment({
        amount: totalPrice,
        orderId: orderId,
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        customerPhone: userInfo.phone,
        onSuccess: async (paymentData) => {
          // Payment successful, save order
          await saveOrder(orderId, 'Paid', paymentData.razorpay_payment_id);
          toast.success("Payment successful!");
          navigate('/order-confirmed');
        },
        onFailure: (error) => {
          toast.error(`Payment failed: ${error}`);
          setIsProcessing(false);
          setCountdown(0);
        },
      });
    } else {
      // Cash on Delivery
      await saveOrder(orderId, 'Confirmed', null);
      toast.success("Order placed successfully!");
      setTimeout(() => navigate('/order-confirmed'), 1500);
    }
  } else {
    toast.error("Please fill in all required fields correctly");
  }
};

// Helper function to save order
const saveOrder = async (orderId, status, paymentId) => {
  try {
    // Save to backend
    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        customer_name: userInfo.name,
        customer_email: userInfo.email,
        customer_phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        state: userInfo.state,
        pincode: userInfo.pincode,
        country: userInfo.country || 'India',
        order_items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          img: item.img
        })),
        total_items: totalItems,
        total_price: totalPrice,
        status: status,
        payment_id: paymentId
      })
    });
    
    // Add to local state
    dispatch(addOrder({
      orderId,
      userInfo,
      paymentInfo: { paymentId },
      orderInfo: { items: cartItems, totalItems, totalPrice },
      orderDate: new Date().toISOString(),
      status: status,
    }));
    
    // Reduce stock
    for (const item of cartItems) {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/products/${item.id}/reduce-stock?quantity=${item.quantity}`,
        { method: 'PATCH' }
      );
      dispatch(updateProductStock({ productId: item.id, quantity: item.quantity }));
    }
    
    // Clear cart
    dispatch(clearCart());
    await dispatch(clearCartBackend()).unwrap();
    sessionStorage.removeItem('products');
  } catch (error) {
    console.error('Error saving order:', error);
  }
};
```

### 5. Update Button Text

The button text should change based on payment method:

```jsx
{isProcessing 
  ? `Processing... (${countdown}s)` 
  : paymentMethod === 'razorpay'
    ? `Pay ₹${totalPrice.toFixed(2)} with Razorpay`
    : `Place Order - ₹${totalPrice.toFixed(2)} (Cash on Delivery)`
}
```

## Testing

1. Use test card: **4111 1111 1111 1111**
2. Any future expiry date
3. Any CVV
4. Any name

## Features

✅ Razorpay online payment
✅ Cash on Delivery option
✅ Test mode (no real money)
✅ Professional payment UI
✅ Order tracking
✅ Stock reduction
✅ Cart clearing

## Production

To go live:
1. Get Live API keys from Razorpay
2. Complete KYC verification
3. Replace test key with live key
4. Pay 2% transaction fee

Your integration is ready! Just add your Razorpay Key ID and implement the code above.
