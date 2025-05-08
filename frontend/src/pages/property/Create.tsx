import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema } from "@/schemas/propertySchema";
import { useAuth } from "@/context/AuthContext";
import { getProperties, createProperty, updateProperty } from "@/services/propertyService";
import { Property } from "@/types";
import Navbar from "@/components/ui/common/Navbar";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormFileUpload from "@/components/ui/form/FormFileUpload";

const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyFormSchema),
  });

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (propertyId: string) => {
    try {
      const data = await getProperties(propertyId);
      if (data?.properties) {
        setProperty(data.properties);
        
        // Populate form fields with property data
        Object.keys(data.properties).forEach(key => {
          setValue(key, data.properties[key]);
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
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a property.",
      });
      return;
    }

    const propertyData = {
      ...data,
      sellerId: user.id,
    };

    try {
      if (isEditMode && property?.id) {
        // Update existing property
        await updateProperty(property.id, propertyData);
        toast({
          title: "Success",
          description: "Property updated successfully.",
        });
      } else {
        // Create new property
        await createProperty(propertyData);
        toast({
          title: "Success",
          description: "Property created successfully.",
        });
      }
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Error creating/updating property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create/update property.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8"
        >
          <h1 className="text-2xl font-bold text-villain-800 mb-6">
            {isEditMode ? "Edit Property" : "Create New Property"}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Description"
              name="description"
              register={register}
              errors={errors}
              type="textarea"
            />
            <FormInput
              label="Price"
              name="price"
              register={register}
              errors={errors}
              type="number"
            />
            <FormInput
              label="Discount Price"
              name="discountPrice"
              register={register}
              errors={errors}
              type="number"
            />
            <FormSelect
              label="Type"
              name="type"
              register={register}
              errors={errors}
              options={["House", "Apartment", "Land", "Commercial"]}
            />
            <FormCheckbox
              label="For Sale"
              name="forSale"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Beds"
              name="beds"
              register={register}
              errors={errors}
              type="number"
            />
            <FormInput
              label="Baths"
              name="baths"
              register={register}
              errors={errors}
              type="number"
            />
            <FormInput
              label="Address Line 1"
              name="address.line1"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Address Line 2"
              name="address.line2"
              register={register}
              errors={errors}
            />
            <FormInput
              label="City"
              name="address.city"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Zip Code"
              name="address.zipCode"
              register={register}
              errors={errors}
            />
            <FormFileUpload
              label="Images"
              name="images"
              register={register}
              errors={errors}
            />
            <div>
              <Button type="submit" className="bg-villain-500 hover:bg-villain-600">
                {isEditMode ? "Update Property" : "Create Property"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Create;
