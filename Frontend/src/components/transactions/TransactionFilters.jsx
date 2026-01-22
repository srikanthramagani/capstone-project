import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Input, Select, Button, Card } from '../ui';
import apiService from '../../services/api';

const TransactionFilters = ({ onFiltersChange, onRefresh, filters: externalFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    amountRange: 'all',
    dateRange: 'all'
  });

  // Sync with external filters
  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      type: 'all',
      amountRange: 'all',
      dateRange: 'all'
    };
    setFilters(resetFilters);
    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  const handleExport = async () => {
    try {
      const data = await apiService.getTransactions({ ...filters, limit: 10000 });
      const transactions = data.transactions || [];
      
      // Create CSV content
      const csvContent = [
        ['Transaction ID', 'Hash', 'Sender', 'Receiver', 'Amount', 'Status', 'Type', 'Timestamp', 'Blockchain Verified'],
        ...transactions.map(tx => [
          tx.id,
          tx.hash,
          tx.sender,
          tx.receiver,
          tx.amount,
          tx.status,
          tx.type,
          new Date(tx.timestamp).toISOString(),
          tx.blockchainVerified ? 'Yes' : 'No'
        ])
      ].map(row => row.join(',')).join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Failed to export transactions');
    }
  };

  return (
    <Card className="mb-6">
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by Transaction ID, Sender, or Receiver..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-white"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="flagged">Flagged</option>
          </Select>

          {/* Transaction Type */}
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="transfer">Transfer</option>
            <option value="payment">Payment</option>
            <option value="cash_out">Cash Out</option>
            <option value="cash_in">Cash In</option>
            <option value="debit">Debit</option>
          </Select>

          {/* Amount Range */}
          <Select
            value={filters.amountRange}
            onChange={(e) => handleFilterChange('amountRange', e.target.value)}
          >
            <option value="all">All Amounts</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-1000">$100 - $1,000</option>
            <option value="1000-10000">$1,000 - $10,000</option>
            <option value="10000+">$10,000+</option>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="small" onClick={handleReset}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
            
            <Select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              containerClassName="min-w-0"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="small" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="small" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default TransactionFilters;