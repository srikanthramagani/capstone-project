import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import Pagination from '../components/transactions/Pagination';

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filters, setFilters] = useState({});

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN-2023-4567',
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      sender: '0x742d35Cc6634C0532925a3b8D',
      receiver: '0x8ba1f109551bD432803012645Hac136c',
      amount: 1250.50,
      status: 'completed',
      type: 'transfer',
      timestamp: '2024-01-15T10:30:00Z',
      gasUsed: 21000,
      gasPrice: 25
    },
    {
      id: 'TXN-2023-4568',
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      sender: '0x8ba1f109551bD432803012645Hac136c',
      receiver: '0x742d35Cc6634C0532925a3b8D',
      amount: 50000.00,
      status: 'flagged',
      type: 'withdrawal',
      timestamp: '2024-01-15T10:25:00Z',
      gasUsed: 25000,
      gasPrice: 30
    },
    {
      id: 'TXN-2023-4569',
      hash: '0x567890abcdef1234567890abcdef1234567890ab',
      sender: '0x123456789abcdef123456789abcdef123456789a',
      receiver: '0x987654321fedcba987654321fedcba987654321f',
      amount: 750.25,
      status: 'pending',
      type: 'payment',
      timestamp: '2024-01-15T10:20:00Z',
      gasUsed: 22000,
      gasPrice: 28
    },
    {
      id: 'TXN-2023-4570',
      hash: '0x90abcdef1234567890abcdef1234567890abcdef',
      sender: '0x987654321fedcba987654321fedcba987654321f',
      receiver: '0x123456789abcdef123456789abcdef123456789a',
      amount: 15000.00,
      status: 'completed',
      type: 'deposit',
      timestamp: '2024-01-15T10:15:00Z',
      gasUsed: 21000,
      gasPrice: 25
    },
    {
      id: 'TXN-2023-4571',
      hash: '0xcdef1234567890abcdef1234567890abcdef1234',
      sender: '0x456789abcdef123456789abcdef123456789abcde',
      receiver: '0x654321fedcba987654321fedcba987654321fedc',
      amount: 2500.75,
      status: 'failed',
      type: 'transfer',
      timestamp: '2024-01-15T10:10:00Z',
      gasUsed: 0,
      gasPrice: 22
    }
  ];

  // Generate more mock data for pagination testing
  const generateMockData = () => {
    const statuses = ['completed', 'pending', 'failed', 'flagged'];
    const types = ['transfer', 'payment', 'withdrawal', 'deposit'];
    const data = [];

    for (let i = 0; i < 150; i++) {
      data.push({
        id: `TXN-2023-${4572 + i}`,
        hash: `0x${Math.random().toString(16).slice(2, 42)}`,
        sender: `0x${Math.random().toString(16).slice(2, 42)}`,
        receiver: `0x${Math.random().toString(16).slice(2, 42)}`,
        amount: Math.random() * 50000 + 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        gasPrice: Math.floor(Math.random() * 50) + 20
      });
    }

    return [...mockTransactions, ...data];
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMockData();
      setTransactions(data);
      setFilteredTransactions(data);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, filters, sortConfig]);

  const filterAndSortTransactions = () => {
    let filtered = [...transactions];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.sender.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.receiver.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    if (filters.amountRange && filters.amountRange !== 'all') {
      const [min, max] = filters.amountRange === '10000+' 
        ? [10000, Infinity] 
        : filters.amountRange.split('-').map(Number);
      filtered = filtered.filter(tx => tx.amount >= min && (max ? tx.amount <= max : true));
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'timestamp') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockData();
      setTransactions(data);
      setLoading(false);
    }, 500);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Monitoring</h1>
          <p className="mt-2 text-gray-600">
            Monitor and analyze blockchain transactions in real-time
          </p>
        </div>

        {/* Filters */}
        <TransactionFilters 
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />

        {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">{totalItems}</span> transactions found
                {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') && (
                  <span className="ml-1">(filtered)</span>
                )}
              </p>
            </div>
            {loading && (
              <div className="text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={paginatedTransactions}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </AdminLayout>
  );
};

export default TransactionMonitoring;