import { z } from 'zod';

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed file MIME types
 */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

/**
 * Zod schema for required file validation.
 * Validates file type, size, and presence.
 */
const requiredFileSchema = z
  .instanceof(File, { message: 'File is required' })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    {
      message: 'File size must be less than 10MB',
    }
  )
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number]),
    {
      message: 'File must be PDF, JPEG, or PNG',
    }
  );

/**
 * Zod schema for business verification form validation.
 * Validates business information and required documents.
 */
export const verificationSchema = z.object({
  businessRegistrationNumber: z
    .string()
    .min(1, 'Business registration number is required')
    .max(100, 'Business registration number must not exceed 100 characters')
    .trim(),
  taxIdentificationNumber: z
    .string()
    .min(1, 'Tax identification number is required')
    .max(50, 'Tax identification number must not exceed 50 characters')
    .trim(),
  businessLicense: requiredFileSchema,
  taxDocument: requiredFileSchema,
  additionalDocuments: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      {
        message: 'All files must be less than 10MB',
        path: ['additionalDocuments'],
      }
    )
    .refine(
      (files) =>
        files.every((file) =>
          ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])
        ),
      {
        message: 'All files must be PDF, JPEG, or PNG',
        path: ['additionalDocuments'],
      }
    )
    .optional()
    .default([]),
});

/**
 * Type inferred from verification schema
 */
export type VerificationFormData = z.infer<typeof verificationSchema>;
