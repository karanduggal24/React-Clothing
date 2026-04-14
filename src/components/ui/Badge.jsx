/**
 * Badge component for status indicators
 * variant: "success" | "warning" | "danger" | "info" | "neutral"
 */
const variants = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  neutral: "bg-gray-100 text-gray-800",
};

function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
