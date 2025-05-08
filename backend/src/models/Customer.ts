import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  interests?: string[];
  registrationDate: Date;
}

const CustomerSchema = new Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    interests: {
      type: [String],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model<ICustomer>('Customer', CustomerSchema);