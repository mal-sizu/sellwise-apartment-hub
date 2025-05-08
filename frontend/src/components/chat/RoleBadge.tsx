
import React from 'react';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeColor = () => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'seller':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'agent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'support':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format the role name with proper capitalization
  const formatRoleName = (roleName: string): string => {
    return roleName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getBadgeColor()}`}>
      {formatRoleName(role)}
    </span>
  );
};

export default RoleBadge;
