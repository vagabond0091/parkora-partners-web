import { z } from 'zod';

/**
 * Zod schema for step 1 (user information) validation
 */
export const userInfoSchema = z.object({
  username: z
    .string()
    .refine(
      (val) => !val || val.trim() === '' || (val.length >= 3 && val.length <= 100),
      'Username must be between 3 and 100 characters'
    )
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email should be valid')
    .max(255, 'Email must not exceed 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z
    .string()
    .max(100, 'First name must not exceed 100 characters')
    .refine(
      (val) => !val.trim() || !/^\d+$/.test(val.trim()),
      'First name cannot be all numbers'
    )
    .optional(),
  lastName: z
    .string()
    .max(100, 'Last name must not exceed 100 characters')
    .refine(
      (val) => !val.trim() || !/^\d+$/.test(val.trim()),
      'Last name cannot be all numbers'
    )
    .optional(),
  phone: z
    .string()
    .max(13, 'Phone must not exceed 13 characters')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Zod schema for step 2 (company information) validation
 */
export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must not exceed 255 characters'),
  businessRegistrationNumber: z
    .string()
    .min(1, 'Business registration number is required')
    .max(100, 'Business registration number must not exceed 100 characters'),
  taxIdentificationNumber: z
    .string()
    .min(1, 'Tax identification number is required')
    .max(50, 'Tax identification number must not exceed 50 characters'),
  businessType: z
    .string()
    .max(50, 'Business type must not exceed 50 characters')
    .optional(),
  addressLine1: z
    .string()
    .max(255, 'Address line 1 must not exceed 255 characters')
    .optional(),
  addressLine2: z
    .string()
    .max(255, 'Address line 2 must not exceed 255 characters')
    .optional(),
  city: z
    .string()
    .max(100, 'City must not exceed 100 characters')
    .optional(),
  state: z
    .string()
    .max(100, 'State must not exceed 100 characters')
    .optional(),
  province: z
    .string()
    .max(100, 'Province must not exceed 100 characters')
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must not exceed 20 characters')
    .optional(),
  country: z
    .string()
    .max(100, 'Country must not exceed 100 characters')
    .optional(),
});

/**
 * Complete registration schema combining both steps
 */
export const registerSchema = userInfoSchema.merge(companyInfoSchema);

/**
 * Type inferred from register schema
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
