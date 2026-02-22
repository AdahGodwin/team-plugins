import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVitalLog extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  systolic: number;
  diastolic: number;
  heartRate?: number;
  weight?: number;
  symptoms: string[];
  notes?: string;
  loggedAt: Date;
}

const VitalLogSchema = new Schema<IVitalLog>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  systolic:  { type: Number, required: true },
  diastolic: { type: Number, required: true },
  heartRate: { type: Number },
  weight:    { type: Number },
  symptoms:  { type: [String], default: [] },
  notes:     { type: String },
  loggedAt:  { type: Date, default: Date.now },
});

const VitalLog: Model<IVitalLog> =
  mongoose.models.VitalLog ?? mongoose.model<IVitalLog>('VitalLog', VitalLogSchema);

export default VitalLog;
