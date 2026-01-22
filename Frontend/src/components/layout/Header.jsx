import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button, StatusIndicator } from '../ui';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              Fraud Detection Dashboard
            </h1>
          </div>
        </div>

        

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="hidden sm:flex items-center space-x-2">
            <StatusIndicator status="online" label="System Online" />
          </div>


          {/* User avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;