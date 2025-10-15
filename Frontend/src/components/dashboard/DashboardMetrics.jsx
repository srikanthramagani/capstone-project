import React from 'react';
import { 
  CreditCard, 
  Users, 
  AlertTriangle, 
  Brain, 
  Activity 
} from 'lucide-react';
import MetricCard from './MetricCard';
import { StatusIndicator } from '../ui';

const DashboardMetrics = () => {
  // Mock data - in real app, this would come from API
  const metrics = {
    totalTransactions: {
      value: '24,567',
      subtitle: 'Total processed',
      trend: 'up',
      trendValue: '+12.5%'
    },
    totalUsers: {
      value: '1,234',
      subtitle: 'Active users',
      trend: 'up',
      trendValue: '+8.2%'
    },
    fraudulentTransactions: {
      value: '89',
      subtitle: 'Flagged as fraud',
      trend: 'down',
      trendValue: '-2.1%'
    },
    modelAccuracy: {
      value: '94.7%',
      subtitle: 'Current accuracy',
      trend: 'up',
      trendValue: '+0.3%'
    }
  };

  const blockchainStatus = {
    status: 'online',
    label: 'Blockchain Connected',
    lastSync: '2 minutes ago',
    blockHeight: '18,523,456'
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions.value}
          subtitle={metrics.totalTransactions.subtitle}
          icon={CreditCard}
          trend={metrics.totalTransactions.trend}
          trendValue={metrics.totalTransactions.trendValue}
          color="blue"
        />
        
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers.value}
          subtitle={metrics.totalUsers.subtitle}
          icon={Users}
          trend={metrics.totalUsers.trend}
          trendValue={metrics.totalUsers.trendValue}
          color="green"
        />
        
        <MetricCard
          title="Fraudulent Transactions"
          value={metrics.fraudulentTransactions.value}
          subtitle={metrics.fraudulentTransactions.subtitle}
          icon={AlertTriangle}
          trend={metrics.fraudulentTransactions.trend}
          trendValue={metrics.fraudulentTransactions.trendValue}
          color="red"
        />
        
        <MetricCard
          title="ML Model Accuracy"
          value={metrics.modelAccuracy.value}
          subtitle={metrics.modelAccuracy.subtitle}
          icon={Brain}
          trend={metrics.modelAccuracy.trend}
          trendValue={metrics.modelAccuracy.trendValue}
          color="purple"
        />
      </div>

      {/* Blockchain Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100 text-gray-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Real-time Blockchain Status
              </h3>
              <div className="mt-1 flex items-center space-x-4">
                <StatusIndicator 
                  status={blockchainStatus.status} 
                  label={blockchainStatus.label} 
                />
                <span className="text-sm text-gray-500">
                  Last sync: {blockchainStatus.lastSync}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Block Height</p>
            <p className="text-xl font-bold text-gray-900">
              {blockchainStatus.blockHeight}
            </p>
          </div>
        </div>
        
        {/* Additional blockchain info */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Network</p>
            <p className="text-lg font-semibold text-gray-900">Ethereum Mainnet</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Gas Price</p>
            <p className="text-lg font-semibold text-gray-900">25 Gwei</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Pending Txs</p>
            <p className="text-lg font-semibold text-gray-900">156</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;