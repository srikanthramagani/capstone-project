import React from 'react';
import { AdminLayout } from '../components';
import FraudVsNormalChart from '../components/analytics/FraudVsNormalChart';
import FraudTrendChart from '../components/analytics/FraudTrendChart';
import TransactionTypeChart from '../components/analytics/TransactionTypeChart';
import FlaggedTransactionsTable from '../components/analytics/FlaggedTransactionsTable';
import MLModelControls from '../components/analytics/MLModelControls';

const FraudAnalytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Fraud Detection Insights</h1>
          <p className="mt-2 text-gray-600">
            Advanced analytics and machine learning insights for fraud detection
          </p>
        </div>

        {/* ML Model Controls */}
        <MLModelControls />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Fraud vs Normal - Takes 1 column */}
          <div>
            <FraudVsNormalChart />
          </div>

          {/* Fraud Trend - Takes 2 columns on xl screens, full width on smaller */}
          <div className="xl:col-span-2">
            <FraudTrendChart />
          </div>
        </div>

        {/* Transaction Type Chart - Full width */}
        <div>
          <TransactionTypeChart />
        </div>

        {/* Flagged Transactions Table */}
        <div>
          <FlaggedTransactionsTable />
        </div>

        {/* Additional Analytics Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.2%</div>
              <div className="text-sm text-gray-600">Detection Accuracy</div>
              <div className="text-xs text-green-600 mt-1">↗ +0.8% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">127ms</div>
              <div className="text-sm text-gray-600">Avg Detection Time</div>
              <div className="text-xs text-green-600 mt-1">↗ 15ms faster</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$2.3M</div>
              <div className="text-sm text-gray-600">Fraud Prevented</div>
              <div className="text-xs text-green-600 mt-1">↗ +12% vs last month</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FraudAnalytics;