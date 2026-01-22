import React, { useState, useEffect } from 'react';
import { ChartWrapper, Spinner } from '../ui';
import apiService from '../../services/api';

const FraudVsNormalChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const data = await apiService.getAnalyticsCharts();
      setChartData(data.fraudVsNormal);
      setError(null);
    } catch (err) {
      console.error('Error loading fraud vs normal chart data:', err);
      setError('Failed to load chart data');
      // Fallback to mock data
      setChartData({
        labels: ['Legitimate Transactions', 'Fraudulent Transactions'],
        data: [23456, 789]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraudulent vs Normal Transactions</h3>
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraudulent vs Normal Transactions</h3>
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
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <ChartWrapper
      type="doughnut"
      data={data}
      options={options}
      title="Fraudulent vs Normal Transactions"
      height={300}
    />
  );
};

export default FraudVsNormalChart;