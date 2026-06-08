import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

/**
 * Button Component - Unified button with variants and sizes
 * Uses inline styles for padding/margin and proper cursor pointer
 * 
 * @param {string} variant - "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
 * @param {string} size - "default" | "sm" | "lg" | "icon"
 * @param {boolean} asChild - Render as child component using Slot
 * @param {boolean} disabled - Disable button
 * @param {object} style - Additional inline styles
 */

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  style = {},
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"

  // Base classes
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none";

  // Variant classes
  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800 border-2 border-black",
    destructive: "bg-red-600 text-white hover:bg-red-700 border-2 border-red-600",
    outline: "border-2 border-black bg-white hover:bg-black hover:text-white",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 border-2 border-gray-200",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-black underline-offset-4 hover:underline",
  };

  // Size styles (inline)
  const sizeStyles = {
    default: { padding: "8px 16px" },
    sm: { padding: "6px 12px", fontSize: "12px" },
    lg: { padding: "10px 24px", fontSize: "16px" },
    icon: { padding: "8px", width: "36px", height: "36px" },
  };

  // Merge inline styles
  const buttonStyle = {
    ...sizeStyles[size],
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  return (
    <Comp
      ref={ref}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
      style={buttonStyle}
      {...props}
    />
  );
});

Button.displayName = "Button"

export { Button }
