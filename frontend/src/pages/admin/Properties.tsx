import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/ui/common/Navbar";
import AdminSidebar from "../../components/ui/admin/AdminSidebar";
import { getProperties, deleteProperty, generateReport } from "../../services/propertyService";
import { Property, PaginationParams, SortParams, FilterParams } from "../../types";
import { SRI_LANKA_CITIES, PROPERTY_TYPES } from "../../constants";
import { toast } from "sonner";
import { File } from "lucide-react";

const Properties = () => { 
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<SortParams>({
    field: "updatedAt",
    direction: "desc"
  });
  const [filters, setFilters] = useState<FilterParams>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  // Fetch properties based on current pagination, sort, and filters
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getProperties(pagination, sort, filters);
        setProperties(response.properties);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [pagination, sort, filters]);

  // Handle delete property
  const handleDeleteProperty = async (id: string) => {
    setIsDeleting(true);
    
    try {
      await deleteProperty(id);
      setProperties(prevProperties => prevProperties.filter(prop => prop.id !== id));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const response = await generateReport();
      if (response.success) {
        toast.success(response.message || "Report generated successfully");
      } else {
        toast.error(response.message || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handle sort change
  const handleSort = (field: string) => {
    setSort(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value === "" ? undefined : name === "priceMin" || name === "priceMax" ? Number(value) : value
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Check if any filter is active
    setActiveFilter(
      e.target.value !== "" || 
      Object.values(filters).some(val => val !== undefined && val !== "")
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setActiveFilter(false);
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

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
              Property Manager
            </motion.h1>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="rounded-2xl bg-villain-800 px-4 py-2 text-white hover:bg-villain-700 transition shadow-sm"
              >
                {isGeneratingReport ? (
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
                    Generating...
                  </div>
                ) : (
                  <>
                    <File className="inline-block w-4 h-4 mr-1" />
                    Download Monthly Report
                  </>
                )}
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/property/create"
                  className="btn-primary inline-flex items-center"
                >
                  <svg
                    className="mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Add Property
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* Filters */}
          <motion.div
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-villain-800 mb-4">
              Filters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search properties..."
                  className="form-input"
                  onChange={handleFilterChange}
                  value={filters.search || ""}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-input"
                  onChange={handleFilterChange}
                  value={filters.type || ""}
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  className="form-input"
                  onChange={handleFilterChange}
                  value={filters.city || ""}
                >
                  <option value="">All Cities</option>
                  {SRI_LANKA_CITIES.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    id="priceMin"
                    name="priceMin"
                    placeholder="Min"
                    className="form-input"
                    onChange={handleFilterChange}
                    value={filters.priceMin || ""}
                  />
                </div>
                
                <div>
                  <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    id="priceMax"
                    name="priceMax"
                    placeholder="Max"
                    className="form-input"
                    onChange={handleFilterChange}
                    value={filters.priceMax || ""}
                  />
                </div>
              </div>
            </div>
            
            {activeFilter && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-villain-500 hover:text-villain-600 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Properties Table */}
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {loading ? (
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
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new property or adjust your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table
                  className="w-full"
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center">
                          Type
                          {sort.field === "type" && (
                            <span className="ml-1">
                              {sort.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale/Rent
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center">
                          Price
                          {sort.field === "price" && (
                            <span className="ml-1">
                              {sort.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beds
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Baths
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <motion.tr
                        key={property.id}
                        variants={rowVariants}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-16 bg-gray-200 rounded-md overflow-hidden">
                              <img
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {property.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {property.address.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            property.forSale
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {property.forSale ? "For Sale" : "For Rent"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR',
                            maximumFractionDigits: 0
                          }).format(property.price)}
                          {property.discountPrice && (
                            <div className="text-xs text-red-500 line-through">
                              {new Intl.NumberFormat('en-LK', {
                                style: 'currency',
                                currency: 'LKR',
                                maximumFractionDigits: 0
                              }).format(property.price)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.beds ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.baths ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/property/edit/${property._id}`}
                              className="text-villain-500 hover:text-villain-600"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                ></path>
                              </svg>
                            </Link>
                            <button
                              onClick={() => setShowDeleteConfirm(property.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <svg
                                className="w-5 h-5"
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
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && properties.length > 0 && (
              <div className="px-6 py-4 bg-white flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className={`${
                      pagination.page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-villain-500 hover:bg-gray-50"
                    } px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
                  >
                    Previous
                  </button>
                  
                  <div className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === totalPages}
                    className={`${
                      pagination.page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-villain-500 hover:bg-gray-50"
                    } px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteConfirm(null)}
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
                  Are you sure you want to delete this property? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDeleteProperty(showDeleteConfirm)}
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

export default Properties;
