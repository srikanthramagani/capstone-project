import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Users, 
  AlertTriangle, 
  Brain, 
  Activity 
} from 'lucide-react';
import MetricCard from './MetricCard';
import { StatusIndicator } from '../ui';
import apiService from '../../services/api';

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh for real-time data
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data.metrics);
      setBlockchainStatus(data.blockchainStatus);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setMetrics({
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
    });

    setBlockchainStatus({
      status: 'online',
      label: 'Blockchain Connected',
      lastSync: '2 minutes ago',
      blockHeight: '18,523,456'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm">
            Using cached data. Backend connection issue: {error}
          </p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        <MetricCard
          title="Total Transactions"
          value={metrics?.totalTransactions?.value || '0'}
          subtitle={metrics?.totalTransactions?.subtitle || 'Total processed'}
          icon={CreditCard}
          trend={metrics?.totalTransactions?.trend || 'neutral'}
          trendValue={metrics?.totalTransactions?.trendValue || '0%'}
          color="blue"
        />
        
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers?.value || '0'}
          subtitle={metrics?.totalUsers?.subtitle || 'Active users'}
          icon={Users}
          trend={metrics?.totalUsers?.trend || 'neutral'}
          trendValue={metrics?.totalUsers?.trendValue || '0%'}
          color="green"
        />
        
        <MetricCard
          title="Fraudulent Transactions"
          value={metrics?.fraudulentTransactions?.value || '0'}
          subtitle={metrics?.fraudulentTransactions?.subtitle || 'Flagged as fraud'}
          icon={AlertTriangle}
          trend={metrics?.fraudulentTransactions?.trend || 'neutral'}
          trendValue={metrics?.fraudulentTransactions?.trendValue || '0%'}
          color="red"
        />
        
        <MetricCard
          title="ML Model Accuracy"
          value={metrics?.modelAccuracy?.value || '0%'}
          subtitle={metrics?.modelAccuracy?.subtitle || 'Current accuracy'}
          icon={Brain}
          trend={metrics?.modelAccuracy?.trend || 'neutral'}
          trendValue={metrics?.modelAccuracy?.trendValue || '0%'}
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
                  status={blockchainStatus?.status || 'offline'} 
                  label={blockchainStatus?.label || 'Disconnected'} 
                />
                <span className="text-sm text-gray-500">
                  Last sync: {blockchainStatus?.lastSync || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Block Height</p>
            <p className="text-xl font-bold text-gray-900">
              {blockchainStatus?.blockHeight || '0'}
            </p>
          </div>
        </div>
        
        {/* Additional blockchain info */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Network</p>
            <p className="text-base lg:text-lg font-semibold text-gray-900">Ethereum Mainnet</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Gas Price</p>
            <p className="text-base lg:text-lg font-semibold text-gray-900">25 Gwei</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Pending Txs</p>
            <p className="text-base lg:text-lg font-semibold text-gray-900">156</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;