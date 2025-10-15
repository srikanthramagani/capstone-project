import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Table, Badge, Button, Modal } from '../ui';

const TransactionTable = ({ transactions, onSort, sortConfig }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head 
                sortable 
                onClick={() => onSort('id')}
                className="cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Transaction ID</span>
                  {getSortIcon('id')}
                </div>
              </Table.Head>
              
              <Table.Head>Sender</Table.Head>
              
              <Table.Head>Receiver</Table.Head>
              
              <Table.Head 
                sortable
                onClick={() => onSort('amount')}
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
                onClick={() => onSort('timestamp')}
                className="cursor-pointer hover:bg-gray-100"
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
                <Table.Cell className="font-mono text-sm">
                  {transaction.id}
                </Table.Cell>
                
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {formatAddress(transaction.sender)}
                    </span>
                  </div>
                </Table.Cell>
                
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {formatAddress(transaction.receiver)}
                    </span>
                  </div>
                </Table.Cell>
                
                <Table.Cell className="font-semibold">
                  {formatAmount(transaction.amount)}
                </Table.Cell>
                
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <Badge variant={getStatusBadge(transaction.status)} size="small">
                      {transaction.status}
                    </Badge>
                  </div>
                </Table.Cell>
                
                <Table.Cell className="text-sm text-gray-600">
                  {new Date(transaction.timestamp).toLocaleDateString()} <br />
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </span>
                </Table.Cell>
                
                <Table.Cell>
                  <div className="flex items-center space-x-2">
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

      {/* Transaction Details Modal */}
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
};

export default TransactionTable;