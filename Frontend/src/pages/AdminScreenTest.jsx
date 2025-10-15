import React from 'react';
import { AdminLayout } from '../components';

const AdminScreenTest = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to the Fraud Detection Admin Dashboard</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Layout Test</h2>
          <p>This is a test of the new AdminLayout component. The layout includes:</p>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>• Responsive sidebar navigation</li>
            <li>• Header with search and notifications</li>
            <li>• Main content area</li>
            <li>• Mobile-friendly hamburger menu</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminScreenTest;