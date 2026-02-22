import { z } from 'zod';

export const medicationSchema = z.object({
  name:      z.string().min(1, 'Medication name is required').trim(),
  dosage:    z.string().optional(),
  frequency: z.string().optional(),
  times:     z.array(z.string()).optional().default([]),
  startDate: z.string().optional(),
  endDate:   z.string().nullable().optional(),
  isActive:  z.boolean().optional().default(true),
});

export const doseLogSchema = z.object({
  medicationId: z.string().min(1, 'Medication ID is required'),
  scheduledAt:  z.string({ message: 'scheduledAt is required' }),
  takenAt:      z.string().nullable().optional(),
  status:       z.enum(['taken', 'missed', 'late']),
});

export type MedicationInput = z.infer<typeof medicationSchema>;
export type DoseLogInput = z.infer<typeof doseLogSchema>;
