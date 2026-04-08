/**
 * Razorpay Payment Integration
 */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!razorpayKey || razorpayKey === 'your_test_key_id_here') {
    onFailure('Razorpay key not configured. Please add VITE_RAZORPAY_KEY_ID to .env file');
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    onFailure('Razorpay SDK not loaded. Please check your internet connection.');
    return;
  }

  const options = {
    key: razorpayKey,
    amount: Math.round(amount * 100), // Razorpay expects amount in paise (₹1 = 100 paise)
    currency: currency,
    name: 'Clothing Store',
    description: `Order #${orderId}`,
    image: '/Logo_Clothing.png',
    // Note: order_id removed - not needed for basic integration
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    notes: {
      order_id: orderId,
    },
    theme: {
      color: '#000000', // Black theme matching your website
    },
    handler: function (response) {
      // Payment successful
      // Fix scroll freeze by restoring body overflow
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id || orderId,
        razorpay_signature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: function () {
        // User closed the payment modal
        // Fix scroll freeze by restoring body overflow
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        onFailure('Payment cancelled by user');
      },
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response) {
      // Payment failed
      // Fix scroll freeze by restoring body overflow
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      onFailure(response.error.description || 'Payment failed');
    });

    razorpay.open();
  } catch (error) {
    onFailure(`Error opening Razorpay: ${error.message}`);
  }
};
