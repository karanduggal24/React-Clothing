import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { authApi } from '../../config/api';
import { theme } from '../../styles/theme';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation / cleanup
    if (name === 'email' && value.trim()) {
      if (!isValidEmail(value.trim())) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else {
      // Instantly clear the error marker for the current field as the user types
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Enhanced email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) return false;
    if (email.includes('..')) return false; 
    if (email.startsWith('.') || email.startsWith('@')) return false;
    if (email.endsWith('.') || email.endsWith('@')) return false;
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1];
    if (!domain.includes('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await authApi.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.phone || null
      );

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      // Set a global form error flag if needed, or map fields from server response
      setErrors(prev => ({ ...prev, server: error.message || 'Registration failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ padding: '20px', paddingTop: '100px', backgroundColor: theme.colors.background }}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg" style={{ padding: '40px', border: `1px solid ${theme.colors.border.light}` }}>
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <h2 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>Create Account</h2>
          <p style={{ marginTop: '8px', color: theme.colors.text.secondary }}>
            Join us to start shopping
          </p>
        </div>

        {/* Global Server Error Display */}
        {errors.server && (
          <div className="text-sm rounded" style={{ padding: '10px 16px', marginBottom: '20px', backgroundColor: '#FEE2E2', color: theme.colors.error, border: `1px solid #FCA5A5` }}>
            {errors.server}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-sm font-medium" style={{ marginBottom: '8px', color: theme.colors.text.secondary }}>
              Full Name *
            </label>
            <div className="relative">
              <User 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                style={{ color: errors.name ? theme.colors.error : theme.colors.text.muted }} 
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg focus:outline-none transition-colors"
                style={{ 
                  padding: '12px 12px 12px 44px',
                  backgroundColor: errors.name ? '#FDF2F2' : 'transparent',
                  border: `2px solid ${errors.name ? theme.colors.error : theme.colors.border.default}`
                }}
              />
            </div>
            {errors.name && <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.error }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-sm font-medium" style={{ marginBottom: '8px', color: theme.colors.text.secondary }}>
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{
                color: formData.email && isValidEmail(formData.email.trim()) 
                  ? theme.colors.success 
                  : errors.email 
                  ? theme.colors.error 
                  : theme.colors.text.muted
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg focus:outline-none transition-colors"
                style={{ 
                  padding: '12px 12px 12px 44px',
                  backgroundColor: errors.email ? '#FDF2F2' : 'transparent',
                  border: `2px solid ${
                    errors.email 
                      ? theme.colors.error 
                      : formData.email && isValidEmail(formData.email.trim())
                      ? theme.colors.success
                      : theme.colors.border.default
                  }`
                }}
              />
              {formData.email && isValidEmail(formData.email.trim()) && !errors.email && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium" style={{ color: theme.colors.success }}>
                  ✓
                </span>
              )}
            </div>
            {errors.email && <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.error }}>{errors.email}</p>}
            {formData.email && isValidEmail(formData.email.trim()) && !errors.email && (
              <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.success }}>✓ Valid email address</p>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-sm font-medium" style={{ marginBottom: '8px', color: theme.colors.text.secondary }}>
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                style={{ color: errors.phone ? theme.colors.error : theme.colors.text.muted }} 
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                maxLength={10}
                className="w-full rounded-lg focus:outline-none transition-colors"
                style={{ 
                  padding: '12px 12px 12px 44px',
                  backgroundColor: errors.phone ? '#FDF2F2' : 'transparent',
                  border: `2px solid ${errors.phone ? theme.colors.error : theme.colors.border.default}`
                }}
              />
            </div>
            {errors.phone && <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.error }}>{errors.phone}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-sm font-medium" style={{ marginBottom: '8px', color: theme.colors.text.secondary }}>
              Password *
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                style={{ color: errors.password ? theme.colors.error : theme.colors.text.muted }} 
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-lg focus:outline-none transition-colors"
                style={{ 
                  padding: '12px 12px 12px 44px',
                  backgroundColor: errors.password ? '#FDF2F2' : 'transparent',
                  border: `2px solid ${errors.password ? theme.colors.error : theme.colors.border.default}`
                }}
              />
            </div>
            {errors.password && <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.error }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-sm font-medium" style={{ marginBottom: '8px', color: theme.colors.text.secondary }}>
              Confirm Password *
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                style={{ color: errors.confirmPassword ? theme.colors.error : theme.colors.text.muted }} 
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full rounded-lg focus:outline-none transition-colors"
                style={{ 
                  padding: '12px 12px 12px 44px',
                  backgroundColor: errors.confirmPassword ? '#FDF2F2' : 'transparent',
                  border: `2px solid ${errors.confirmPassword ? theme.colors.error : theme.colors.border.default}`
                }}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs font-medium" style={{ marginTop: '4px', color: theme.colors.error }}>{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              padding: '14px', 
              marginTop: '24px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: theme.colors.button.primary,
              color: theme.colors.text.light
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center" style={{ gap: '8px' }}>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <p style={{ color: theme.colors.text.secondary }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: theme.colors.primary }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;