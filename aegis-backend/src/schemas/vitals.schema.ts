import { z } from 'zod';

export const vitalLogSchema = z.object({
  systolic:  z.number({ message: 'Systolic is required' }).int().positive(),
  diastolic: z.number({ message: 'Diastolic is required' }).int().positive(),
  heartRate: z.number().int().positive().optional(),
  weight:    z.number().positive().optional(),
  symptoms:  z.array(z.string()).optional().default([]),
  notes:     z.string().optional(),
});

export type VitalLogInput = z.infer<typeof vitalLogSchema>;
