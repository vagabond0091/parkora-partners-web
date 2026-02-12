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
 * Validates required documents for verification.
 */
export const verificationSchema = z.object({
  businessLicense: requiredFileSchema,
  taxDocument: requiredFileSchema,
  additionalDocument: requiredFileSchema.optional(),
});

/**
 * Type inferred from verification schema
 */
export type VerificationFormData = z.infer<typeof verificationSchema>;
