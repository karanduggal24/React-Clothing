import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserInfo,
  updatePaymentInfo,
  setFormValid,
  selectUserInfo,
  selectPaymentInfo,
} from "../Slices/PaymentFormSlice";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  clearCart,
} from "../Slices/CartSlice";
import { addOrder } from "../Slices/OrdersSlice";
import { toast } from "react-toastify";

function PaymentDetailsForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const paymentInfo = useSelector(selectPaymentInfo);
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const [formErrors, setFormErrors] = useState({});

  // Handle user info changes
  const handleUserInfoChange = (field, value) => {
    dispatch(updateUserInfo({ [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle payment info changes
  const handlePaymentInfoChange = (field, value) => {
    dispatch(updatePaymentInfo({ [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // User info validation
    if (!userInfo.name.trim()) errors.name = "Full name is required";
    if (!userInfo.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userInfo.email))
      errors.email = "Email is invalid";
    if (!userInfo.phone.trim()) errors.phone = "Phone number is required";
    if (!userInfo.state.trim()) errors.state = "State is required";
    if (!userInfo.city.trim()) errors.city = "City is required";
    if (!userInfo.pincode.trim()) errors.pincode = "Pincode is required";
    if (!userInfo.address.trim()) errors.address = "Address is required";

    // Payment info validation
    if (!paymentInfo.cardholderName.trim())
      errors.cardholderName = "Cardholder name is required";
    if (!paymentInfo.cardNumber.trim())
      errors.cardNumber = "Card number is required";
    else if (paymentInfo.cardNumber.replace(/\s/g, "").length < 16)
      errors.cardNumber = "Card number must be 16 digits";
    if (!paymentInfo.expiryDate.trim())
      errors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate))
      errors.expiryDate = "Expiry date must be MM/YY format";
    if (!paymentInfo.cvv.trim()) errors.cvv = "CVV is required";
    else if (paymentInfo.cvv.length < 3)
      errors.cvv = "CVV must be at least 3 digits";

    // Cart validation
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }

    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    dispatch(setFormValid(isValid));
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Add order to orders slice for admin tracking
      dispatch(
        addOrder({
          userInfo,
          paymentInfo: {
            cardholderName: paymentInfo.cardholderName,
            // Don't store sensitive payment info
          },
          orderInfo: {
            items: cartItems,
            totalItems,
            totalPrice,
          },
          orderDate: new Date().toISOString(),
          status: "Confirmed",
        })
      );

      // Show success message
      toast.success("Payment processed successfully!");

      // Clear cart after successful payment
      dispatch(clearCart());

      // Navigate to order confirmed page
      setTimeout(() => {
        navigate('/order-confirmed');
      }, 1500); // Small delay to show the success toast

      console.log("Payment completed:", {
        userInfo,
        paymentInfo,
        orderInfo: { items: cartItems, totalItems, totalPrice },
      });
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h2
            className="text-2xl text-black tracking-wider border-b-2 border-black"
            style={{ paddingBottom: "0.5rem" }}
          >
            Address Details
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange("name", e.target.value)}
                className={`border-2 ${
                  formErrors.name ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.name && (
                <span className="text-red-500 text-xs">{formErrors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={userInfo.email}
                onChange={(e) => handleUserInfoChange("email", e.target.value)}
                className={`border-2 ${
                  formErrors.email ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.email && (
                <span className="text-red-500 text-xs">{formErrors.email}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                value={userInfo.phone}
                onChange={(e) => handleUserInfoChange("phone", e.target.value)}
                className={`border-2 ${
                  formErrors.phone ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.phone && (
                <span className="text-red-500 text-xs">{formErrors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Country
              </label>
              <input
                type="text"
                placeholder="Enter Country"
                value={userInfo.country}
                onChange={(e) =>
                  handleUserInfoChange("country", e.target.value)
                }
                className="border-2 border-black bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors"
                style={{ padding: "0.75rem" }}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                State *
              </label>
              <input
                type="text"
                placeholder="Enter State"
                value={userInfo.state}
                onChange={(e) => handleUserInfoChange("state", e.target.value)}
                className={`border-2 ${
                  formErrors.state ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.state && (
                <span className="text-red-500 text-xs">{formErrors.state}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                City *
              </label>
              <input
                type="text"
                placeholder="Enter City"
                value={userInfo.city}
                onChange={(e) => handleUserInfoChange("city", e.target.value)}
                className={`border-2 ${
                  formErrors.city ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.city && (
                <span className="text-red-500 text-xs">{formErrors.city}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Area Pincode *
              </label>
              <input
                type="text"
                placeholder="Enter Area Pincode"
                value={userInfo.pincode}
                onChange={(e) =>
                  handleUserInfoChange("pincode", e.target.value)
                }
                className={`border-2 ${
                  formErrors.pincode ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.pincode && (
                <span className="text-red-500 text-xs">
                  {formErrors.pincode}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black tracking-wider">
              Address *
            </label>
            <input
              type="text"
              placeholder="Enter Address"
              value={userInfo.address}
              onChange={(e) => handleUserInfoChange("address", e.target.value)}
              className={`border-2 ${
                formErrors.address ? "border-red-500" : "border-black"
              } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
              style={{ padding: "0.75rem" }}
            />
            {formErrors.address && (
              <span className="text-red-500 text-xs">{formErrors.address}</span>
            )}
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4">
          <h2
            className="text-2xl text-black tracking-wider border-b-2 border-black"
            style={{ paddingBottom: "0.5rem" }}
          >
            Payment Details
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black tracking-wider">
              Cardholder Name *
            </label>
            <input
              type="text"
              placeholder="Enter Cardholder Name"
              value={paymentInfo.cardholderName}
              onChange={(e) =>
                handlePaymentInfoChange("cardholderName", e.target.value)
              }
              className={`border-2 ${
                formErrors.cardholderName ? "border-red-500" : "border-black"
              } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
              style={{ padding: "0.75rem" }}
            />
            {formErrors.cardholderName && (
              <span className="text-red-500 text-xs">
                {formErrors.cardholderName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black tracking-wider">
              Card Number *
            </label>
            <input
              maxLength={16}
              type="text"
              placeholder="Enter Card Number"
              value={paymentInfo.cardNumber}
              onChange={(e) =>
                handlePaymentInfoChange("cardNumber", e.target.value)
              }
              className={`border-2 ${
                formErrors.cardNumber ? "border-red-500" : "border-black"
              } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
              style={{ padding: "0.75rem" }}
            />
            {formErrors.cardNumber && (
              <span className="text-red-500 text-xs">
                {formErrors.cardNumber}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">
                Expiry Date *
              </label>
              <input
                maxLength={5}
                type="text"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={(e) =>
                  handlePaymentInfoChange("expiryDate", e.target.value)
                }
                className={`border-2 ${
                  formErrors.expiryDate ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.expiryDate && (
                <span className="text-red-500 text-xs">
                  {formErrors.expiryDate}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-black tracking-wider">CVV *</label>
              <input
                maxLength={3}
                type="password"
                placeholder="Enter CVV"
                value={paymentInfo.cvv}
                onChange={(e) => handlePaymentInfoChange("cvv", e.target.value)}
                className={`border-2 ${
                  formErrors.cvv ? "border-red-500" : "border-black"
                } bg-white text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
              />
              {formErrors.cvv && (
                <span className="text-red-500 text-xs">{formErrors.cvv}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white border-2 border-black tracking-wider hover:bg-white hover:text-black transition-all duration-300"
          style={{
            paddingTop: "1rem",
            paddingBottom: "1rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          Pay Now - Rs {totalPrice.toFixed(2)}
        </button>
      </form>
    </div>
  );
}

export default PaymentDetailsForm;
