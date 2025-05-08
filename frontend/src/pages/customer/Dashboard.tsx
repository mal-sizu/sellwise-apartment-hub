
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { Property } from "@/types";
import { getProperties } from "@/services/propertyService";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await getProperties({ page: 1, limit: 10 });
        setProperties(response.properties);
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-villain-800">Customer Dashboard</h1>
              <p className="text-gray-500">Welcome, {user?.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-villain-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <Link 
                    key={property.id} 
                    to={`/property/${property.id}`}
                    className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition duration-200"
                  >
                    <div className="relative pb-[65%] bg-gray-100">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-villain-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                        {property.forSale ? "For Sale" : "For Rent"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-villain-800 mb-1 truncate">
                        {property.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2 truncate">
                        {property.address.city}, {property.address.street}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-villain-800">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0
                          }).format(property.price)}
                        </p>
                        <div className="text-sm text-gray-600">
                          {property.beds} beds · {property.baths} baths
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-semibold mb-4">Your Saved Properties</h2>
            <p className="text-gray-500">You haven't saved any properties yet.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
