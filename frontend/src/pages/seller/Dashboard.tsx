
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { getSellerProperties } from "@/services/propertyService";
import { Edit, Trash2, Plus } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // In a real app, we would pass the seller ID here
        const response = await getSellerProperties("s2");
        setProperties(response.properties);
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleDeleteProperty = (id: string) => {
    // In a real app, this would make an API call to delete the property
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

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
              <h1 className="text-2xl font-bold text-villain-800">Seller Dashboard</h1>
              <p className="text-gray-500">Welcome, {user?.name}</p>
            </div>
            <Link to="/property/create">
              <Button className="bg-villain-500 hover:bg-villain-600">
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-villain-500"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">You haven't added any properties yet</p>
                <Link to="/property/create">
                  <Button variant="outline">Add Your First Property</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 pl-4">Property</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Added Date</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="py-3 pl-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                              <img
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <Link 
                                to={`/property/${property.id}`}
                                className="font-medium text-villain-800 hover:text-villain-500"
                              >
                                {property.title}
                              </Link>
                              <div className="text-xs text-gray-500">
                                {property.address.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{property.type}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.forSale ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                            {property.forSale ? "For Sale" : "For Rent"}
                          </span>
                        </td>
                        <td className="font-medium">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0
                          }).format(property.price)}
                        </td>
                        <td className="text-sm text-gray-500">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </td>
                        <td className="pr-4">
                          <div className="flex space-x-2">
                            <Link to={`/property/edit/${property.id}`}>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
