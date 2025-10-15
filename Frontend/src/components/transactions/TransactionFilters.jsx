import React, { useState } from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Input, Select, Button, Card } from '../ui';

const TransactionFilters = ({ onFiltersChange, onRefresh }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    amountRange: 'all',
    dateRange: '7days'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      type: 'all',
      amountRange: 'all',
      dateRange: '7days'
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
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
              className="w-full"
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
            <option value="withdrawal">Withdrawal</option>
            <option value="deposit">Deposit</option>
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
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="small" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="small">
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