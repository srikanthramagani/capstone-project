import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Clock,
  Eye
} from 'lucide-react';
import { Table, Badge, Button, Modal } from '../ui';

const FlaggedTransactionsTable = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock flagged transactions data
  const flaggedTransactions = [
    {
      id: 'TXN-2023-4567',
      sender: '0x742d35Cc6634C0532925a3b8D',
      receiver: '0x8ba1f109551bD432803012645Hac136c',
      amount: 50000.00,
      riskScore: 0.89,
      reason: 'Unusual spending pattern',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'pending_review',
      mlModel: 'Random Forest v2.1',
      confidence: 0.94
    },
    {
      id: 'TXN-2023-4568',
      sender: '0x123456789abcdef123456789abcdef123456789a',
      receiver: '0x987654321fedcba987654321fedcba987654321f',
      amount: 25000.00,
      riskScore: 0.76,
      reason: 'Multiple transactions in short time',
      timestamp: '2024-01-15T10:25:00Z',
      status: 'approved',
      mlModel: 'Neural Network v1.5',
      confidence: 0.87
    },
    {
      id: 'TXN-2023-4569',
      sender: '0x456789abcdef123456789abcdef123456789abcde',
      receiver: '0x654321fedcba987654321fedcba987654321fedc',
      amount: 75000.00,
      riskScore: 0.92,
      reason: 'Transaction from high-risk wallet',
      timestamp: '2024-01-15T10:20:00Z',
      status: 'rejected',
      mlModel: 'Gradient Boosting v3.0',
      confidence: 0.96
    },
    {
      id: 'TXN-2023-4570',
      sender: '0x789abcdef123456789abcdef123456789abcdef12',
      receiver: '0x321fedcba987654321fedcba987654321fedcba98',
      amount: 15000.00,
      riskScore: 0.68,
      reason: 'Velocity check failed',
      timestamp: '2024-01-15T10:15:00Z',
      status: 'pending_review',
      mlModel: 'Random Forest v2.1',
      confidence: 0.82
    },
    {
      id: 'TXN-2023-4571',
      sender: '0xabcdef123456789abcdef123456789abcdef123456',
      receiver: '0xfedcba987654321fedcba987654321fedcba987654',
      amount: 35000.00,
      riskScore: 0.84,
      reason: 'Geographic anomaly detected',
      timestamp: '2024-01-15T10:10:00Z',
      status: 'pending_review',
      mlModel: 'Neural Network v1.5',
      confidence: 0.91
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending_review': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      rejected: 'danger',
      pending_review: 'warning'
    };
    return variants[status] || 'default';
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore >= 0.8) return { variant: 'danger', label: 'High Risk' };
    if (riskScore >= 0.6) return { variant: 'warning', label: 'Medium Risk' };
    return { variant: 'success', label: 'Low Risk' };
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

  const handleApprove = (transactionId) => {
    console.log('Approving transaction:', transactionId);
    // Implement approval logic
  };

  const handleReject = (transactionId) => {
    console.log('Rejecting transaction:', transactionId);
    // Implement rejection logic
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Flagged Transactions</h3>
          <p className="text-sm text-gray-600 mt-1">
            Transactions requiring manual review based on ML detection
          </p>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Transaction ID</Table.Head>
              <Table.Head>Amount</Table.Head>
              <Table.Head>Risk Score</Table.Head>
              <Table.Head>Reason</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {flaggedTransactions.map((transaction) => {
              const riskBadge = getRiskBadge(transaction.riskScore);
              
              return (
                <Table.Row key={transaction.id}>
                  <Table.Cell className="font-mono text-sm">
                    {transaction.id}
                  </Table.Cell>
                  
                  <Table.Cell className="font-semibold">
                    {formatAmount(transaction.amount)}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {(transaction.riskScore * 100).toFixed(1)}%
                      </span>
                      <Badge variant={riskBadge.variant} size="small">
                        {riskBadge.label}
                      </Badge>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="max-w-xs">
                    <span className="text-sm text-gray-900 truncate block">
                      {transaction.reason}
                    </span>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={getStatusBadge(transaction.status)} size="small">
                        {transaction.status.replace('_', ' ')}
                      </Badge>
                    </div>
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
                      
                      {transaction.status === 'pending_review' && (
                        <>
                          <Button
                            variant="success"
                            size="small"
                            onClick={() => handleApprove(transaction.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleReject(transaction.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Flagged Transaction Details"
          size="large"
        >
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-red-800">
                  Risk Score: {(selectedTransaction.riskScore * 100).toFixed(1)}% - {getRiskBadge(selectedTransaction.riskScore).label}
                </span>
              </div>
              <p className="text-red-700 mt-1">{selectedTransaction.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Transaction Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Transaction ID:</dt>
                    <dd className="text-sm font-mono text-gray-900">{selectedTransaction.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Amount:</dt>
                    <dd className="text-sm font-semibold text-gray-900">{formatAmount(selectedTransaction.amount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Date:</dt>
                    <dd className="text-sm text-gray-900">{new Date(selectedTransaction.timestamp).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">ML Analysis</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Model Used:</dt>
                    <dd className="text-sm text-gray-900">{selectedTransaction.mlModel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Confidence:</dt>
                    <dd className="text-sm text-gray-900">{(selectedTransaction.confidence * 100).toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Status:</dt>
                    <dd>
                      <Badge variant={getStatusBadge(selectedTransaction.status)} size="small">
                        {selectedTransaction.status.replace('_', ' ')}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Wallet Addresses</h4>
              <div className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">From:</dt>
                  <dd className="text-sm font-mono text-gray-900 break-all">{selectedTransaction.sender}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">To:</dt>
                  <dd className="text-sm font-mono text-gray-900 break-all">{selectedTransaction.receiver}</dd>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              {selectedTransaction.status === 'pending_review' && (
                <>
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      handleReject(selectedTransaction.id);
                      setIsModalOpen(false);
                    }}
                  >
                    Reject Transaction
                  </Button>
                  <Button 
                    variant="success"
                    onClick={() => {
                      handleApprove(selectedTransaction.id);
                      setIsModalOpen(false);
                    }}
                  >
                    Approve Transaction
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FlaggedTransactionsTable;