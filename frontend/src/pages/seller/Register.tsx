import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerRegistrationSchema } from "@/schemas/sellerSchema";
import { createSeller } from "@/services/sellerService";
import { registerSeller } from "@/services/authService";
import FormInput from "@/components/ui/form/FormInput";
import FormFileUpload from "@/components/ui/form/FormFileUpload";
import FormMultiSelect from "@/components/ui/form/FormMultiSelect";
import Navbar from "@/components/ui/common/Navbar";
import { toast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  identification: string;
  profilePicture?: File;
  bio: string;
  preferredLanguages: string[];
  socialLinks: {
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  business: {
    name: string;
    registrationNumber: string;
    designation: string;
  };
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      identification: "",
      bio: "",
      preferredLanguages: [],
      socialLinks: {
        facebook: "",
        linkedin: "",
        instagram: "",
      },
      business: {
        name: "",
        registrationNumber: "",
        designation: "",
      },
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const profileImageUrl = data.profilePicture instanceof File ? 
        URL.createObjectURL(data.profilePicture) : 
        undefined;
      
      const sellerData = {
        ...data,
        profilePicture: profileImageUrl,
        preferredLanguages: data.preferredLanguages || [],
      };
      
      await registerSeller(sellerData);
      
      setSubmissionSuccess(true);
      window.scrollTo(0, 0);
      toast({
        title: "Registration successful",
        description: "Your registration has been submitted for review.",
      });
      methods.reset();
    } catch (error) {
      console.error("Error registering seller:", error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" },
  ];

  if (submissionSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-villain-800">Registration Submitted</h2>
              <p className="text-gray-600 mt-2">
                Your seller application has been submitted for review. We will contact you soon!
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-villain-500 hover:bg-villain-600"
              >
                Go to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmissionSuccess(false);
                  window.scrollTo(0, 0);
                }}
              >
                Register Another Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Custom password input with visibility toggle
  const PasswordInput = ({ 
    name, 
    label, 
    placeholder, 
    showPassword, 
    toggleVisibility, 
    validation 
  }: { 
    name: FieldPath<FormData>; 
    label: string; 
    placeholder: string; 
    showPassword: boolean; 
    toggleVisibility: () => void; 
    validation: any; 
  }) => (
    <div className="relative">
      <FormInput<FormData>
        name={name}
        label={label}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        rules={validation}
      />
      <button
        type="button"
        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.preventDefault();
          toggleVisibility();
        }}
      >
        {showPassword ? (
          // Eye-off icon (password visible)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" 
              clipRule="evenodd" 
            />
            <path 
              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" 
            />
          </svg>
        ) : (
          // Eye icon (password hidden)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              d="M10 12a2 2 0 100-4 2 2 0 000 4z" 
            />
            <path 
              fillRule="evenodd" 
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft p-8"
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-villain-800 mb-2">Seller Registration</h1>
            <p className="text-gray-600 mb-6">
              Join our platform as a property seller and start listing your properties.
            </p>
            
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-villain-700 mb-4">
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput<FormData>
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      rules={{ required: "First name is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      rules={{ required: "Last name is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="username"
                      label="Username"
                      placeholder="Choose a username"
                      rules={{ required: "Username is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email address"
                      rules={{ required: "Email is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      rules={{ required: "Phone number is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="identification"
                      label="ID Number"
                      placeholder="Enter your ID number"
                      description="National ID, passport, or driver's license"
                      rules={{ required: "ID number is required" }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormFileUpload<FormData>
                      name="profilePicture"
                      label="Profile Picture"
                      accept="image/*"
                      rules={{ required: "Profile picture is required" }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormInput<FormData>
                      name="bio"
                      label="Bio"
                      placeholder="Tell us about yourself"
                      multiline
                      rows={4}
                      rules={{ required: "Bio is required" }}
                    />
                  </div>

                  <div className="mt-6">
                    <FormMultiSelect<FormData>
                      name="preferredLanguages"
                      label="Preferred Languages"
                      options={languageOptions}
                      rules={{ required: "Please select at least one language" }}
                    />
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-villain-700 mb-4">
                    Social Media Links
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput<FormData>
                      name="socialLinks.facebook"
                      label="Facebook"
                      placeholder="Your Facebook profile URL"
                    />
                    
                    <FormInput<FormData>
                      name="socialLinks.linkedin"
                      label="LinkedIn"
                      placeholder="Your LinkedIn profile URL"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormInput<FormData>
                      name="socialLinks.instagram"
                      label="Instagram"
                      placeholder="Your Instagram profile URL"
                    />
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-villain-700 mb-4">
                    Business Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput<FormData>
                      name="business.name"
                      label="Business Name"
                      placeholder="Enter your business name"
                      rules={{ required: "Business name is required" }}
                    />
                    
                    <FormInput<FormData>
                      name="business.registrationNumber"
                      label="Business Registration Number"
                      placeholder="Enter registration number"
                      rules={{ required: "Registration number is required" }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormInput<FormData>
                      name="business.designation"
                      label="Designation/Position"
                      placeholder="Your position in the business"
                      rules={{ required: "Designation is required" }}
                    />
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-villain-700 mb-4">
                    Login Credentials
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PasswordInput
                      name="password"
                      label="Password"
                      placeholder="Create a strong password"
                      showPassword={showPassword}
                      toggleVisibility={() => setShowPassword(!showPassword)}
                      validation={{ 
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        }
                      }}
                    />
                    
                    <PasswordInput
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      showPassword={showConfirmPassword}
                      toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                      validation={{ 
                        required: "Please confirm your password",
                        validate: (value) => 
                          value === methods.getValues("password") || 
                          "Passwords do not match"
                      }}
                    />
                  </div>
                  
                  <div className="mt-6 flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-villain-500 focus:ring-villain-500/20"
                        {...methods.register("agreeTerms", {
                          required: "You must agree to the terms and conditions"
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="text-gray-700">
                        I agree to the <a href="#" className="text-villain-500 hover:underline">Terms and Conditions</a> and <a href="#" className="text-villain-500 hover:underline">Privacy Policy</a>
                      </label>
                      {methods.formState.errors.agreeTerms && (
                        <p className="mt-1 text-xs text-red-500 animate-fade-in">
                          {methods.formState.errors.agreeTerms.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 space-y-4 md:space-y-0">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-villain-500 hover:underline font-medium">
                      Login here
                    </Link>
                  </p>
                  
                  <Button
                    type="submit"
                    className="bg-villain-500 hover:bg-villain-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Register as Seller"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
