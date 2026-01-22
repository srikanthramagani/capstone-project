import React, { useState, useEffect } from 'react';
import { ChartWrapper, Spinner } from '../ui';
import apiService from '../../services/api';

const TransactionTypeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const data = await apiService.getAnalyticsCharts();
      setChartData(data.transactionTypes);
      setError(null);
    } catch (err) {
      console.error('Error loading transaction type data:', err);
      setError('Failed to load chart data');
      // Fallback to mock data
      setChartData({
        labels: ['Transfers', 'Payments', 'Withdrawals', 'Deposits', 'Other'],
        normal: [8500, 6200, 3100, 4800, 920],
        fraud: [245, 180, 95, 62, 28]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Type Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Type Distribution</h3>
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
        label: 'Normal Transactions',
        data: chartData.normal || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Fraudulent Transactions',
        data: chartData.fraud || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          afterLabel: function(context) {
            const datasetIndex = context.datasetIndex;
            const dataIndex = context.dataIndex;
            const normal = data.datasets[0].data[dataIndex] || 0;
            const fraud = data.datasets[1].data[dataIndex] || 0;
            const total = normal + fraud;
            const fraudRate = total > 0 ? ((fraud / total) * 100).toFixed(2) : 0;
            return datasetIndex === 1 ? `Fraud Rate: ${fraudRate}%` : '';
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Type'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Transactions'
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <ChartWrapper
      type="bar"
      data={data}
      options={options}
      title="Transaction Type Distribution"
      height={350}
    />
  );
};

export default TransactionTypeChart;