import React, { useState, useEffect } from 'react';
import { ChartWrapper, Spinner } from '../ui';
import apiService from '../../services/api';

const FraudTrendChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const data = await apiService.getAnalyticsCharts();
      setChartData(data.fraudTrend);
      setError(null);
    } catch (err) {
      console.error('Error loading fraud trend data:', err);
      setError('Failed to load chart data');
      // Fallback to mock data
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        fraudRate: [3.2, 2.8, 4.1, 3.7, 2.9, 3.5],
        totalTransactions: [12500, 13200, 11800, 14100, 13700, 12900]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Trend Over Time</h3>
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Trend Over Time</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={loadChartData}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = {
    labels: chartData.labels || [],
    datasets: [
      {
        label: 'Fraud Detection Rate (%)',
        data: chartData.fraudRate || [],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Transactions',
        data: chartData.totalTransactions || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Period'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Fraud Rate (%)'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Total Transactions'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fraud Trend Over Time</h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5 animate-pulse"></span>
          Live Analysis
        </span>
      </div>
      <ChartWrapper
        type="line"
        data={data}
        options={options}
        height={350}
      />
    </div>
  );
};

export default FraudTrendChart;