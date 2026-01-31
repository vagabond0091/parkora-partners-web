import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { useAppStatusStore } from '@/stores/appStatusStore';
import { AuthService } from '@/services/AuthService';
import { ROUTES } from '@/routes/routePaths';
import logo from '@/assets/logo/logo.png';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const isLoading = useAppStatusStore((state) => state.isLoading);
  const error = useAppStatusStore((state) => state.error);
  const setLoading = useAppStatusStore((state) => state.setLoading);
  const setError = useAppStatusStore((state) => state.setError);
  const clearError = useAppStatusStore((state) => state.clearError);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email should be valid';
        }
        if (value.length > 255) {
          return 'Email must not exceed 255 characters';
        }
        return '';
      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return '';
      case 'confirmPassword':
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return '';
      case 'firstName':
        if (value.length > 100) {
          return 'First name must not exceed 100 characters';
        }
        return '';
      case 'lastName':
        if (value.length > 100) {
          return 'Last name must not exceed 100 characters';
        }
        return '';
      case 'phone':
        if (value.length > 20) {
          return 'Phone must not exceed 20 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate on change
    const error = validateField(name, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach((key) => {
      if (key !== 'confirmPassword') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) {
          errors[key] = error;
        }
      }
    });
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const registerData = {
        username: formData.username || undefined,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
      };
      
      await AuthService.register(registerData);
      
      // Redirect to login page on success
      navigate(ROUTES.LOGIN);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ onClick, show }: { onClick: () => void; show: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200" />
      
      {/* Decorative blurred circles */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-gradient-to-br from-orange-200/60 to-orange-300/40 rounded-full blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/60 to-pink-200/40 rounded-full blur-3xl" />
      
      {/* Register card */}
      <div className="relative w-full max-w-md mx-4 my-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-900/5 p-8 md:p-10">
          {/* Logo */}
          <div className="-mb-6">
            <img 
              src={logo} 
              alt="Parkora" 
              className="h-32 w-auto -ml-6"
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign up</h1>
            <p className="text-gray-500">Create your Partners account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                error={fieldErrors.firstName}
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                error={fieldErrors.lastName}
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
            />

            <Input
              label="Phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              error={fieldErrors.phone}
            />

            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              error={fieldErrors.username}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              rightIcon={<EyeIcon onClick={() => setShowPassword(!showPassword)} show={showPassword} />}
              error={fieldErrors.password}
              required
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              rightIcon={<EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} show={showConfirmPassword} />}
              error={fieldErrors.confirmPassword}
              required
            />

            {/* Sign Up Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
            >
              Sign Up
            </Button>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a
              href={ROUTES.LOGIN}
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
