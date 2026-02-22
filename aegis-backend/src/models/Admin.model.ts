import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;   

  hospitalName:     string;
  hospitalAddress:  string;
  hospitalPhone:    string;
  hospitalEmail:    string;
  registrationNo:   string;          
  specialty:        string;          
  licenseNumber:    string;          
  title:            string;           

  department:       string;
  jobTitle:         string;           

  isVerified:       boolean;        
  createdAt:        Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hospitalId:       { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },

    hospitalName:     { type: String, required: true, trim: true },
    hospitalAddress:  { type: String, required: true },
    hospitalPhone:    { type: String, required: true },
    hospitalEmail:    { type: String, required: true, lowercase: true, trim: true },
    registrationNo:   { type: String, required: true, trim: true },

    specialty:        { type: String, required: true, trim: true },
    licenseNumber:    { type: String, required: true, trim: true },
    title:            { type: String, required: true, trim: true },

    department:       { type: String, required: true, trim: true },
    jobTitle:         { type: String, required: true, trim: true },

    isVerified:       { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
