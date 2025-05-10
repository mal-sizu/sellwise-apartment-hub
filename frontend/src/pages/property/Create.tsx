import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema } from "@/schemas/propertySchema";
import { useAuth } from "@/context/AuthContext";
import { getPropertyById, createProperty, updateProperty } from "@/services/propertyService";
import { Property } from "@/types";
import Navbar from "@/components/ui/common/Navbar";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormFileUpload from "@/components/ui/form/FormFileUpload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize form with the exact structure expected by the schema
  const methods = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      discountPrice: "",
      type: "Residential",
      forSale: false,
      beds: "",
      baths: "",
      address: {
        house: "",
        street: "",
        city: "",
        postalCode: ""
      },
      options: {
        parkingSpot: false,
        furnished: false
      },
      images: []
    }
  });

  console.log("Form errors:", methods.formState.errors);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (propertyId: string) => {
    try {
      const data = await getPropertyById(propertyId);
      if (data) {
        setProperty(data);
        
        // Map API data to form fields
        // This is important for handling different field structures
        methods.reset({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          discountPrice: data.discountPrice?.toString() || "",
          type: data.type || "Residential",
          forSale: data.forSale || false,
          beds: data.beds?.toString() || "",
          baths: data.baths?.toString() || "",
          address: {
            house: data.address?.house || "",
            street: data.address?.street || "",
            city: data.address?.city || "",
            postalCode: data.address?.postalCode || ""
          },
          options: {
            parkingSpot: data.options?.parkingSpot || false,
            furnished: data.options?.furnished || false
          },
          images: data.images || []
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch property data.",
        });
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch property data.",
      });
    }
  };

  const onSubmit = async (data: any) => {
    console.log("Form data submitted:", data);
    
    if (!user?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a property.",
      });
      return;
    }

    try {
      // Process images to ensure they're in the correct format
      let processedImages = [];
      
      // Check if images exist and process them
      if (data.images && Array.isArray(data.images)) {
        // Upload each image to Firebase Storage and get URLs
        const uploadPromises = data.images.map(async (img) => {
          if (img instanceof File) {
            const storageRef = ref(storage, `properties/${Date.now()}_${img.name}`);
            const uploadResult = await uploadBytes(storageRef, img);
            return await getDownloadURL(uploadResult.ref);
          } else if (typeof img === 'string' && img.startsWith('http')) {
            // If it's already a URL, keep it as is
            return img;
          }
          // If it's an object with existing Firebase URL
          else if (typeof img === 'object' && img !== null && img.url) {
            return img.url;
          }
          return null;
        });

        // Wait for all uploads to complete and filter out any null values
        processedImages = (await Promise.all(uploadPromises)).filter(url => url !== null);
      } else if (typeof data.images === 'string') {
        // If it's a single string and it's a File object
        if (data.images instanceof File) {
          const storageRef = ref(storage, `properties/${Date.now()}_${data.images.name}`);
          const uploadResult = await uploadBytes(storageRef, data.images);
          const url = await getDownloadURL(uploadResult.ref);
          processedImages = [url];
        } else if (data.images.startsWith('http')) {
          // If it's already a URL, keep it
          processedImages = [data.images];
        }
      }
      console.log("Processed images:", processedImages);

      // Format the data to match the API expectations
      const propertyData = {
        title: data.title,
        description: data.description,
        type: data.type,
        forSale: data.forSale,
        // Convert string values to numbers
        price: data.price ? Number(data.price) : undefined,
        discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
        beds: data.beds ? Number(data.beds) : undefined,
        baths: data.baths ? Number(data.baths) : undefined,
        // Ensure address is properly structured
        address: {
          house: data.address.house,
          street: data.address.street,
          city: data.address.city,
          postalCode: data.address.postalCode
        },
        options: {
          parkingSpot: Boolean(data.options.parkingSpot),
          furnished: Boolean(data.options.furnished)
        },
        // Use the processed images array
        images: processedImages,
        sellerId: user._id
      };

      console.log("Formatted property data:", propertyData);

      if (isEditMode && property?._id) {
        await updateProperty(property._id, propertyData);
        toast({
          title: "Success",
          description: "Property updated successfully.",
        });
      } else {
        const result = await createProperty(propertyData);
        console.log("Property creation result:", result);
        toast({
          title: "Success",
          description: "Property created successfully.",
        });
      }
      navigate("/seller/dashboard");
    } catch (error: any) {
      console.error("Error creating/updating property:", error);
      // More detailed error message
      const errorMessage = error.response?.data?.message || "Failed to create/update property.";
      console.log("Error details:", error.response?.data);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  // Property type options for the select dropdown
  const propertyTypeOptions = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Industrial", label: "Industrial" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft p-8"
        >
          <h1 className="text-2xl font-bold text-villain-800 mb-6">
            {isEditMode ? "Edit Property" : "Create New Property"}
          </h1>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* Basic Information Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-villain-700 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormInput
                      name="title"
                      label="Property Title"
                      rules={{ required: "Title is required" }}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <FormInput
                      name="description"
                      label="Description"
                      multiline={true}
                      rows={4}
                      rules={{ required: "Description is required" }}
                    />
                  </div>
                  
                  <FormSelect
                    name="type"
                    label="Property Type"
                    options={propertyTypeOptions}
                    placeholder="Select property type"
                    rules={{ required: "Property type is required" }}
                  />
                  
                  <div className="flex items-center mt-6">
                    <FormCheckbox
                      name="forSale"
                      label="This property is for sale"
                    />
                  </div>
                </div>
              </div>
              
              {/* Pricing Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-villain-700 mb-4 pb-2 border-b border-gray-200">
                  Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="price"
                    label="Price"
                    type="number"
                    rules={{ required: "Price is required" }}
                  />
                  
                  <FormInput
                    name="discountPrice"
                    label="Discount Price (Optional)"
                    type="number"
                  />
                </div>
              </div>
              
              {/* Property Details Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-villain-700 mb-4 pb-2 border-b border-gray-200">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="beds"
                    label="Bedrooms"
                    type="number"
                    rules={{ required: "Number of bedrooms is required" }}
                  />
                  
                  <FormInput
                    name="baths"
                    label="Bathrooms"
                    type="number"
                    rules={{ required: "Number of bathrooms is required" }}
                  />
                  
                  <FormCheckbox
                    name="options.parkingSpot"
                    label="Parking Spot Available"
                  />
                  
                  <FormCheckbox
                    name="options.furnished"
                    label="Furnished"
                  />
                </div>
              </div>
              
              {/* Address Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-villain-700 mb-4 pb-2 border-b border-gray-200">
                  Property Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="address.house"
                    label="House/Building Number"
                    rules={{ required: "House/building number is required" }}
                  />
                  
                  <FormInput
                    name="address.street"
                    label="Street"
                    rules={{ required: "Street is required" }}
                  />
                  
                  <FormInput
                    name="address.city"
                    label="City"
                    rules={{ required: "City is required" }}
                  />
                  
                  <FormInput
                    name="address.postalCode"
                    label="Postal Code"
                    rules={{ required: "Postal code is required" }}
                  />
                </div>
              </div>
              
              {/* Images Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-villain-700 mb-4 pb-2 border-b border-gray-200">
                  Property Images
                </h2>
                <FormFileUpload
                  name="images"
                  label="Upload Images"
                  accept="image/jpeg, image/png"
                  multiple={true}
                  maxFiles={6}
                  maxSize={2} // 2MB as per schema
                  rules={{ required: isEditMode ? false : "At least one image is required" }}
                />
              </div>
              
              {/* Error Messages */}
              {methods.formState.errors && Object.keys(methods.formState.errors).length > 0 && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="text-red-800 font-medium mb-2">Please correct the following errors:</h3>
                  <pre className="text-xs overflow-auto max-h-40 p-2 bg-white rounded border border-red-100">
                    {JSON.stringify(methods.formState.errors, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-villain-500 hover:bg-villain-600">
                  {isEditMode ? "Update Property" : "Create Property"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default Create;
