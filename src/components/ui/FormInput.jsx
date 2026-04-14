/**
 * Reusable form input with icon, error, and label support
 */
function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  required = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full border-2 rounded text-gray-800 text-sm outline-none transition-colors
            ${Icon ? "pl-10 pr-4 py-3" : "px-4 py-3"}
            ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-black"}
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FormInput;
