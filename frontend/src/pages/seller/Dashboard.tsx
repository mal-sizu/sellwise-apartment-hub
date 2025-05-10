import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { getSellerProperties, deleteProperty } from "@/services/propertyService";
import { Edit, Trash2, Plus, User, Key, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/services/authService";
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, logout, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProperties = async () => {
      try {
        if (!user?._id) {
          setProperties([]);
          return;
        }

        const response = await getSellerProperties(user._id);
        
        if (response && Array.isArray(response)) {
          setProperties(response);
        } else {
          console.error("Invalid response format:", response);
          setProperties([]);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [user?._id]);

  const handleDeleteClick = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      try {
        await deleteProperty(propertyToDelete);
        setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete));
      } catch (error) {
        console.error("Failed to delete property", error);
      }
    }
    setIsDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(profileData);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      // Implement password update logic here
      setIsPasswordOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await updatePassword(
        user._id,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
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
            <div className="flex gap-4">
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" /> Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full">Update Password</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                  </DialogHeader>
                  <p className="text-gray-500">Are you sure you want to delete your account? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsDeleteAccountOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Link to="/property/create">
                <Button className="bg-villain-500 hover:bg-villain-600">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-villain-500"></div>
              </div>
            ) : properties?.length === 0 ? (
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
                    {properties?.map((property) => (
                      <tr key={property._id} className="hover:bg-gray-50">
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
                                to={`/property/${property._id}`}
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
                            <Link to={`/property/edit/${property._id}`}>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteClick(property._id)}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your property listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;