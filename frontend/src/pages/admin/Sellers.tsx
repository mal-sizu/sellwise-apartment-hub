import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/ui/common/Navbar";
import AdminSidebar from "../../components/ui/admin/AdminSidebar";
import { getSellers, getSellerById, updateSellerStatus, deleteSeller } from "../../services/sellerService";
import { Seller, PaginationParams } from "../../types";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';

const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10 
  });
  const [totalPages, setTotalPages] = useState(1);
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for filtered sellers
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [viewingSeller, setViewingSeller] = useState<Seller | null>(null);
  const [updatingSellerId, setUpdatingSellerId] = useState<string | null>(null);
  const [deletingSellerId, setDeletingSellerId] = useState<string | null>(null);

  // Fetch sellers without search parameter
useEffect(() => {
  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await getSellers({
        ...pagination
        // Remove the search parameter from API call
      });
      setSellers(response.sellers);
      setTotalPages(response.totalPages);
      
      // If there's an active search, apply it to the new data
      if (searchTerm.trim()) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = response.sellers.filter(seller => 
          seller.firstName.toLowerCase().includes(lowerCaseSearch) ||
          seller.lastName.toLowerCase().includes(lowerCaseSearch) ||
          seller.email.toLowerCase().includes(lowerCaseSearch) ||
          seller.business?.name?.toLowerCase().includes(lowerCaseSearch) ||
          `${seller.firstName} ${seller.lastName}`.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredSellers(filtered);
      } else {
        setFilteredSellers(response.sellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };
  
  fetchSellers();
}, [pagination]); // Remove searchTerm from dependencies


  // Fetch sellers with debounce
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const response = await getSellers({
          ...pagination,
          search: searchTerm.trim() // Pass search term directly in pagination params
        });
        setSellers(response.sellers);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        toast.error("Failed to load sellers");
      } finally {
        setLoading(false);
      }
    };
    
    // Add a debounce to prevent too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchSellers();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [pagination, searchTerm]);

  // Open seller details modal
  const handleViewSeller = async (id: string) => {
    try {
      const seller = await getSellerById(id);
      if (seller) {
        setViewingSeller(seller);
      }
    } catch (error) {
      console.error("Error fetching seller details:", error);
      toast.error("Failed to load seller details");
    }
  };

  // Update seller status
  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    setUpdatingSellerId(id);
    
    try {
      const updatedSeller = await updateSellerStatus(id, status);
      
      // Update seller in the list
      // The API returns { _id, status } so we need to update only the status
      setSellers(prevSellers =>
        prevSellers.map(seller =>
          seller._id === updatedSeller._id ? { ...seller, status: updatedSeller.status } : seller
        )
      );
      
      toast.success(`Seller status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating seller status:`, error);
      toast.error("Failed to update seller status");
    } finally {
      setUpdatingSellerId(null);
    }
  };

  // Handle search with simple array filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    // If search is empty, reset to show all sellers
    if (!searchValue.trim()) {
      setFilteredSellers(sellers);
      return;
    }
    
    // Filter the sellers array locally
    const lowerCaseSearch = searchValue.toLowerCase();
    const filtered = sellers.filter(seller => 
      seller.firstName.toLowerCase().includes(lowerCaseSearch) ||
      seller.lastName.toLowerCase().includes(lowerCaseSearch) ||
      seller.email.toLowerCase().includes(lowerCaseSearch) ||
      seller.business?.name?.toLowerCase().includes(lowerCaseSearch) ||
      `${seller.firstName} ${seller.lastName}`.toLowerCase().includes(lowerCaseSearch)
    );
    
    setFilteredSellers(filtered);
  };

  // Generate PDF report
  const generatePDF = async () => {
    try {
      // Create report content
      const reportContent = document.createElement('div');
      reportContent.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #2c3e50; text-align: center;">Sellers Report</h1>
          <p style="text-align: center; color: #7f8c8d;">Generated on ${new Date().toLocaleDateString()}</p>
          
          ${sellers.map(seller => `
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #34495e; margin-bottom: 10px;">${seller.firstName} ${seller.lastName}</h2>
              
              <div style="margin: 10px 0;">
                <strong>Business Information:</strong>
                <ul style="list-style: none; padding-left: 20px;">
                  <li>Name: ${seller.business.name}</li>
                  <li>Registration: ${seller.business.registrationNumber}</li>
                  <li>Designation: ${seller.business.designation}</li>
                </ul>
              </div>
              
              <div style="margin: 10px 0;">
                <strong>Contact Information:</strong>
                <ul style="list-style: none; padding-left: 20px;">
                  <li>Email: ${seller.email}</li>
                  <li>Phone: ${seller.phone}</li>
                  <li>Username: ${seller.username}</li>
                </ul>
              </div>
              
              <div style="margin: 10px 0;">
                <strong>Additional Details:</strong>
                <ul style="list-style: none; padding-left: 20px;">
                  <li>Status: ${seller.status}</li>
                  <li>Registration Date: ${new Date(seller.registrationDate).toLocaleDateString()}</li>
                  <li>Preferred Languages: ${seller.preferredLanguages.join(', ')}</li>
                </ul>
              </div>
              
              <div style="margin: 10px 0;">
                <strong>Social Links:</strong>
                <ul style="list-style: none; padding-left: 20px;">
                  <li>Facebook: ${seller.socialLinks.facebook}</li>
                  <li>LinkedIn: ${seller.socialLinks.linkedin}</li>
                  <li>Instagram: ${seller.socialLinks.instagram}</li>
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Configure PDF options
      const opt = {
        margin: 1,
        filename: `sellers-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      await html2pdf().set(opt).from(reportContent).save();
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
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

  // Add this state for the confirmation modal
  const [confirmDelete, setConfirmDelete] = useState<{show: boolean; sellerId: string | null}>({
    show: false,
    sellerId: null
  });

  // Update the handleDeleteSeller function to use the modal instead of window.confirm
  const handleDeleteSeller = (id: string) => {
    setConfirmDelete({
      show: true,
      sellerId: id
    });
  };

  // Add this function to handle the actual deletion after confirmation
  const confirmDeleteSeller = async () => {
    if (!confirmDelete.sellerId) return;
    
    setDeletingSellerId(confirmDelete.sellerId);
    
    try {
      await deleteSeller(confirmDelete.sellerId);
      
      // Remove the seller from the list
      setSellers(prevSellers => 
        prevSellers.filter(seller => seller._id !== confirmDelete.sellerId)
      );
      
      // If we're viewing the seller that was deleted, close the modal
      if (viewingSeller && viewingSeller._id === confirmDelete.sellerId) {
        setViewingSeller(null);
      }
      
      toast.success("Seller deleted successfully");
    } catch (error) {
      console.error("Error deleting seller:", error);
      toast.error("Failed to delete seller");
    } finally {
      setDeletingSellerId(null);
      setConfirmDelete({ show: false, sellerId: null });
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
              Seller Management
            </motion.h1>
            
            <motion.button
              className="px-4 py-2 bg-villain-500 text-white rounded-md hover:bg-villain-600 transition-colors flex items-center gap-2"
              onClick={generatePDF}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Generate Report
            </motion.button>
          </div>
          
          {/* Search with clear button */}
          <motion.div
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="relative flex-1 form-input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by seller name..."
                  className="w-full pl-10 pr-10 py-2 border-none outline-none focus:border-none focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Sellers Table */}
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
            ) : sellers.length === 0 ? (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sellers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No sellers match your search criteria.
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
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSellers.map((seller) => (
                      <motion.tr
                        key={seller._id}
                        variants={rowVariants}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                              <img
                                src={seller.profilePicture || "/placeholder.svg"}
                                alt={`${seller.firstName} ${seller.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {seller.firstName} {seller.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {seller._id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {seller.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : seller.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {seller.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(seller.registrationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {seller.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(seller._id, "Approved")}
                                  disabled={updatingSellerId === seller._id}
                                  className="text-green-500 hover:text-green-600 transition"
                                >
                                  {updatingSellerId === seller._id ? (
                                    <svg
                                      className="animate-spin h-5 w-5"
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
                                  ) : (
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
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </button>
                                
                                <button
                                  onClick={() => handleUpdateStatus(seller._id, "Rejected")}
                                  disabled={updatingSellerId === seller._id}
                                  className="text-red-500 hover:text-red-600 transition"
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
                                      d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => handleViewSeller(seller._id)}
                              className="text-villain-500 hover:text-villain-600 transition"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                ></path>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteSeller(seller._id)}
                              className="text-red-500 hover:text-red-600 transition ml-2"
                              title="Delete seller"
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
            {!loading && sellers.length > 0 && (
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
      
      {/* Seller Details Modal */}
      <AnimatePresence>
        {viewingSeller && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingSeller(null)}
            />
            
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full pointer-events-auto max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-villain-800">
                      Seller Details
                    </h3>
                    
                    <button
                      onClick={() => setViewingSeller(null)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="h-24 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <img
                        src={viewingSeller.profilePicture || "/placeholder.svg"}
                        alt={`${viewingSeller.firstName} ${viewingSeller.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-gray-900">
                        {viewingSeller.firstName} {viewingSeller.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ID: {viewingSeller._id}
                      </p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          viewingSeller.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : viewingSeller.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {viewingSeller.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Contact Information
                      </h5>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">Email:</span>
                          <span className="text-gray-900">{viewingSeller.email}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">Phone:</span>
                          <span className="text-gray-900">{viewingSeller.phone}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">NIC/Passport:</span>
                          <span className="text-gray-900">{viewingSeller.identification}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Account Details
                      </h5>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">Username:</span>
                          <span className="text-gray-900">{viewingSeller.username}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">Registered:</span>
                          <span className="text-gray-900">{viewingSeller.registrationDate}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {viewingSeller.bio && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Bio
                      </h5>
                      <p className="text-gray-900">
                        {viewingSeller.bio}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                      Preferred Languages
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {viewingSeller.preferredLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-villain-50 text-villain-700 rounded-full text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {viewingSeller.socialLinks && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Social Links
                      </h5>
                      <ul className="space-y-2">
                        {viewingSeller.socialLinks.facebook && (
                          <li>
                            <a
                              href={viewingSeller.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-villain-500 hover:text-villain-600 transition flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                              Facebook
                            </a>
                          </li>
                        )}
                        
                        {viewingSeller.socialLinks.linkedin && (
                          <li>
                            <a
                              href={viewingSeller.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-villain-500 hover:text-villain-600 transition flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                              LinkedIn
                            </a>
                          </li>
                        )}
                        
                        {viewingSeller.socialLinks.instagram && (
                          <li>
                            <a
                              href={viewingSeller.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-villain-500 hover:text-villain-600 transition flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >

                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.36 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439.793-.001 1.44.645 1.44 1.439z" />
                              </svg>
                              Instagram
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {viewingSeller.business && viewingSeller.business.name && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Business Information
                      </h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium w-24">Name:</span>
                          <span className="text-gray-900">{viewingSeller.business.name}</span>
                        </li>
                        
                        {viewingSeller.business.registrationNumber && (
                          <li className="flex items-start">
                            <span className="text-gray-600 font-medium w-24">Reg Number:</span>
                            <span className="text-gray-900">{viewingSeller.business.registrationNumber}</span>
                          </li>
                        )}
                        
                        {viewingSeller.business.designation && (
                          <li className="flex items-start">
                            <span className="text-gray-600 font-medium w-24">Designation:</span>
                            <span className="text-gray-900">{viewingSeller.business.designation}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {viewingSeller.status === "Pending" && (
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          handleUpdateStatus(viewingSeller._id, "Rejected");
                          setViewingSeller(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(viewingSeller._id, "Approved");
                          setViewingSeller(null);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      {viewingSeller && (
                        <button
                          onClick={() => {
                            handleDeleteSeller(viewingSeller._id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Delete Seller
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete.show && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete({ show: false, sellerId: null })}
            />
            
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full pointer-events-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-red-600">
                      Confirm Deletion
                    </h3>
                    
                    <button
                      onClick={() => setConfirmDelete({ show: false, sellerId: null })}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700">
                      Are you sure you want to delete this seller? This action cannot be undone and will remove all associated data.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setConfirmDelete({ show: false, sellerId: null })}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteSeller}
                      disabled={deletingSellerId === confirmDelete.sellerId}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
                    >
                      {deletingSellerId === confirmDelete.sellerId ? (
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
                          Deleting...
                        </>
                      ) : (
                        "Delete Seller"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sellers;
