import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { clsx } from 'clsx';
import { Country, State, City } from 'country-state-city';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { CountrySelect } from '@/components/common/CountrySelect/CountrySelect';
import { Button } from '@/components/common/Button/Button';
import { useAuthStore } from '@/stores/authStore';
import { useAppStatusStore } from '@/stores/appStatusStore';
import { AuthService } from '@/services/AuthService';
import { ROUTES } from '@/routes/routePaths';
import { userInfoSchema, companyInfoSchema, registerSchema, type RegisterFormData } from '@/validation/register.validation';
import logo from '@/assets/logo/logo.png';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAppStatusStore((state) => state.isLoading);
  const error = useAppStatusStore((state) => state.error);
  const setLoading = useAppStatusStore((state) => state.setLoading);
  const setError = useAppStatusStore((state) => state.setError);
  const clearError = useAppStatusStore((state) => state.clearError);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    businessRegistrationNumber: '',
    taxIdentificationNumber: '',
    businessType: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    province: '',
    postalCode: '',
    country: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const countries = useMemo(() => Country.getAllCountries(), []);

  const selectedCountry = useMemo(() => {
    if (!formData.country) return null;
    return countries.find((country) => country.name === formData.country);
  }, [formData.country, countries]);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode) || [];
  }, [selectedCountry]);

  const selectedState = useMemo(() => {
    if (!formData.state || !selectedCountry) return null;
    return states.find((state) => state.name === formData.state);
  }, [formData.state, states, selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    
    // If states are available for this country, only show cities when a state is selected
    if (states.length > 0) {
      if (selectedState) {
        return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) || [];
      }
      // If states are available but none selected, return empty array
      return [];
    }
    
    // If no states available, get all cities for the country
    return City.getCitiesOfCountry(selectedCountry.isoCode) || [];
  }, [selectedCountry, selectedState, states.length]);

  // Clear city if it's not in the current cities list (e.g., when state changes)
  useEffect(() => {
    if (formData.city && cities.length > 0) {
      const cityExists = cities.some((city) => city.name === formData.city);
      if (!cityExists) {
        setFormData((prev) => ({ ...prev, city: '' }));
      }
    }
  }, [cities, formData.city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate on change - for password/confirmPassword, validate whole step
    // For other fields, validate just that field
    try {
      if (name === 'confirmPassword' || name === 'password') {
        if (currentStep === 1) {
          userInfoSchema.parse(updatedData);
        }
      } else if (currentStep === 1) {
        // Validate user info fields
        if (name === 'email') {
          userInfoSchema.shape.email.parse(value);
        } else if (name === 'firstName') {
          userInfoSchema.shape.firstName.parse(value);
        } else if (name === 'lastName') {
          userInfoSchema.shape.lastName.parse(value);
        } else if (name === 'phone') {
          userInfoSchema.shape.phone.parse(value);
        } else if (name === 'username') {
          userInfoSchema.shape.username.parse(value);
        }
      } else if (currentStep === 2) {
        // Validate company info fields
        if (name === 'companyName') {
          companyInfoSchema.shape.companyName.parse(value);
        } else if (name === 'businessRegistrationNumber') {
          companyInfoSchema.shape.businessRegistrationNumber.parse(value);
        } else if (name === 'taxIdentificationNumber') {
          companyInfoSchema.shape.taxIdentificationNumber.parse(value);
        } else if (name === 'businessType') {
          companyInfoSchema.shape.businessType.parse(value);
        } else if (name === 'addressLine1') {
          companyInfoSchema.shape.addressLine1.parse(value);
        } else if (name === 'addressLine2') {
          companyInfoSchema.shape.addressLine2.parse(value);
        } else if (name === 'city') {
          companyInfoSchema.shape.city.parse(value);
        } else if (name === 'state') {
          companyInfoSchema.shape.state.parse(value);
        } else if (name === 'province') {
          companyInfoSchema.shape.province.parse(value);
        } else if (name === 'postalCode') {
          companyInfoSchema.shape.postalCode.parse(value);
        } else if (name === 'country') {
          companyInfoSchema.shape.country.parse(value);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((issue) => issue.path[0] === name);
        if (fieldError) {
          setFieldErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        }
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    
    // Clear dependent fields when country changes
    if (name === 'country') {
      updatedData.state = '';
      updatedData.province = '';
      updatedData.city = '';
      // Clear errors for dependent fields
      ['state', 'province', 'city'].forEach((field) => {
        if (fieldErrors[field]) {
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      });
    }
    
    // Clear state/province when country changes (handled above)
    // Clear city when state changes (if needed)
    if (name === 'state' || name === 'province') {
      updatedData.city = '';
      if (fieldErrors.city) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.city;
          return newErrors;
        });
      }
    }
    
    setFormData(updatedData);
    
    // Clear error for this field when user changes selection
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate on change
    try {
      if (name === 'country' && currentStep === 2) {
        companyInfoSchema.shape.country.parse(value);
      } else if (name === 'state' && currentStep === 2) {
        companyInfoSchema.shape.state.parse(value);
      } else if (name === 'city' && currentStep === 2) {
        companyInfoSchema.shape.city.parse(value);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((issue) => issue.path[0] === name);
        if (fieldError) {
          setFieldErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        }
      }
    }
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        userInfoSchema.parse(formData);
      } else if (step === 2) {
        companyInfoSchema.parse(formData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (fieldName) {
            errors[fieldName] = issue.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleNext = () => {
    clearError();
    if (validateStep(1)) {
      setCompletedSteps((prev) => new Set(prev).add(1));
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    clearError();
    setFieldErrors({});
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    
    // Validate both steps before submitting
    if (!validateStep(1) || !validateStep(2)) {
      // If step 2 validation fails, show step 2
      if (!validateStep(2)) {
        setCurrentStep(2);
      }
      return;
    }
    
    // Final validation of complete form
    try {
      registerSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (fieldName) {
            errors[fieldName] = issue.message;
          }
        });
        setFieldErrors(errors);
        return;
      }
    }
    
    // Mark step 2 as completed before submitting
    setCompletedSteps((prev) => new Set(prev).add(2));
    setLoading(true);
    
    try {
      const registerData = {
        username: formData.username || undefined,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessRegistrationNumber || undefined,
        taxIdentificationNumber: formData.taxIdentificationNumber || undefined,
        businessType: formData.businessType || undefined,
        addressLine1: formData.addressLine1 || undefined,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        province: formData.province || undefined,
        postalCode: formData.postalCode || undefined,
        country: formData.country || undefined,
      };
      
      const response = await AuthService.register(registerData);
      
      // Check if registration response includes a token
      if (response.data && typeof response.data === 'string') {
        // Token is in response.data, decode and set user
        const token = response.data;
        const payload = AuthService.decodeToken(token);
        
        const user = {
          id: payload.userId,
          email: payload.email,
          name: `${payload.firstName} ${payload.lastName}`,
          roles: payload.roles,
        };
        
        setUser(user, token);
        navigate(ROUTES.DASHBOARD);
      } else {
        // If no token in response, auto-login with registered credentials
        // Use email as username if username is not provided
        const loginCredentials = {
          username: registerData.username || registerData.email,
          password: registerData.password,
        };
        
        try {
          const loginResponse = await AuthService.login(loginCredentials);
          const token = loginResponse.data;
          const payload = AuthService.decodeToken(token);
          
          const user = {
            id: payload.userId,
            email: payload.email,
            name: `${payload.firstName} ${payload.lastName}`,
            roles: payload.roles,
          };
          
          setUser(user, token);
          navigate(ROUTES.DASHBOARD);
        } catch (loginErr) {
          // If auto-login fails, redirect to login page
          const errorMessage = loginErr instanceof Error ? loginErr.message : 'Registration successful. Please login.';
          setError(errorMessage);
          // Still redirect to login after a short delay
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 2000);
        }
      }
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
      <div className="relative w-full max-w-2xl mx-4 my-8">
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

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {/* Step 1 */}
                <div className="flex items-center">
                  <div className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors',
                    completedSteps.has(1)
                      ? 'bg-green-500 text-white'
                      : currentStep === 1 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-300 text-gray-500'
                  )}>
                    {completedSteps.has(1) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      '1'
                    )}
                  </div>
                  <span className={clsx(
                    'text-sm ml-3 transition-colors',
                    currentStep === 1 
                      ? 'font-semibold text-purple-600' 
                      : completedSteps.has(1)
                        ? 'font-semibold text-green-600'
                        : 'text-gray-500'
                  )}>
                    Personal Information
                  </span>
                </div>
                
                {/* Connector Line */}
                <div className={clsx(
                  'w-24 h-0.5 mx-2 transition-colors',
                  completedSteps.has(1)
                    ? 'bg-green-500 border-0'
                    : 'border-t-2 border-dashed border-gray-300'
                )} />
                
                {/* Step 2 */}
                <div className="flex items-center">
                  <div className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors',
                    completedSteps.has(2)
                      ? 'bg-green-500 text-white'
                      : currentStep === 2 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-300 text-gray-500'
                  )}>
                    {completedSteps.has(2) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      '2'
                    )}
                  </div>
                  <span className={clsx(
                    'text-sm ml-3 transition-colors',
                    currentStep === 2 
                      ? 'font-semibold text-purple-600' 
                      : completedSteps.has(2)
                        ? 'font-semibold text-green-600'
                        : 'text-gray-500'
                  )}>
                    Company Details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: User Information */}
            {currentStep === 1 && (
              <>
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

              

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
                >
                  Next
                </Button>
              </>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <>
                <Input
                  label="Company Name"
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={fieldErrors.companyName}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Business Registration Number"
                    type="text"
                    name="businessRegistrationNumber"
                    placeholder="Enter registration number"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    error={fieldErrors.businessRegistrationNumber}
                    required
                  />

                  <Input
                    label="Tax Identification Number"
                    type="text"
                    name="taxIdentificationNumber"
                    placeholder="Enter tax ID"
                    value={formData.taxIdentificationNumber}
                    onChange={handleChange}
                    error={fieldErrors.taxIdentificationNumber}
                    required
                  />
                </div>

                <Input
                  label="Business Type"
                  type="text"
                  name="businessType"
                  placeholder="Enter business type"
                  value={formData.businessType}
                  onChange={handleChange}
                  error={fieldErrors.businessType}
                />

                <Input
                  label="Address Line 1"
                  type="text"
                  name="addressLine1"
                  placeholder="Enter address line 1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  error={fieldErrors.addressLine1}
                />

                <Input
                  label="Address Line 2"
                  type="text"
                  name="addressLine2"
                  placeholder="Enter address line 2 (optional)"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  error={fieldErrors.addressLine2}
                />

                <CountrySelect
                  label="Country"
                  value={formData.country}
                  onChange={handleSelectChange}
                  error={fieldErrors.country}
                  countries={countries}
                />

                {states.length > 0 ? (
                  <Select
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleSelectChange}
                    error={fieldErrors.state}
                    disabled={!selectedCountry}
                  >
                    <option value="">
                      {!selectedCountry 
                        ? 'Select country first' 
                        : 'Select a state/province'}
                    </option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="State"
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleChange}
                      error={fieldErrors.state}
                      disabled={!selectedCountry}
                    />

                    <Input
                      label="Province"
                      type="text"
                      name="province"
                      placeholder="Enter province"
                      value={formData.province}
                      onChange={handleChange}
                      error={fieldErrors.province}
                      disabled={!selectedCountry}
                    />
                  </div>
                )}

                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleSelectChange}
                  error={fieldErrors.city}
                  disabled={!selectedCountry || (states.length > 0 && !selectedState) || cities.length === 0}
                >
                  <option value="">
                    {!selectedCountry 
                      ? 'Select country first' 
                      : states.length > 0 && !selectedState
                        ? 'Select state/province first'
                        : cities.length === 0 
                          ? 'No cities available' 
                          : 'Select a city'}
                  </option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Postal Code"
                  type="text"
                  name="postalCode"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={fieldErrors.postalCode}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}
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
