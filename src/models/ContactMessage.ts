// src/models/ContactMessage.ts
import { Schema, model, models, type Document } from "mongoose";

export interface IContactMessageDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactMessage =
  models.ContactMessage || model<IContactMessageDocument>("ContactMessage", ContactMessageSchema);
