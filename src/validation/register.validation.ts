import { z } from 'zod';

/**
 * Zod schema for registration form validation
 */
export const registerSchema = z.object({
  username: z.string().optional(),
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
 * Type inferred from register schema
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
