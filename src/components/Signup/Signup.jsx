import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone } from 'lucide-react';

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
    
    // Real-time validation for email
    if (name === 'email' && value.trim()) {
      if (!isValidEmail(value.trim())) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else if (errors[name]) {
      // Clear error for other fields
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Enhanced email validation function
  const isValidEmail = (email) => {
    // More robust email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Additional checks
    if (!emailRegex.test(email)) return false;
    
    // Check for common invalid patterns
    if (email.includes('..')) return false; // No consecutive dots
    if (email.startsWith('.') || email.startsWith('@')) return false;
    if (email.endsWith('.') || email.endsWith('@')) return false;
    
    // Check domain part
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ padding: '20px' }}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200" style={{ padding: '40px' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <h2 className="text-3xl font-bold text-black">Create Account</h2>
          <p className="text-gray-600" style={{ marginTop: '8px' }}>
            Join us to start shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition`}
                style={{ padding: '12px 12px 12px 44px' }}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs" style={{ marginTop: '4px' }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Email Address *
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                formData.email && isValidEmail(formData.email.trim()) 
                  ? 'text-green-500' 
                  : errors.email 
                  ? 'text-red-500' 
                  : 'text-gray-400'
              }`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (e.g., user@example.com)"
                className={`w-full border-2 ${
                  errors.email 
                    ? 'border-red-500' 
                    : formData.email && isValidEmail(formData.email.trim())
                    ? 'border-green-500'
                    : 'border-gray-300'
                } rounded-lg focus:outline-none focus:border-black transition`}
                style={{ padding: '12px 12px 12px 44px' }}
              />
              {formData.email && isValidEmail(formData.email.trim()) && !errors.email && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-sm font-medium">
                  ✓
                </span>
              )}
            </div>
            {errors.email && <p className="text-red-500 text-xs" style={{ marginTop: '4px' }}>{errors.email}</p>}
            {formData.email && isValidEmail(formData.email.trim()) && !errors.email && (
              <p className="text-green-600 text-xs" style={{ marginTop: '4px' }}>✓ Valid email address</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                maxLength={10}
                className={`w-full border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition`}
                style={{ padding: '12px 12px 12px 44px' }}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs" style={{ marginTop: '4px' }}>{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full border-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition`}
                style={{ padding: '12px 12px 12px 44px' }}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs" style={{ marginTop: '4px' }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition`}
                style={{ padding: '12px 12px 12px 44px' }}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs" style={{ marginTop: '4px' }}>{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '14px', marginTop: '24px' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
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
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
