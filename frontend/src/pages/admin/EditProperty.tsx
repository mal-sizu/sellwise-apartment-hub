import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "../../components/ui/common/Navbar";
import AdminSidebar from "../../components/ui/admin/AdminSidebar";
import { getPropertyById, updateProperty } from "../../services/propertyService";
import { Property } from "../../types";
import { SRI_LANKA_CITIES, PROPERTY_TYPES } from "../../constants";
import { propertyFormSchema } from "../../schemas/propertySchema";
import { z } from "zod";

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [forSale, setForSale] = useState(true);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [parkingSpot, setParkingSpot] = useState(false);
  const [furnished, setFurnished] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
        
        // Populate form fields
        setTitle(data.title);
        setType(data.type);
        setDescription(data.description);
        setHouse(data.address.house);
        setStreet(data.address.street);
        setCity(data.address.city);
        setPostalCode(data.address.postalCode);
        setForSale(data.forSale);
        setPrice(data.price.toString());
        setDiscountPrice(data.discountPrice ? data.discountPrice.toString() : "");
        setBeds(data.beds ? data.beds.toString() : "");
        setBaths(data.baths ? data.baths.toString() : "");
        setParkingSpot(data.options?.parkingSpot || false);
        setFurnished(data.options?.furnished || false);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  const validateForm = () => {
    try {
      // Create a modified schema that doesn't require images for editing
      const editSchema = propertyFormSchema.omit({ images: true });
      
      editSchema.parse({
        title,
        type,
        description,
        address: {
          house,
          street,
          city,
          postalCode,
        },
        forSale,
        price,
        discountPrice: discountPrice || undefined,
        beds: beds || undefined,
        baths: baths || undefined,
        options: {
          parkingSpot,
          furnished,
        },
      });
      
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    if (!id) return;
    
    try {
      setSaving(true);
      
      const updatedProperty = {
        title,
        type,
        description,
        address: {
          house,
          street,
          city,
          postalCode,
        },
        forSale,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        beds: beds ? Number(beds) : undefined,
        baths: baths ? Number(baths) : undefined,
        options: {
          parkingSpot,
          furnished,
        },
      };
      
      await updateProperty(id, updatedProperty);
      toast.success("Property updated successfully");
      navigate("/admin/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex">
          <AdminSidebar />
          <div className="flex-1 ml-0 md:ml-6 flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-4 border-villain-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex">
          <AdminSidebar />
          <div className="flex-1 ml-0 md:ml-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Property not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The property you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <button
                onClick={() => navigate("/admin/properties")}
                className="mt-4 btn-primary"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 flex">
        <AdminSidebar />
        
        <motion.div
          className="flex-1 ml-0 md:ml-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1 
              className="text-2xl font-bold text-villain-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Edit Property
            </motion.h1>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/admin/properties")}
              className="btn-secondary"
            >
              Back to Properties
            </motion.button>
          </div>
          
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-xl font-semibold text-villain-800">Basic Information</h2>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`form-input ${formErrors["title"] ? "border-red-500" : ""}`}
                    />
                    {formErrors["title"] && (
                      <p className="mt-1 text-sm text-red-500">{formErrors["title"]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className={`form-input ${formErrors["type"] ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formErrors["type"] && (
                      <p className="mt-1 text-sm text-red-500">{formErrors["type"]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className={`form-input ${formErrors["description"] ? "border-red-500" : ""}`}
                    ></textarea>
                    {formErrors["description"] && (
                      <p className="mt-1 text-sm text-red-500">{formErrors["description"]}</p>
                    )}
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-xl font-semibold text-villain-800">Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="house" className="block text-sm font-medium text-gray-700 mb-1">
                        House/Building Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="house"
                        value={house}
                        onChange={(e) => setHouse(e.target.value)}
                        className={`form-input ${formErrors["address.house"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["address.house"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["address.house"]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={`form-input ${formErrors["address.street"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["address.street"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["address.street"]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`form-input ${formErrors["address.city"] ? "border-red-500" : ""}`}
                      >
                        <option value="">Select City</option>
                        {SRI_LANKA_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {formErrors["address.city"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["address.city"]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={`form-input ${formErrors["address.postalCode"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["address.postalCode"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["address.postalCode"]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Information */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-xl font-semibold text-villain-800">Price Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Listing Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={forSale}
                            onChange={() => setForSale(true)}
                            className="form-radio"
                          />
                          <span className="ml-2">For Sale</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!forSale}
                            onChange={() => setForSale(false)}
                            className="form-radio"
                          />
                          <span className="ml-2">For Rent</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`form-input ${formErrors["price"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["price"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["price"]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        id="discountPrice"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className={`form-input ${formErrors["discountPrice"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["discountPrice"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["discountPrice"]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-xl font-semibold text-villain-800">Property Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="beds"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className={`form-input ${formErrors["beds"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["beds"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["beds"]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="baths"
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        className={`form-input ${formErrors["baths"] ? "border-red-500" : ""}`}
                      />
                      {formErrors["baths"] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors["baths"]}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={parkingSpot}
                        onChange={(e) => setParkingSpot(e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Parking Spot</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={furnished}
                        onChange={(e) => setFurnished(e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Furnished</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⟳</span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProperty;