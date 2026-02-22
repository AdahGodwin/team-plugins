import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHospital extends Document {
  _id:      mongoose.Types.ObjectId;
  name:     string;
  address:  string;
  phone:    string;
  email:    string;
  registrationNo: string;
  isActive: boolean;
  createdAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name:           { type: String, required: true, trim: true, unique: true },
    address:        { type: String, required: true },
    phone:          { type: String, required: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    registrationNo: { type: String, required: true, trim: true },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Hospital: Model<IHospital> =
  mongoose.models.Hospital ?? mongoose.model<IHospital>('Hospital', HospitalSchema);

export default Hospital;
