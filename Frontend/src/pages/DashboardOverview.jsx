import React from 'react';
import { AdminLayout } from '../components';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickStats from '../components/dashboard/QuickStats';

const DashboardOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-gray-600">
            Monitor fraud detection system performance and recent activity
          </p>
        </div>

        {/* Main Metrics */}
        <DashboardMetrics />

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <QuickStats />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <p className="text-gray-600 mt-1">
                Common administrative tasks
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-50 transition-colors">
                Run Model Training
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardOverview;