
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Slack, Users, Building, User } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <Slack className="w-5 h-5" />,
      active: currentPath === "/admin/dashboard"
    },
    {
      name: "Properties",
      path: "/admin/properties",
      icon: <Building className="w-5 h-5" />,
      active: currentPath === "/admin/properties"
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
      icon: <User className="w-5 h-5" />,
      active: currentPath === "/admin/sellers"
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <Users className="w-5 h-5" />,
      active: currentPath === "/admin/customers"
    }
  ];

  return (
    <div className="hidden md:block w-56 shrink-0">
      <div className="sticky top-24">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl relative ${
                  item.active
                    ? "text-villain-800 font-semibold"
                    : "text-gray-600 hover:text-villain-500"
                }`}
              >
                {item.active && (
                  <motion.div
                    layoutId="sidebarHighlight"
                    className="absolute inset-0 bg-villain-50 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
