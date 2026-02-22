import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  type: 'medication' | 'bp_alert' | 'appointment' | 'summary' | 'milestone';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    type:      {
      type: String,
      enum: ['medication', 'bp_alert', 'appointment', 'summary', 'milestone'],
      required: true,
    },
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    isRead:   { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
