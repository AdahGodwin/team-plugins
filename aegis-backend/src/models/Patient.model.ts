import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatient extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hospitalId?: mongoose.Types.ObjectId;   // ← linked hospital
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: Date;
  address?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  allergies: string[];
  smokingStatus: 'never' | 'former' | 'current';
  diabetic: boolean;
  weight?: number;
  height?: number;
  caregiverName?: string;
  caregiverEmail?: string;
  caregiverPhone?: string;
  consentHealth: boolean;
  consentTerms: boolean;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hospitalId:    { type: Schema.Types.ObjectId, ref: 'Hospital', default: null },
    phoneNumber:   { type: String },
    gender:        { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth:   { type: Date },
    address:       { type: String },
    bloodGroup:    { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
    allergies:     { type: [String], default: [] },
    smokingStatus: { type: String, enum: ['never', 'former', 'current'], default: 'never' },
    diabetic:      { type: Boolean, default: false },
    weight:        { type: Number },
    height:        { type: Number },
    caregiverName:  { type: String },
    caregiverEmail: { type: String },
    caregiverPhone: { type: String },
    consentHealth: { type: Boolean, required: true },
    consentTerms:  { type: Boolean, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Patient: Model<IPatient> =
  mongoose.models.Patient ?? mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
