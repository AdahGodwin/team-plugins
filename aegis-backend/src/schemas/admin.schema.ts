import { z } from 'zod';

export const createAdminSchema = z.object({
  firstName:       z.string().min(1, 'First name is required').trim(),
  lastName:        z.string().min(1, 'Last name is required').trim(),
  title:           z.string().min(1, 'Title is required').trim(),       
  email:           z.string().email('Invalid email address').toLowerCase(),
  password:        z.string().min(8, 'Password must be at least 8 characters'),

  specialty:       z.string().min(1, 'Specialty is required').trim(),
  licenseNumber:   z.string().min(1, 'License number is required').trim(),
  department:      z.string().min(1, 'Department is required').trim(),
  jobTitle:        z.string().min(1, 'Job title is required').trim(),

  hospitalName:    z.string().min(1, 'Hospital name is required').trim(),
  hospitalAddress: z.string().min(1, 'Hospital address is required'),
  hospitalPhone:   z.string().min(7,  'Enter a valid hospital phone number'),
  hospitalEmail:   z.string().email('Invalid hospital email').toLowerCase(),
  registrationNo:  z.string().min(1, 'Registration number is required').trim(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
