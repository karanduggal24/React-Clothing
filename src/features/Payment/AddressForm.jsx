import React from "react";

function AddressForm({ userInfo, formErrors, handleUserInfoChange, isAuthenticated, user }) {
  const inputFields = [
    [
      { name: "name", label: "Full Name *", type: "text", placeholder: "Enter Full Name", required: true },
      { name: "email", label: "Email Address *", type: "email", placeholder: "Enter Email Address", required: true, readOnly: isAuthenticated && user?.email }
    ],
    [
      { name: "phone", label: "Phone Number *", type: "text", placeholder: "Enter Phone Number", required: true, maxLength: 10 },
      { name: "country", label: "Country", type: "text", placeholder: "Enter Country", required: false }
    ],
    [
      { name: "state", label: "State *", type: "text", placeholder: "Enter State", required: true },
      { name: "city", label: "City *", type: "text", placeholder: "Enter City", required: true }
    ],
    [
      { name: "pincode", label: "Area Pincode *", type: "text", placeholder: "Enter Area Pincode", required: true }
    ]
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 className="text-2xl text-black tracking-wider border-b-2 border-black" style={{ paddingBottom: "0.5rem" }}>
        Address Details
      </h2>

      {inputFields.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col md:flex-row" style={{ gap: "1rem" }}>
          {row.map((field) => (
            <div key={field.name} className="flex flex-col flex-1" style={{ gap: "0.5rem" }}>
              <label className="text-sm text-black tracking-wider">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={userInfo[field.name]}
                onChange={(e) => handleUserInfoChange(field.name, e.target.value)}
                readOnly={field.readOnly}
                maxLength={field.maxLength}
                className={`border-2 ${
                  formErrors[field.name] ? "border-red-500" : "border-black"
                } ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-black focus:outline-none focus:bg-gray-50 transition-colors`}
                style={{ padding: "0.75rem" }}
                title={field.readOnly ? "Email from your account" : ""}
              />
              {formErrors[field.name] && (
                <span className="text-red-500 text-xs">{formErrors[field.name]}</span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="flex flex-col" style={{ gap: "0.5rem" }}>
        <label className="text-sm text-black tracking-wider">Address *</label>
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
  );
}

export default AddressForm;
