
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { customerRegistrationSchema, CustomerRegistrationFormValues } from "../../schemas/customerSchema";
import FormInput from "../../components/ui/form/FormInput";
import FormCheckbox from "../../components/ui/form/FormCheckbox";
import FormMultiSelect from "../../components/ui/form/FormMultiSelect";
import Navbar from "../../components/ui/common/Navbar";
import { register } from "../../services/authService";
import { toast } from "@/hooks/use-toast";

const PROPERTY_TYPES = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Industrial", label: "Industrial" },
];

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<CustomerRegistrationFormValues>({
    resolver: zodResolver(customerRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      interests: [],
      username: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false
    }
  });

  const onSubmit = async (data: CustomerRegistrationFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await register(data, 'customer');
      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-villain-800 mb-6">
              Customer Registration
            </h1>
            
            <FormProvider {...methods}>
              <motion.form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Personal Information */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-semibold text-villain-800 mb-4">
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                    />
                    
                    <FormInput
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="email"
                      label="Email"
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                    
                    <FormInput
                      name="phone"
                      label="Phone"
                      placeholder="0771234567"
                    />
                  </div>
                  
                  <FormInput
                    name="address"
                    label="Address (optional)"
                    placeholder="Your address"
                  />
                  
                  <FormMultiSelect
                    name="interests"
                    label="Property Interests (optional)"
                    options={PROPERTY_TYPES}
                  />
                </motion.div>
                
                {/* Login Credentials */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-semibold text-villain-800 mb-4">
                    Login Credentials
                  </h2>
                  
                  <FormInput
                    name="username"
                    label="Username"
                    placeholder="johndoe"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="********"
                    />
                    
                    <FormInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="********"
                    />
                  </div>
                </motion.div>
                
                {/* Terms and Conditions */}
                <motion.div variants={itemVariants}>
                  <FormCheckbox
                    name="agreeTerms"
                    label="I confirm that all information provided is accurate and complete."
                  />
                </motion.div>
                
                {/* Submit Button */}
                <motion.div variants={itemVariants} className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-villain-500 hover:bg-villain-600 text-white font-medium py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-villain-300 focus:ring-opacity-50 inline-flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Register as Customer"
                    )}
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-villain-500 hover:underline"
                    >
                      Log in here
                    </Link>
                  </p>
                </motion.div>
              </motion.form>
            </FormProvider>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Register;
