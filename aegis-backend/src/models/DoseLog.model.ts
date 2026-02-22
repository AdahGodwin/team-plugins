import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoseLog extends Document {
  _id: mongoose.Types.ObjectId;
  medicationId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  takenAt?: Date;
  status: 'taken' | 'missed' | 'late';
}

const DoseLogSchema = new Schema<IDoseLog>({
  medicationId: { type: Schema.Types.ObjectId, ref: 'Medication', required: true },
  patientId:    { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  scheduledAt:  { type: Date, required: true },
  takenAt:      { type: Date, default: null },
  status:       { type: String, enum: ['taken', 'missed', 'late'], required: true },
});

const DoseLog: Model<IDoseLog> =
  mongoose.models.DoseLog ?? mongoose.model<IDoseLog>('DoseLog', DoseLogSchema);

export default DoseLog;
