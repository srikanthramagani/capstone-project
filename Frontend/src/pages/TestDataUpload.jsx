import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  AlertCircle,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

export default function TestDataUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type - accept CSV, TXT, PDF
      const fileName = selectedFile.name.toLowerCase();
      const validExtensions = ['.csv', '.txt', '.pdf'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        setError('Please select a valid CSV, TXT, or PDF file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Response:", res.data);
      setResult(res.data);
      
      // Show success message with statistics
      if (res.data.uploaded_rows && res.data.processed_rows) {
        console.log(`✅ Processed ${res.data.processed_rows} out of ${res.data.uploaded_rows} rows`);
        console.log(`📦 Stored: ${res.data.stored_count}, ⏭️ Skipped (duplicates): ${res.data.skipped_count}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Backend error";
      setError(errorMsg);
    }
    setLoading(false);
  };

  // Download report as CSV
  const handleDownloadReport = () => {
    if (!result?.transactions) return;

    const csvRows = [];
    csvRows.push(['Transaction ID', 'Type', 'Amount', 'Customer', 'Merchant', 'Prediction', 'Status']);

    result.transactions.forEach((txn) => {
      const [id, type, amount, customer, , , merchant] = txn.data;
      const prediction = txn.prediction;
      const status = txn.color === 'red' ? 'FRAUD' : 'NORMAL';
      csvRows.push([id, type, amount, customer, merchant, prediction, status]);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud_detection_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Stats helpers
  const getStatistics = (transactions) => {
    if (!transactions || !transactions.length) return [];
    const fraud = transactions.filter((t) => t.color === "red").length;
    const normal = transactions.filter((t) => t.color === "green").length;
    return [
      { name: "Fraud", value: fraud, color: "#ef4444" },
      { name: "Normal", value: normal, color: "#22c55e" },
    ];
  };

  const transactions = result?.transactions ?? [];
  const stats = useMemo(() => getStatistics(transactions), [transactions]);

  const totals = useMemo(
    () => ({
      total: transactions.length,
      fraud: stats.find((s) => s.name === "Fraud")?.value || 0,
      normal: stats.find((s) => s.name === "Normal")?.value || 0,
      fraudPercentage: transactions.length > 0 
        ? ((stats.find((s) => s.name === "Fraud")?.value || 0) / transactions.length * 100).toFixed(1)
        : 0
    }),
    [transactions.length, stats]
  );

  const barData = useMemo(
    () => stats.map((s) => ({ name: s.name, Count: s.value })),
    [stats]
  );

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Test Data Upload</h1>
          <p className="mt-2 text-gray-600">
            Upload CSV files for batch fraud detection analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Test Data</h2>
              <p className="text-sm text-gray-500">Upload CSV file with transaction columns: step, type, amount, nameOrig, oldbalanceOrg, newbalanceOrig, nameDest, oldbalanceDest, newbalanceDest</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {file ? (
                        <span className="font-medium text-blue-600">{file.name}</span>
                      ) : (
                        'Choose CSV, TXT, or PDF file...'
                      )}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.txt,.pdf,text/csv,application/csv,text/plain,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || !file}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {transactions.length > 0 && (
          <div className="space-y-6">
            {/* Download Report Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>

            {/* Processing Statistics - Enhanced */}
            {result?.uploaded_rows && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 mb-6 shadow-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Processing Summary - {result.uploaded_rows} Transactions Analyzed
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-blue-600 font-medium mb-1">Uploaded</p>
                    <p className="text-2xl font-bold text-blue-900">{result.uploaded_rows}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-green-600 font-medium mb-1">Processed</p>
                    <p className="text-2xl font-bold text-green-900">{result.processed_rows}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-red-600 font-medium mb-1">Fraud Found</p>
                    <p className="text-2xl font-bold text-red-900">{result.fraud_detected || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-green-600 font-medium mb-1">Normal</p>
                    <p className="text-2xl font-bold text-green-900">{result.normal_detected || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-purple-600 font-medium mb-1">Stored (New)</p>
                    <p className="text-2xl font-bold text-purple-900">{result.stored_count}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-orange-600 font-medium mb-1">Duplicates</p>
                    <p className="text-2xl font-bold text-orange-900">{result.skipped_count}</p>
                  </div>
                </div>
                {result.message && (
                  <div className="mt-4 text-sm text-blue-800 bg-blue-100 rounded-lg p-3">
                    ✅ {result.message}
                  </div>
                )}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                    <p className="text-3xl font-bold text-gray-900">{totals.total}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 mb-1">Fraud Detected</p>
                    <p className="text-3xl font-bold text-red-600">{totals.fraud}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Normal Transactions</p>
                    <p className="text-3xl font-bold text-green-600">{totals.normal}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-1">Fraud Rate</p>
                    <p className="text-3xl font-bold text-orange-600">{totals.fraudPercentage}%</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Distribution Analysis</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Comparison</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis allowDecimals={false} stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="Count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Transaction Details Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <p className="text-sm text-gray-500 mt-1">Detailed view of all analyzed transactions</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Merchant</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((txn, idx) => {
                      const isFraud = txn.color === "red";
                      const [id, type, amount, customer, , , merchant] = txn.data;

                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            ${parseFloat(amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {merchant}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              isFraud 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isFraud ? (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  FRAUD
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  NORMAL
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
