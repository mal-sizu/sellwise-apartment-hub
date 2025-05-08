
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerRegistrationSchema } from "@/schemas/sellerSchema";
import { createSeller } from "@/services/sellerService";
import { registerSeller } from "@/services/authService";
import FormInput from "@/components/ui/form/FormInput";
import FormFileUpload from "@/components/ui/form/FormFileUpload";
import FormMultiSelect from "@/components/ui/form/FormMultiSelect";
import Navbar from "@/components/ui/common/Navbar";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Convert profile picture to URL string if it exists
      const profileImageUrl = data.profilePicture instanceof File ? 
        URL.createObjectURL(data.profilePicture) : 
        undefined;
      
      // Create an object with the seller data
      const sellerData = {
        ...data,
        profilePicture: profileImageUrl,
        preferredLanguages: data.preferredLanguages || [],
      };
      
      // Register the seller (this will create both user and seller records)
      await registerSeller(sellerData);
      
      setSubmissionSuccess(true);
      window.scrollTo(0, 0);
      toast({
        title: "Registration successful",
        description: "Your registration has been submitted for review.",
      });
      reset();
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
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-villain-700 mb-4">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                    placeholder="Enter your first name"
                  />
                  
                  <FormInput
                    label="Last Name"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                    placeholder="Enter your last name"
                  />
                  
                  <FormInput
                    label="Username"
                    error={errors.username?.message}
                    {...register("username")}
                    placeholder="Choose a username"
                  />
                  
                  <FormInput
                    label="Email Address"
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                    placeholder="Enter your email address"
                  />
                  
                  <FormInput
                    label="Phone Number"
                    error={errors.phone?.message}
                    {...register("phone")}
                    placeholder="Enter your phone number"
                  />
                  
                  <FormInput
                    label="ID Number"
                    error={errors.identification?.message}
                    {...register("identification")}
                    placeholder="Enter your ID number"
                    helperText="National ID, passport, or driver's license"
                  />
                </div>
                
                <div className="mt-6">
                  <FormFileUpload
                    label="Profile Picture"
                    error={errors.profilePicture?.message}
                    {...register("profilePicture")}
                    accept="image/*"
                    setValue={setValue}
                    name="profilePicture"
                  />
                </div>
                
                <div className="mt-6">
                  <FormInput
                    label="Bio"
                    error={errors.bio?.message}
                    {...register("bio")}
                    placeholder="Tell us about yourself"
                    textarea
                    rows={4}
                  />
                </div>
                
                <div className="mt-6">
                  <FormMultiSelect
                    label="Preferred Languages"
                    error={errors.preferredLanguages?.message}
                    {...register("preferredLanguages")}
                    options={languageOptions}
                    placeholder="Select languages"
                    setValue={setValue}
                    name="preferredLanguages"
                  />
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-villain-700 mb-4">
                  Social Media Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Facebook"
                    error={errors.socialLinks?.facebook?.message}
                    {...register("socialLinks.facebook")}
                    placeholder="Your Facebook profile URL"
                  />
                  
                  <FormInput
                    label="LinkedIn"
                    error={errors.socialLinks?.linkedin?.message}
                    {...register("socialLinks.linkedin")}
                    placeholder="Your LinkedIn profile URL"
                  />
                </div>
                
                <div className="mt-6">
                  <FormInput
                    label="Instagram"
                    error={errors.socialLinks?.instagram?.message}
                    {...register("socialLinks.instagram")}
                    placeholder="Your Instagram profile URL"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-villain-700 mb-4">
                  Business Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Business Name"
                    error={errors.business?.name?.message}
                    {...register("business.name")}
                    placeholder="Enter your business name"
                  />
                  
                  <FormInput
                    label="Business Registration Number"
                    error={errors.business?.registrationNumber?.message}
                    {...register("business.registrationNumber")}
                    placeholder="Enter registration number"
                  />
                </div>
                
                <div className="mt-6">
                  <FormInput
                    label="Designation/Position"
                    error={errors.business?.designation?.message}
                    {...register("business.designation")}
                    placeholder="Your position in the business"
                  />
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
