import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import AdminSidebar from "@/components/ui/admin/AdminSidebar";
import { Customer } from "@/types";
import { getCustomers, getCustomerById } from "@/services/customerService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await getCustomers({ page: 1, limit: 20 });
        setCustomers(response.data);
        console.log("Customers loaded:", response.data);
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleViewCustomer = async (id: string) => {
    try {
      const customer = await getCustomerById(id);
      if (customer) {
        setViewingCustomer(customer);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const filteredCustomers = customers?.filter(customer => 
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 flex">
        <AdminSidebar />
        
        <motion.div
          className="flex-1 ml-0 md:ml-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-villain-800">Customers</h1>
              <p className="text-gray-500">View and manage customers</p>
            </div>
            <div className="w-full md:w-auto flex">
              <div className="relative flex-1 md:w-64">
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-villain-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      {/* <th className="px-6 py-3 text-gray-500 font-medium">ID</th> */}
                      <th className="px-6 py-3 text-gray-500 font-medium">Name</th>
                      <th className="px-6 py-3 text-gray-500 font-medium">Email</th>
                      <th className="px-6 py-3 text-gray-500 font-medium">Phone</th>
                      <th className="px-6 py-3 text-gray-500 font-medium">Registration Date</th>
                      <th className="px-6 py-3 text-gray-500 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No customers found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          {/* <td className="px-6 py-4 text-gray-600">{customer._id}</td> */}
                          <td className="px-6 py-4 font-medium">
                            {customer.firstName} {customer.lastName}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                          <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(customer.registrationDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewCustomer(customer._id)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

          {viewingCustomer && (
            <Dialog
              open={!!viewingCustomer}
              onOpenChange={() => setViewingCustomer(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Personal Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">First Name</label>
                        <div className="mt-1">{viewingCustomer.firstName}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Last Name</label>
                        <div className="mt-1">{viewingCustomer.lastName}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Email</label>
                        <div className="mt-1">{viewingCustomer.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Phone</label>
                        <div className="mt-1">{viewingCustomer.phone}</div>
                      </div>
                    </div>
                  </div>
              
                  <div>
                    <h3 className="font-medium">Account Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">Customer ID</label>
                        <div className="mt-1">{viewingCustomer._id}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Registration Date</label>
                        <div className="mt-1">
                          {new Date(viewingCustomer.registrationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}    </div>
  );};

export default Customers;
