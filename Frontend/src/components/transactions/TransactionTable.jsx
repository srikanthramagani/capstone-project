import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Table, Badge, Button, Modal, Spinner, Select } from '../ui';
import apiService from '../../services/api';

const TransactionTable = forwardRef(({ filters = {}, onTransactionUpdate }, ref) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [filters, pagination.page, pagination.limit]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const data = await apiService.getTransactions(params);
      setTransactions(data.transactions || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }));
      setError(null);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
      setTransactions([]);
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Expose reload method to parent
  useImperativeHandle(ref, () => ({
    reload: loadTransactions
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning', 
      failed: 'danger',
      flagged: 'danger'
    };
    return variants[status] || 'default';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleViewOnBlockchain = (txHash) => {
    // Open blockchain explorer in new tab
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  const handleSort = (column) => {
    const direction = sortConfig.key === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column, direction });
    // In a real app, you'd pass this to the API
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500 rotate-180'}`} 
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
          <span className="ml-2 text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">
            {error}. Using cached data.
          </p>
          <button 
            onClick={loadTransactions}
            className="mt-2 flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head 
                  sortable 
                  onClick={() => handleSort('id')}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span className="hidden sm:inline">Transaction ID</span>
                    <span className="sm:hidden">TX ID</span>
                    {getSortIcon('id')}
                  </div>
                </Table.Head>
                
                <Table.Head className="hidden md:table-cell">Sender</Table.Head>
                
                <Table.Head className="hidden md:table-cell">Receiver</Table.Head>
                
                <Table.Head 
                  sortable
                  onClick={() => handleSort('amount')}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {getSortIcon('amount')}
                  </div>
                </Table.Head>
                
                <Table.Head>Status</Table.Head>
                
                <Table.Head 
                  sortable
                  onClick={() => handleSort('timestamp')}
                  className="cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {getSortIcon('timestamp')}
                  </div>
                </Table.Head>
                
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
          
            
            <Table.Body>
              {transactions.map((transaction) => (
                <Table.Row key={transaction.id} clickable>
                  <Table.Cell className="font-mono text-xs sm:text-sm">
                    <div className="sm:hidden">{transaction.id.slice(-8)}</div>
                    <div className="hidden sm:block">{transaction.id}</div>
                  </Table.Cell>
                  
                  <Table.Cell className="hidden md:table-cell">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {formatAddress(transaction.sender)}
                      </span>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="hidden md:table-cell">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {formatAddress(transaction.receiver)}
                      </span>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="font-semibold text-sm lg:text-base">
                    {formatAmount(transaction.amount)}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={getStatusBadge(transaction.status)} size="small">
                        <span className="hidden sm:inline">{transaction.status}</span>
                        <span className="sm:hidden">{transaction.status.charAt(0).toUpperCase()}</span>
                      </Badge>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="text-sm text-gray-600 hidden lg:table-cell">
                    {new Date(transaction.timestamp).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </span>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleViewDetails(transaction)}
                        className="p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleViewOnBlockchain(transaction.hash)}
                        className="p-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination Controls */}
        {!loading && transactions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = idx + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + idx;
                    } else {
                      pageNum = pagination.page - 2 + idx;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? 'primary' : 'outline'}
                        size="small"
                        onClick={() => handlePageChange(pageNum)}
                        className="min-w-[2.5rem]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Select
                value={pagination.limit}
                onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                containerClassName="w-auto"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </Select>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && transactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">No transactions found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Transaction Details"
          size="large"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Transaction Information</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Transaction ID:</dt>
                    <dd className="text-sm font-mono text-gray-900">{selectedTransaction.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Hash:</dt>
                    <dd className="text-sm font-mono text-gray-900">{selectedTransaction.hash}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Amount:</dt>
                    <dd className="text-sm font-semibold text-gray-900">{formatAmount(selectedTransaction.amount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Status:</dt>
                    <dd>
                      <Badge variant={getStatusBadge(selectedTransaction.status)} size="small">
                        {selectedTransaction.status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Addresses</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">From:</dt>
                    <dd className="text-sm font-mono text-gray-900 break-all">{selectedTransaction.sender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">To:</dt>
                    <dd className="text-sm font-mono text-gray-900 break-all">{selectedTransaction.receiver}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => handleViewOnBlockchain(selectedTransaction.hash)}>
                View on Blockchain
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
});

TransactionTable.displayName = 'TransactionTable';

export default TransactionTable;