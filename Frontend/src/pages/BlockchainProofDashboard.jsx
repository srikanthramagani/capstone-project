import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, RefreshCw, Database, Activity } from 'lucide-react';
import axios from 'axios';

const BlockchainProofDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBatches: 0,
    blockchainStoredBatches: 0,
    pendingBatches: 0
  });
  const [currentSession, setCurrentSession] = useState({
    totalRecords: 0,
    fraudCount: 0,
    safeCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storing, setStoring] = useState(false);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/dashboard/metrics');
      
      if (response.data.success) {
        setBatches(response.data.batches || []);
        setStatistics(response.data.statistics || {});
        setCurrentSession(response.data.currentSession || {});
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  // Store current analytics on blockchain
  const storeOnBlockchain = async () => {
    try {
      setStoring(true);
      const response = await axios.post('http://localhost:5000/analytics/store-blockchain');
      
      if (response.data.success) {
        alert(`✅ Analytics stored on blockchain!\n\nBatch ID: ${response.data.batchId}\nTX Hash: ${response.data.blockchain?.transactionHash}\nBlock: ${response.data.blockchain?.blockNumber}`);
        // Refresh metrics
        await fetchMetrics();
      } else {
        alert(`⚠️ ${response.data.error || response.data.warning}`);
      }
    } catch (err) {
      console.error('Error storing on blockchain:', err);
      alert('❌ Failed to store on blockchain: ' + (err.response?.data?.error || err.message));
    } finally {
      setStoring(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Blockchain Proof Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Verifiable analytics stored on blockchain with transaction receipts
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Batches</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalBatches}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Blockchain Stored</p>
              <p className="text-2xl font-bold text-green-900">{statistics.blockchainStoredBatches}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.pendingBatches}</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Current Session</p>
              <p className="text-2xl font-bold text-purple-900">{currentSession.totalRecords}</p>
              <p className="text-xs text-purple-600">
                {currentSession.fraudCount} fraud / {currentSession.safeCount} safe
              </p>
            </div>
            <Database className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={storeOnBlockchain}
          disabled={storing || currentSession.totalRecords === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
        >
          {storing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Storing on Blockchain...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Store Current Analytics on Blockchain
            </>
          )}
        </button>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 flex items-center gap-2 font-semibold"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Batches Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Analytics Batches with Blockchain Proof</h2>
          <p className="text-sm text-gray-600 mt-1">
            Each batch shows verifiable blockchain transaction receipt
          </p>
        </div>

        {loading && batches.length === 0 ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No batches stored yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload data and click "Store Current Analytics on Blockchain"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-gray-900">
                        {batch.batchId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Total: <span className="font-semibold">{batch.totalRecords}</span></div>
                        <div className="text-red-600">Fraud: {batch.fraudCount}</div>
                        <div className="text-green-600">Safe: {batch.safeCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {batch.blockchain?.stored ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4" />
                          Stored on Chain
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {batch.blockchain?.stored ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-blue-600">
                            {truncateHash(batch.blockchain.txHash)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(batch.blockchain.txHash);
                              alert('Transaction hash copied!');
                            }}
                            className="text-blue-500 hover:text-blue-700"
                            title="Copy full hash"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {batch.blockchain?.stored ? (
                        <span className="text-sm font-semibold text-gray-900">
                          #{batch.blockchain.blockNumber}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {batch.blockchain?.stored ? (
                        <span className="text-sm text-gray-700">
                          {batch.blockchain.network}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(batch.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">🔒 Blockchain Proof Verification</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Transaction Hash:</strong> Unique identifier for the blockchain transaction. This is the cryptographic proof that data was stored.
          </p>
          <p>
            <strong>Block Number:</strong> The block in which the transaction was mined. This proves when the data was stored.
          </p>
          <p>
            <strong>Network:</strong> The blockchain network where data is stored (Ganache Local for development, Ethereum Mainnet for production).
          </p>
          <p className="pt-2 font-semibold">
            ✅ All blockchain proofs are captured from actual transaction receipts - no fake or simulated data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainProofDashboard;
