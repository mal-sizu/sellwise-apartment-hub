
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { sellerRegistrationSchema, SellerRegistrationFormValues } from "../../schemas/sellerSchema";
import FormInput from "../../components/ui/form/FormInput";
import FormFileUpload from "../../components/ui/form/FormFileUpload";
import FormMultiSelect from "../../components/ui/form/FormMultiSelect";
import Navbar from "../../components/ui/common/Navbar";
import { LANGUAGES } from "../../constants";
import { getSellerById, updateSeller, deleteSeller } from "../../services/sellerService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  // In a real app, we would get the ID from authentication context
  const sellerId = "s1";
  
  const methods = useForm<SellerRegistrationFormValues>({
    resolver: zodResolver(sellerRegistrationSchema),
    mode: "onBlur"
  });

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        const seller = await getSellerById(sellerId);
        
        if (seller) {
          // Transform data to match form schema
          methods.reset({
            firstName: seller.firstName,
            lastName: seller.lastName,
            email: seller.email,
            phone: seller.phone,
            identification: seller.identification,
            bio: seller.bio || "",
            preferredLanguages: seller.preferredLanguages,
            socialLinks: {
              facebook: seller.socialLinks?.facebook || "",
              linkedin: seller.socialLinks?.linkedin || "",
              instagram: seller.socialLinks?.instagram || ""
            },
            business: {
              name: seller.business?.name || "",
              registrationNumber: seller.business?.registrationNumber || "",
              designation: seller.business?.designation || ""
            },
            username: seller.username,
            // In a real app, you wouldn't receive these from API
            password: "placeholder-password",
            confirmPassword: "placeholder-password",
            agreeTerms: true
          });
        }
      } catch (error) {
        console.error("Error loading seller data:", error);
        toast.error("Failed to load your profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSellerData();
  }, [sellerId]);

  const onSubmit = async (data: SellerRegistrationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert profile picture to URL string if it exists
      const profileImageUrl = data.profilePicture instanceof File ? 
        URL.createObjectURL(data.profilePicture) : 
        data.profilePicture;
      
      await updateSeller(sellerId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        identification: data.identification,
        profilePicture: profileImageUrl,
        bio: data.bio,
        preferredLanguages: data.preferredLanguages,
        socialLinks: data.socialLinks,
        business: data.business,
        username: data.username
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating seller:", error);
      toast.error("Failed to update profile");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await deleteSeller(sellerId);
      toast.success("Profile deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting seller:", error);
      toast.error("Failed to delete profile");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-villain-800">
                Seller Profile
              </h1>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-600 transition flex items-center"
                type="button"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Delete Profile
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-villain-500"
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
            ) : (
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
                      name="identification"
                      label="NIC/Passport"
                      placeholder="123456789V or AB123456"
                    />
                    
                    <FormFileUpload
                      name="profilePicture"
                      label="Profile Picture"
                      accept="image/jpeg, image/png"
                      maxSize={2}
                    />
                    
                    <div className="grid grid-cols-1">
                      <FormInput
                        name="bio"
                        label="Short Bio"
                        placeholder="Tell us about yourself (max 200 characters)"
                        info="Max 200 characters"
                      />
                      
                      <FormMultiSelect
                        name="preferredLanguages"
                        label="Preferred Languages"
                        options={LANGUAGES}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Social Links */}
                  <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-villain-800 mb-4">
                      Social Links (Optional)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="socialLinks.facebook"
                        label="Facebook"
                        placeholder="https://facebook.com/yourusername"
                      />
                      
                      <FormInput
                        name="socialLinks.linkedin"
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/yourusername"
                      />
                    </div>
                    
                    <FormInput
                      name="socialLinks.instagram"
                      label="Instagram"
                      placeholder="https://instagram.com/yourusername"
                    />
                  </motion.div>
                  
                  {/* Business Details */}
                  <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-villain-800 mb-4">
                      Business Details (Optional)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="business.name"
                        label="Business Name"
                        placeholder="Your Business Name"
                      />
                      
                      <FormInput
                        name="business.registrationNumber"
                        label="Registration Number"
                        placeholder="BR12345"
                      />
                    </div>
                    
                    <FormInput
                      name="business.designation"
                      label="Designation"
                      placeholder="Your position/role in the company"
                    />
                  </motion.div>
                  
                  {/* Username */}
                  <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-villain-800 mb-4">
                      Account Information
                    </h2>
                    
                    <FormInput
                      name="username"
                      label="Username"
                      placeholder="johndoe"
                      disabled={true}
                      info="Username cannot be changed"
                    />
                  </motion.div>
                  
                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
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
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              </FormProvider>
            )}
          </motion.div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            />
            
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your profile? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center">
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
                        Deleting...
                      </div>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
