import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserInfo,
  setFormValid,
  selectUserInfo,
  resetPaymentForm,
} from "../Slices/PaymentFormSlice";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  clearCart,
  clearCartBackend,
} from "../Slices/CartSlice";
import { addOrder } from "../Slices/OrdersSlice";
import { updateProductStock } from "../Slices/AddProductSlice";
import { toast } from "react-toastify";
import { initiateRazorpayPayment } from "../../utils/razorpay";
import AddressForm from "./AddressForm";
import PaymentMethodSelector from "./PaymentMethodSelector";

function PaymentDetailsForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [formErrors, setFormErrors] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (currentUserId !== null && currentUserId !== user.id) dispatch(resetPaymentForm());
      setCurrentUserId(user.id);
    } else {
      if (currentUserId !== null) {
        dispatch(resetPaymentForm());
        setCurrentUserId(null);
      }
    }
  }, [isAuthenticated, user, currentUserId, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const updates = {};
      if (user.name && userInfo.name !== user.name) updates.name = user.name;
      if (user.email && userInfo.email !== user.email) updates.email = user.email;
      if (Object.keys(updates).length > 0) dispatch(updateUserInfo(updates));
    }
  }, [isAuthenticated, user, dispatch, userInfo.name, userInfo.email]);

  const handleUserInfoChange = (field, value) => {
    dispatch(updateUserInfo({ [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!userInfo.name.trim()) errors.name = "Full name is required";
    if (!userInfo.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userInfo.email)) errors.email = "Email is invalid";
    if (!userInfo.phone.trim()) errors.phone = "Phone number is required";
    if (!userInfo.state.trim()) errors.state = "State is required";
    if (!userInfo.city.trim()) errors.city = "City is required";
    if (!userInfo.pincode.trim()) errors.pincode = "Pincode is required";
    if (!userInfo.address.trim()) errors.address = "Address is required";
    if (cartItems.length === 0) { toast.error("Your cart is empty!"); return false; }
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    dispatch(setFormValid(isValid));
    return isValid;
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isProcessing) setIsProcessing(false);
  }, [countdown, isProcessing]);
  const saveOrder = async (orderId, status, paymentId = null) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      await fetch(`${baseUrl}/orders/`, {
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
            id: item.id, name: item.name, price: item.price,
            quantity: item.quantity, category: item.category, img: item.img
          })),
          total_items: totalItems,
          total_price: totalPrice,
          status: status
        })
      });
      dispatch(addOrder({
        orderId, userInfo, paymentInfo: { paymentId },
        orderInfo: { items: cartItems, totalItems, totalPrice },
        orderDate: new Date().toISOString(), status: status,
      }));
      for (const item of cartItems) {
        await fetch(`${baseUrl}/products/${item.id}/reduce-stock?quantity=${item.quantity}`, { method: 'PATCH' });
        dispatch(updateProductStock({ productId: item.id, quantity: item.quantity }));
      }
      dispatch(clearCart());
      await dispatch(clearCartBackend()).unwrap();
      sessionStorage.removeItem('products');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) {
      toast.info(`Please wait ${countdown} seconds before submitting again`);
      return;
    }
    if (validateForm()) {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      if (paymentMethod === 'razorpay') {
        initiateRazorpayPayment({
          amount: totalPrice, orderId, customerName: userInfo.name,
          customerEmail: userInfo.email, customerPhone: userInfo.phone,
          onSuccess: async (paymentData) => {
            setIsProcessing(true);
            setCountdown(5);
            await saveOrder(orderId, 'Paid', paymentData.razorpay_payment_id);
            toast.success("Payment successful!");
            setTimeout(() => navigate('/order-confirmed'), 1500);
          },
          onFailure: (error) => {
            toast.error(`Payment failed: ${error}`);
            setIsProcessing(false);
            setCountdown(0);
          },
        });
        return;
      }
      setIsProcessing(true);
      setCountdown(5);
      try {
        await saveOrder(orderId, 'Confirmed', null);
        toast.success("Order placed successfully!");
        setTimeout(() => navigate('/order-confirmed'), 1500);
      } catch (error) {
        toast.error("Failed to process order. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <form className="flex flex-col" style={{ gap: "1.5rem" }} onSubmit={handleSubmit}>
        <AddressForm
          userInfo={userInfo}
          formErrors={formErrors}
          handleUserInfoChange={handleUserInfoChange}
          isAuthenticated={isAuthenticated}
          user={user}
        />
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-black text-white border-2 border-black tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ padding: "1rem 1.5rem", marginTop: "1.5rem" }}
        >
          {isProcessing 
            ? `Processing... (${countdown}s)` 
            : paymentMethod === 'razorpay'
              ? `Pay ₹${totalPrice.toFixed(2)} with Razorpay`
              : `Place Order - ₹${totalPrice.toFixed(2)} (Cash on Delivery)`
          }
        </button>
      </form>
    </div>
  );
}

export default PaymentDetailsForm;
