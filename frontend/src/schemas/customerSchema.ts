
import { z } from "zod";

// Schema for customer registration form
export const customerRegistrationSchema = z.object({
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
  address: z
    .string()
    .optional(),
  interests: z
    .array(z.string())
    .optional(),
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
export type CustomerRegistrationFormValues = z.infer<typeof customerRegistrationSchema>;
