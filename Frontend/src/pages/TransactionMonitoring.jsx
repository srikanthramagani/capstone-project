import React, { useState, useRef } from 'react';
import { AdminLayout } from '../components';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';

const TransactionMonitoring = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    dateRange: 'all',
    amountRange: 'all'
  });
  const tableRef = useRef();

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    // Trigger reload in table component
    if (tableRef.current) {
      tableRef.current.reload();
    }
  };

  const handleTransactionUpdate = (transactionId, updates) => {
    // Handle transaction updates if needed
    console.log('Transaction updated:', transactionId, updates);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Monitoring</h1>
          <p className="mt-2 text-gray-600">
            Monitor and analyze blockchain transactions from MongoDB in real-time
          </p>
        </div>

        {/* Filters */}
        <TransactionFilters 
          onFiltersChange={handleFilterChange}
          onRefresh={handleRefresh}
          filters={filters}
        />

        {/* Transaction Table with integrated pagination and API calls */}
        <TransactionTable
          ref={tableRef}
          filters={filters}
          onTransactionUpdate={handleTransactionUpdate}
        />
      </div>
    </AdminLayout>
  );
};

export default TransactionMonitoring;