
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '@/services/propertyService';
import Navbar from '@/components/ui/common/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => id ? getPropertyById(id) : Promise.reject('No property ID provided'),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="flex space-x-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-xl mb-6" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-villain-800 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you are looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  const handleImageChange = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-villain-600 hover:text-villain-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to listings
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-villain-800"
          >
            {property.title}
          </motion.h1>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-villain-50 text-villain-700">
              {property.type}
            </Badge>
            <span className="text-gray-500">
              {property.address.city}, Sri Lanka
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100"
            >
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[currentImage]}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </motion.div>

            {property.images && property.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      currentImage === index ? 'border-villain-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-villain-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-villain-800 mb-4">Property Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4 shadow-soft">
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="mt-1">
                    {property.address.house} {property.address.street}, 
                    <br />
                    {property.address.city}, {property.address.postalCode}
                  </div>
                </div>
                
                {property.beds && (
                  <div className="rounded-xl bg-white p-4 shadow-soft">
                    <div className="text-sm text-gray-500">Bedrooms</div>
                    <div className="mt-1 text-xl font-semibold">{property.beds}</div>
                  </div>
                )}
                
                {property.baths && (
                  <div className="rounded-xl bg-white p-4 shadow-soft">
                    <div className="text-sm text-gray-500">Bathrooms</div>
                    <div className="mt-1 text-xl font-semibold">{property.baths}</div>
                  </div>
                )}
                
                <div className="rounded-xl bg-white p-4 shadow-soft">
                  <div className="text-sm text-gray-500">Property Type</div>
                  <div className="mt-1">{property.type}</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white p-4 shadow-soft">
                <div className="text-sm text-gray-500">Features</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full ${property.options.parkingSpot ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <span>Parking Spot</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full ${property.options.furnished ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <span>Furnished</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl bg-white p-6 shadow-soft mb-6"
              >
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">
                    {property.forSale ? 'For Sale' : 'For Rent'}
                  </span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-villain-800">
                      LKR {property.discountPrice?.toLocaleString() || property.price.toLocaleString()}
                    </span>
                    {property.discountPrice && (
                      <span className="ml-2 text-lg line-through text-gray-400">
                        LKR {property.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full mb-3 bg-villain-500 hover:bg-villain-600 text-white">
                  Contact Seller
                </Button>
                
                <Button variant="outline" className="w-full">
                  Schedule Viewing
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl bg-villain-50 p-6"
              >
                <h3 className="font-semibold text-villain-800 mb-2">Property Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed on</span>
                    <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last updated</span>
                    <span>{new Date(property.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID</span>
                    <span>{property.id}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
