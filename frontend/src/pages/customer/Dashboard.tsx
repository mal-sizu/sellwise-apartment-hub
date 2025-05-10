import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { Property, Customer } from "@/types";
import { getProperties } from "@/services/propertyService";
import { Link, useNavigate } from "react-router-dom";
import { 
  getCurrentCustomer, 
  updateCustomer,
  deleteCustomer 
} from "@/services/customerService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';
import { updatePassword } from "@/services/authService";

const Dashboard = () => {
  const { user, logout  } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerProfile, setCustomerProfile] = useState<Customer | null>(null);
  
  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    interests: [] as string[]
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load properties
        const response = await getProperties({ page: 1, limit: 10 });
        if (Array.isArray(response)) {
          setProperties(response);
        } else if (response && response.properties) {
          setProperties(response.properties);
        } else {
          console.error("Unexpected API response format:", response);
          setProperties([]);
        }
        
        // Load customer profile
        if (user && user._id) {
          const customerData = await getCurrentCustomer(user._id);
          setCustomerProfile(customerData);
          
          // Initialize profile form with customer data
          setProfileForm({
            firstName: customerData.firstName || "",
            lastName: customerData.lastName || "",
            email: customerData.email || "",
            phone: customerData.phone || "",
            address: customerData.address || "",
            interests: customerData.interests || []
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      } 
    };

    loadData();
  }, [user]);

  const handleEditProfile = async () => {
    if (!user || !user._id) return;
    
    try {
      setFormSubmitting(true);
      const updatedCustomer = await updateCustomer(user._id, profileForm);
      setCustomerProfile(updatedCustomer);
      setEditProfileOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!user || !user._id) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormSubmitting(true);
      await updatePassword(
        user._id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setChangePasswordOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to change password", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };  
  const handleDeleteAccount = async () => {
    if (!user || !user._id) return;
    
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormSubmitting(true);
      await deleteCustomer(user._id);
      toast({
        title: "Success",
        description: "Account deleted successfully",
        variant: "default"
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };  

  const interestOptions = [
    "Residential",
    "Industrial", 
    "Commercial"
  ];
  
  const handleInterestChange = (interest: string) => {
    setProfileForm(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      
      return { ...prev, interests };
    });
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
              <h1 className="text-2xl font-bold text-villain-800">Customer Dashboard</h1>
              <p className="text-gray-500">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setChangePasswordOpen(true)}
              >
                Change Password
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteAccountOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-villain-500"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <Link 
                    key={property.id} 
                    to={`/property/${property.id}`}
                    className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition duration-200"
                  >
                    <div className="relative pb-[65%] bg-gray-100">
                      <img
                        src={property.images?.[0] || "/placeholder.svg"}
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
                        {property.address?.city}, {property.address?.street}
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
            ) : (
              <p className="text-gray-500">No properties available at the moment.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-semibold mb-4">Your Saved Properties</h2>
            <p className="text-gray-500">You haven't saved any properties yet.</p>
          </div>
        </motion.div>
      </main>
      
      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileForm.firstName} 
                  onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileForm.lastName} 
                  onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileForm.email} 
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={profileForm.phone} 
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={profileForm.address} 
                onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`interest-${interest}`} 
                      checked={profileForm.interests.includes(interest)}
                      onCheckedChange={() => handleInterestChange(interest)}
                    />
                    <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={passwordForm.currentPassword} 
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={passwordForm.newPassword} 
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={passwordForm.confirmPassword} 
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 mb-4">
              This action cannot be undone. Please type "DELETE" to confirm.
            </p>
            <Input 
              value={deleteConfirmation} 
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;