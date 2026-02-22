import { z } from 'zod';

export const registerSchema = z.object({
  firstName:    z.string().min(1, 'First name is required').trim(),
  lastName:     z.string().min(1, 'Last name is required').trim(),
  email:        z.string().email('Invalid email address').toLowerCase(),
  phoneNumber:  z.string().min(7, 'Enter a valid phone number'),
  password:     z.string().min(8, 'Password must be at least 8 characters'),
  kinName:      z.string().min(1, 'Next of kin full name is required').trim(),
  kinPhone:     z.string().min(7, 'Enter a valid kin phone number'),
  kinEmail:     z.string().email('Enter a valid email').optional().or(z.literal('')),
  hospitalId:   z.string().optional(),   // ← patient selects their hospital
  consentHealth: z.literal(true, { message: 'This consent is required for your safety' }),
  consentTerms:  z.literal(true, { message: 'You must agree to the Terms & Privacy Policy' }),
});

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;