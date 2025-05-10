
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Home, Slack, MessageSquare } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "seller":
        return "/seller/dashboard";
      case "customer":
        return "/customer/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-villain-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </motion.div>
            <span className="text-lg font-bold text-villain-800">PropManage</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Link
                    to={getDashboardLink()}
                    className={`font-medium ${
                      location.pathname.includes("dashboard") || location.pathname.includes("admin")
                        ? "text-villain-500"
                        : "text-gray-600 hover:text-villain-500"
                    }`}
                  >
                    <Slack className="h-5 w-5 inline-block mr-1" />
                    
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Link
                    to="/chat"
                    className={`font-medium ${
                      location.pathname.startsWith("/chat")
                        ? "text-villain-500"
                        : "text-gray-600 hover:text-villain-500"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5 inline-block mr-1" />
                    
                  </Link>
                  {location.pathname.startsWith("/chat") && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
              </>
            )}
            
            <motion.div
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Link
                to="/seller/register"
                className={`font-medium ${
                  location.pathname.startsWith("/seller")
                    ? "text-villain-500"
                    : "text-gray-600 hover:text-villain-500"
                }`}
              >
                Seller Portal
              </Link>
              {location.pathname.startsWith("/seller") && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.div>
            
            {isAuthenticated && user?.role === "admin" && (
              <motion.div
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Link
                  to="/admin/dashboard"
                  className={`font-medium ${
                    location.pathname.startsWith("/admin")
                      ? "text-villain-500"
                      : "text-gray-600 hover:text-villain-500"
                  }`}
                >
                  Admin Portal
                </Link>
                {location.pathname.startsWith("/admin") && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || "Account"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-xs text-gray-400 mt-1 capitalize">Role: {user?.role}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="w-full">
                      Chat Assistant
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link to="/seller/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => logout()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4 mr-1" />
                    Log In
                  </Button>
                </Link>
                <Link to="/customer/register">
                  <Button size="sm" className="bg-villain-500 hover:bg-villain-600">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1 border-villain-500 text-villain-500 hover:bg-villain-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
