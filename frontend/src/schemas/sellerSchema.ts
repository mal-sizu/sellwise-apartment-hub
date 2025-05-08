
import { z } from "zod";

// Schema for seller registration form
export const sellerRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  identification: z
    .string()
    .min(1, "NIC/Passport is required"),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= 2 * 1024 * 1024; // 2MB max
    }, "Profile picture must be less than 2MB")
    .refine((file) => {
      if (!file) return true;
      return ['image/jpeg', 'image/png'].includes(file.type);
    }, "Profile picture must be JPEG or PNG format"),
  bio: z
    .string()
    .max(200, "Bio must be less than 200 characters")
    .optional(),
  preferredLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
  socialLinks: z.object({
    facebook: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    linkedin: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    instagram: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  }).optional(),
  business: z.object({
    name: z.string().optional(),
    registrationNumber: z.string().optional(),
    designation: z.string().optional(),
  }).optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Confirm password is required"),
  agreeTerms: z
    .boolean()
    .refine(val => val === true, "You must agree to the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type for the form values based on the schema
export type SellerRegistrationFormValues = z.infer<typeof sellerRegistrationSchema>;
