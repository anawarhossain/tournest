// src/models/Subscriber.ts
import { Schema, model, models, type Document } from "mongoose";

export interface ISubscriberDocument extends Document {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Subscriber = models.Subscriber || model<ISubscriberDocument>("Subscriber", SubscriberSchema);
