import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRiskScore extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  score: number;
  level: 'STABLE' | 'ELEVATED' | 'HIGH';
  drivers: string[];
  justification?: string;
  strokePreventionSteps?: string[];
  calculatedAt: Date;
}

const RiskScoreSchema = new Schema<IRiskScore>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  score: { type: Number, min: 0, max: 100 },
  level: { type: String, enum: ['STABLE', 'ELEVATED', 'HIGH'] },
  drivers: { type: [String], default: [] },
  justification: { type: String },
  strokePreventionSteps: { type: [String], default: [] },
  calculatedAt: { type: Date, default: Date.now },
});

const RiskScore: Model<IRiskScore> =
  mongoose.models.RiskScore ?? mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema);

export default RiskScore;
