import React from 'react';
import { ChartWrapper } from '../ui';

const TransactionTypeChart = () => {
  const data = {
    labels: ['Transfers', 'Payments', 'Withdrawals', 'Deposits', 'Other'],
    datasets: [
      {
        label: 'Normal Transactions',
        data: [8500, 6200, 3100, 4800, 920],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Fraudulent Transactions',
        data: [245, 180, 95, 62, 28],
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
            const normal = data.datasets[0].data[dataIndex];
            const fraud = data.datasets[1].data[dataIndex];
            const total = normal + fraud;
            const fraudRate = ((fraud / total) * 100).toFixed(2);
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