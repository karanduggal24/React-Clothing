/**
 * App-wide button component with variants
 * variant: "primary" | "secondary" | "danger" | "ghost"
 * size: "sm" | "md" | "lg"
 */
function AppButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center font-semibold uppercase tracking-wide border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white border-black hover:bg-white hover:text-black",
    secondary: "bg-white text-black border-black hover:bg-black hover:text-white",
    danger: "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600",
    ghost: "bg-transparent text-black border-transparent hover:bg-gray-100",
  };

  const sizes = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default AppButton;
