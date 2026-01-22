import React, { useState, useEffect } from 'react';
import { ChartWrapper } from '../ui';
import axios from 'axios';

const QuickStats = () => {
  const [fraudTrendData, setFraudTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics/charts');
        if (response.data) {
          const fraudTrend = response.data.fraudTrend || {};
          const labels = fraudTrend.labels || [];
          const totalTransactions = fraudTrend.totalTransactions || [];
          const fraudRates = fraudTrend.fraudRate || [];
          
          // Calculate legitimate transactions (total - fraud)
          const legitimateData = totalTransactions.map((total, index) => {
            const fraudRate = fraudRates[index] || 0;
            const fraudCount = Math.round((total * fraudRate) / 100);
            return total - fraudCount;
          });
          
          const fraudData = totalTransactions.map((total, index) => {
            const fraudRate = fraudRates[index] || 0;
            return Math.round((total * fraudRate) / 100);
          });
          
          setFraudTrendData({
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [
              {
                label: 'Legitimate Transactions',
                data: legitimateData.length > 0 ? legitimateData : [0],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Fraudulent Transactions',
                data: fraudData.length > 0 ? fraudData : [0],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
              }
            ],
          });
        }
      } catch (error) {
        console.error('Error loading fraud trend:', error);
        // Set fallback data
        setFraudTrendData({
          labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'],
          datasets: [
            {
              label: 'Legitimate Transactions',
              data: [0, 0, 0, 0, 0],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
            },
            {
              label: 'Fraudulent Transactions',
              data: [0, 0, 0, 0, 0],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
            }
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
    const interval = setInterval(fetchTrendData, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Batch / Time Period'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Transactions'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading || !fraudTrendData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Trends</h3>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <ChartWrapper
      type="line"
      data={fraudTrendData}
      options={chartOptions}
      title="Transaction Trends (Real Data)"
      height={300}
    />
  );
};

export default QuickStats;