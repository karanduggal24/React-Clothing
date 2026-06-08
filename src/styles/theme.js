/**
 * Application Theme Configuration
 * Centralized color palette for consistent theming across the application
 */

export const theme = {
  // Primary Colors
  colors: {
    primary: '#1c1b1b',        // Black - Primary text and buttons
    secondary: '#004dea',      // Blue - Accent color
    background: '#fcf9f8',     // Off-white - Main background
    backgroundAlt: '#f6f3f2',  // Slightly darker off-white - Alternative background
    backgroundDark: '#f0edec', // Card/Image backgrounds
    
    // Text Colors
    text: {
      primary: '#1c1b1b',      // Main text
      secondary: '#474747',    // Secondary text
      muted: '#6b7280',        // Muted text (gray-600)
      light: '#fcf9f8',        // Light text (on dark backgrounds)
    },
    
    // Status Colors
    success: '#10b981',        // Green
    error: '#ef4444',          // Red
    warning: '#f59e0b',        // Orange
    info: '#3b82f6',           // Blue
    
    // Border Colors
    border: {
      light: '#e5e7eb',        // Light border (gray-200)
      default: '#d1d5db',      // Default border (gray-300)
      dark: '#1c1b1b',         // Dark border
    },
    
    // Button States
    button: {
      primary: '#1c1b1b',
      primaryHover: '#374151',  // gray-800
      secondary: '#ffffff',
      secondaryHover: '#f9fafb', // gray-50
      accent: '#004dea',
      accentHover: '#003ac7',
    },
    
    // Overlay
    overlay: {
      light: 'rgba(0, 0, 0, 0.1)',
      default: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
    }
  },
  
  // Spacing (for inline styles)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

export default theme;
