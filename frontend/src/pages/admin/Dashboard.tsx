import AdminSidebar from '@/components/ui/admin/AdminSidebar'
import Navbar from '@/components/ui/common/Navbar'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Lock, User, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

function Dashboard() {
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // In a real app, this would call an API to change the password
    console.log('Password change requested', { currentPassword, newPassword });
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Show success message
    toast({
      title: "Success",
      description: "Your password has been updated successfully",
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to update the profile
    console.log('Profile update requested', { name, email, phone });
    
    // Show success message
    toast({
      title: "Success",
      description: "Your profile has been updated successfully",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    console.log('Account deletion requested');
    setIsDeleteDialogOpen(false);
    
    // Show success message
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted",
      variant: "destructive",
    });
  };

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
                <div className="grid gap-8">
                    <div className="bg-white rounded-2xl shadow-soft p-6">
                        <div className="flex items-center mb-6">
                            <Lock className="h-5 w-5 text-villain-500 mr-2" />
                            <h2 className="text-xl font-semibold">Change Password</h2>
                        </div>
                        
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <Input 
                                    id="currentPassword"
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <Input 
                                    id="newPassword"
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <Input 
                                    id="confirmPassword"
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                )}
                            </div>
                            
                            <Button type="submit" className="bg-villain-500 hover:bg-villain-600">
                                Update Password
                            </Button>
                        </form>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-soft p-6">
                        <div className="flex items-center mb-6">
                            <User className="h-5 w-5 text-villain-500 mr-2" />
                            <h2 className="text-xl font-semibold">Profile Information</h2>
                        </div>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <Input 
                                    id="name"
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <Input 
                                    id="email"
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <Input 
                                    id="phone"
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            
                            <Button type="submit" className="bg-villain-500 hover:bg-villain-600">
                                Update Profile
                            </Button>
                        </form>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-soft p-6">
                        <div className="flex items-center mb-6">
                            <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                            <h2 className="text-xl font-semibold">Delete Account</h2>
                        </div>
                        
                        <p className="text-gray-500 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                </DialogHeader>
                                <p className="text-gray-500">
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </p>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDeleteAccount}>
                                        Yes, delete my account
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  )
}

export default Dashboard