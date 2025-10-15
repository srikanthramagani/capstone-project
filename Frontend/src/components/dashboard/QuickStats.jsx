import React from 'react';
import { ChartWrapper } from '../ui';

const QuickStats = () => {
  // Mock data for fraud detection over time
  const fraudTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Legitimate Transactions',
        data: [1200, 1350, 1100, 1400, 1300, 900, 800],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Fraudulent Transactions',
        data: [23, 45, 18, 32, 28, 15, 12],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ],
  };

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
          text: 'Day of Week'
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

  return (
    <ChartWrapper
      type="line"
      data={fraudTrendData}
      options={chartOptions}
      title="Transaction Trends (Last 7 Days)"
      height={300}
    />
  );
};

export default QuickStats;