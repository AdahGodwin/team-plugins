import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedication extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  name: string;
  dosage?: string;
  frequency?: string;
  times: string[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const MedicationSchema = new Schema<IMedication>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  name:      { type: String, required: true, trim: true },
  dosage:    { type: String },
  frequency: { type: String },
  times:     { type: [String], default: [] },
  startDate: { type: Date },
  endDate:   { type: Date, default: null },
  isActive:  { type: Boolean, default: true },
});

const Medication: Model<IMedication> =
  mongoose.models.Medication ?? mongoose.model<IMedication>('Medication', MedicationSchema);

export default Medication;
