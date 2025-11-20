import React from "react";

function PaymentMethodSelector({ paymentMethod, setPaymentMethod }) {
  const paymentOptions = [
    {
      value: "razorpay",
      title: "Pay Online (Razorpay)",
      description: "Credit/Debit Card, UPI, Net Banking, Wallets",
      badge: "Secure"
    },
    {
      value: "cod",
      title: "Cash on Delivery",
      description: "Pay when you receive the order",
      badge: null
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 className="text-2xl text-black tracking-wider border-b-2 border-black" style={{ paddingBottom: "0.5rem" }}>
        Payment Method
      </h2>
      
      <div className="flex flex-col" style={{ gap: "0.75rem" }}>
        {paymentOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center border-2 border-black rounded cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ gap: "0.75rem", padding: "1rem" }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={paymentMethod === option.value}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 accent-black"
            />
            <div className="flex-1">
              <div className="font-semibold text-black">{option.title}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </div>
            {option.badge && (
              <div className="text-xs bg-green-100 text-green-800 rounded" style={{ padding: "0.25rem 0.5rem" }}>
                {option.badge}
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodSelector;
