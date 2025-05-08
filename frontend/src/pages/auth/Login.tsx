
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white rounded-2xl shadow-soft"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-villain-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-villain-500 hover:bg-villain-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/seller/register" className="text-villain-500 hover:underline">
                Register as Seller
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Accounts:</h3>
            <div className="grid grid-cols-1 gap-3 text-xs">
              <button
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("password");
                }}
                className="text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="font-semibold">Admin</div>
                <div className="text-gray-500">admin@example.com / any password</div>
              </button>
              <button
                onClick={() => {
                  setEmail("john.doe@example.com");
                  setPassword("password");
                }}
                className="text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="font-semibold">Seller</div>
                <div className="text-gray-500">john.doe@example.com / any password</div>
              </button>
              <button
                onClick={() => {
                  setEmail("jane.smith@example.com");
                  setPassword("password");
                }}
                className="text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="font-semibold">Customer</div>
                <div className="text-gray-500">jane.smith@example.com / any password</div>
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
