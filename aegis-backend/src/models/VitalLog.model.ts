import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAiReport {
  riskLevel: 'STABLE' | 'ELEVATED' | 'HIGH';
  score: number;
  justification: string;
  strokePreventionSteps: string[];
}

export interface IVitalLog extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  systolic: number;
  diastolic: number;
  heartRate?: number;
  dailySteps?: number;
  sleepHours?: number;
  medications?: string;
  weight?: number;
  symptoms: string[];
  notes?: string;
  aiReport?: IAiReport;
  loggedAt: Date;
}

const VitalLogSchema = new Schema<IVitalLog>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  systolic: { type: Number, required: true },
  diastolic: { type: Number, required: true },
  heartRate: { type: Number },
  dailySteps: { type: Number },
  sleepHours: { type: Number },
  medications: { type: String },
  weight: { type: Number },
  symptoms: { type: [String], default: [] },
  notes: { type: String },
  aiReport: { type: Schema.Types.Mixed },
  loggedAt: { type: Date, default: Date.now },
});

const VitalLog: Model<IVitalLog> =
  mongoose.models.VitalLog ?? mongoose.model<IVitalLog>('VitalLog', VitalLogSchema);

export default VitalLog;
