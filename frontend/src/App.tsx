
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/seller/Register";
import CustomerRegister from "./pages/customer/Register";
import Profile from "./pages/seller/Profile";
import SellerDashboard from "./pages/seller/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";
import Create from "./pages/property/Create";
import PropertyDetails from "./pages/property/Details";
import Properties from "./pages/admin/Properties";
import Sellers from "./pages/admin/Sellers";
import Customers from "./pages/admin/Customers";
import Chat from "./pages/chat/Chat";
import NotFound from "./pages/NotFound";
import { default as AdminDashboard } from "./pages/admin/Dashboard";
import EditProperty from "./pages/admin/EditProperty";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ element, requiredRole, redirectPath = "/login" }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to role-specific dashboard
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'seller') return <Navigate to="/seller/dashboard" replace />;
    if (user?.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Customer Routes */}
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route 
                path="/customer/dashboard" 
                element={
                  <ProtectedRoute 
                    element={<CustomerDashboard />} 
                    requiredRole="customer" 
                  />
                } 
              />
              
              {/* Seller Routes */}
              <Route path="/seller/register" element={<Register />} />
              <Route 
                path="/seller/dashboard" 
                element={
                  <ProtectedRoute 
                    element={<SellerDashboard />} 
                    requiredRole="seller" 
                  />
                } 
              />
              <Route 
                path="/seller/profile" 
                element={
                  <ProtectedRoute 
                    element={<Profile />} 
                    requiredRole="seller" 
                  />
                } 
              />
              
              {/* Property Routes */}
              <Route 
                path="/property/create" 
                element={
                  <ProtectedRoute 
                    element={<Create />} 
                    requiredRole="seller" 
                  />
                } 
              />
              <Route 
                path="/property/edit/:id" 
                element={
                  <ProtectedRoute 
                    element={<Create />} 
                    requiredRole="seller" 
                  />
                } 
              />
              <Route path="/property/:id" element={<PropertyDetails />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute 
                    element={<AdminDashboard />} 
                    requiredRole="admin" 
                  />
                } 
              />
              <Route 
                path="/admin/properties" 
                element={
                  <ProtectedRoute 
                    element={<Properties />} 
                    requiredRole="admin" 
                  />
                } 
              />
              <Route 
                path="/admin/sellers" 
                element={
                  <ProtectedRoute 
                    element={<Sellers />} 
                    requiredRole="admin" 
                  />
                } 
              />
              <Route 
                path="/admin/customers" 
                element={
                  <ProtectedRoute 
                    element={<Customers />} 
                    requiredRole="admin" 
                  />
                } 
              />
              <Route 
                path="/admin/property/edit/:id"
                element={
                  <ProtectedRoute 
                    element={<EditProperty />} 
                    requiredRole="admin" 
                  />
                } 
              />
              
              {/* Chat Route - Available to all authenticated users */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute 
                    element={<Chat />} 
                    requiredRole={null} 
                  />
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
