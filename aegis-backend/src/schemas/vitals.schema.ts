import { z } from 'zod';

export const vitalLogSchema = z.object({
  systolic: z.number({ message: 'Systolic is required' }).int().positive(),
  diastolic: z.number({ message: 'Diastolic is required' }).int().positive(),
  heartRate: z.number().int().positive().optional(),
  dailySteps: z.number().int().nonnegative().optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  medications: z.string().optional(),
  weight: z.number().positive().optional(),
  symptoms: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

export type VitalLogInput = z.infer<typeof vitalLogSchema>;
