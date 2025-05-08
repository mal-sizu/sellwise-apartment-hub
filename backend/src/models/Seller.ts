import { Schema, model, Document } from 'mongoose';

export interface ISeller extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferredLanguages: string[];
  business?: {
    name?: string;
    registrationNumber?: string;
    designation?: string;
  };
  username: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  registrationDate: Date;
}

const SellerSchema = new Schema(
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
    identification: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
    },
    preferredLanguages: {
      type: [String],
      required: true,
    },
    business: {
      name: String,
      registrationNumber: String,
      designation: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model<ISeller>('Seller', SellerSchema);