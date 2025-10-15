import React from 'react';
import { ChartWrapper } from '../ui';

const FraudTrendChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Fraud Detection Rate (%)',
        data: [3.2, 2.8, 4.1, 3.7, 2.9, 3.5, 4.2, 3.8, 3.1, 2.7, 3.4, 3.0],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Transactions (thousands)',
        data: [12.5, 13.2, 11.8, 14.1, 13.7, 12.9, 15.2, 14.8, 13.5, 16.2, 15.8, 14.3],
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
          text: 'Month'
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
          text: 'Total Transactions (thousands)'
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
    <ChartWrapper
      type="line"
      data={data}
      options={options}
      title="Fraud Trend Over Time"
      height={350}
    />
  );
};

export default FraudTrendChart;