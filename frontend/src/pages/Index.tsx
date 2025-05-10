import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/ui/common/Navbar";
import { getProperties } from "@/services/propertyService";
import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-soft"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className="absolute top-3 left-3"
          variant="outline"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          {property.forSale ? "For Sale" : "For Rent"}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-villain-800 text-lg mb-1 truncate">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          {property.address.city}, Sri Lanka
        </p>
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-villain-800">
            LKR {property.discountPrice?.toLocaleString() || property.price.toLocaleString()}
          </div>
          <Badge variant="outline">{property.type}</Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.beds && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <span>{property.beds} Beds</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>{property.baths} Baths</span>
            </div>
          )}
        </div>
        <Link to={`/property/${property._id}`}>
          <Button className="w-full bg-villain-500 hover:bg-villain-600">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const Index = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  });

  const featuredProperties = data?.properties || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold text-villain-800 mb-4">
                Find Your Perfect Property
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Browse thousands of property listings across Sri Lanka. 
                Buy, sell, or rent properties with ease through our comprehensive platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center px-6 py-3 bg-villain-500 hover:bg-villain-600 text-white rounded-xl shadow-sm transition-colors duration-200"
                >
                  Get Started
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
                
                <Link
                  to="/seller/register"
                  className="rounded-2xl bg-white px-6 py-3 text-villain-800 border border-gray-300 shadow-sm hover:bg-gray-50 transition"
                >
                  Register as Seller
                </Link>
                
                <Link
                  to="/chat"
                  className="rounded-2xl bg-villain-500 px-6 py-3 text-white border border-villain-500 shadow-sm hover:bg-villain-600 transition flex items-center"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat with Assistant
                </Link>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Property Management"
                className="rounded-2xl shadow-soft"
                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </motion.div>
        </section>
        
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-villain-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Featured Properties
            </motion.h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-10">
              <Link to="/login">
                <Button variant="outline" className="px-8 py-2">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-villain-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Key Features
            </motion.h2>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="card bg-white p-6 rounded-2xl shadow-soft">
                <div className="bg-villain-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-villain-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-villain-800 mb-2">Seller Management</h3>
                <p className="text-gray-600">
                  Register, approve, and manage sellers with an intuitive dashboard.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="card bg-white p-6 rounded-2xl shadow-soft">
                <div className="bg-villain-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-villain-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-villain-800 mb-2">Property Listings</h3>
                <p className="text-gray-600">
                  Create and manage detailed property listings with validation.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="card bg-white p-6 rounded-2xl shadow-soft">
                <div className="bg-villain-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-villain-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-villain-800 mb-2">Reporting</h3>
                <p className="text-gray-600">
                  Generate detailed reports for properties and sales activities.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-villain-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Property & Seller Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
