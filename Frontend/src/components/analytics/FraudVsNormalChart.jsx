import React from 'react';
import { ChartWrapper } from '../ui';

const FraudVsNormalChart = () => {
  const data = {
    labels: ['Legitimate Transactions', 'Fraudulent Transactions'],
    datasets: [
      {
        data: [23456, 789],
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