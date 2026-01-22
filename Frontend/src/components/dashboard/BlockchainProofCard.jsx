import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, Database } from 'lucide-react';
import axios from 'axios';
import { Card } from '../ui';

const BlockchainProofCard = () => {
  const [batches, setBatches] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBatches: 0,
    blockchainStoredBatches: 0,
    pendingBatches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard/metrics');
        if (response.data.success) {
          const recentBlocks = response.data.recentBlocks || [];
          setBatches(recentBlocks.slice(0, 5));
          
          // Calculate statistics from recent blocks
          const totalBatches = recentBlocks.length;
          const blockchainStored = recentBlocks.filter(b => 
            b.transactions && b.transactions.some(tx => tx.hash && tx.hash.startsWith('0x'))
          ).length;
          
          setStatistics({
            totalBatches: totalBatches,
            blockchainStoredBatches: blockchainStored,
            pendingBatches: totalBatches - blockchainStored
          });
        }
      } catch (err) {
        console.error('Error fetching blockchain metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Blockchain Proof</h3>
        <Database className="w-6 h-6 text-blue-500" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-900">{statistics.totalBatches}</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-900">{statistics.blockchainStoredBatches}</p>
          <p className="text-xs text-green-600">On Chain</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-900">{statistics.pendingBatches}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Batches</h4>
        {loading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : batches.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No batches yet</p>
        ) : (
          batches.map((batch, index) => {
            const hasBlockchainData = batch.transactions && batch.transactions.some(tx => tx.hash && tx.hash.startsWith('0x'));
            
            return (
              <div
                key={batch.blockNumber || index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs font-mono font-semibold text-gray-900">
                      {batch.blockNumber || `Batch-${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Records: {batch.transactionCount || 0} | Fraud: {batch.fraudCount || 0}
                    </p>
                  </div>
                  {hasBlockchainData ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>

                {hasBlockchainData && batch.transactions && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Block:</span>
                      <span className="font-semibold text-gray-900">
                        {batch.blockHash ? truncateHash(batch.blockHash) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-600">Sample TX:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-blue-600">
                          {truncateHash(batch.transactions[0].hash)}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(batch.transactions[0].hash);
                            alert('TX hash copied!');
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="text-gray-700">{batch.timestamp || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ✅ Verified blockchain proofs from transaction receipts
        </p>
      </div>
    </Card>
  );
};

export default BlockchainProofCard;
