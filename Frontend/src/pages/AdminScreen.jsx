import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminScreen() {
  const location = useLocation();
  const backendHtml = location.state?.backendHtml || "";

  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from backend
  const fetchRealData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard metrics (real processed data)
      const metricsResponse = await fetch('http://localhost:5000/dashboard/metrics');
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setDashboardData(metricsData);
      }
      
      // Fetch analytics charts (real fraud analytics)
      const analyticsResponse = await fetch('http://localhost:5000/analytics/charts');
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        setAnalyticsData(analytics);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching real data:", err);
      setError("Unable to connect to backend. Please ensure the Flask server is running and data has been processed.");
      // Don't set any fallback data - show only real data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Chart colors for fraud analytics
  const COLORS = ['#00C851', '#ff4444', '#ffbb33', '#33b5e5'];

  const renderMetricsCard = (title, value, subtitle, trend) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ 
            color: trend.includes('+') ? '#4caf50' : trend.includes('-') ? '#f44336' : '#ffeb3b',
            fontWeight: 'bold'
          }}>
            {trend}
          </Typography>
        )}
      </Card>
    </motion.div>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            mb: 3,
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {backendHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(backendHtml),
              }}
            />
          ) : (
            <Box textAlign="center">
              <Typography variant="h3" sx={{ mb: 2, color: "#1e3c72", fontWeight: "bold" }}>
                🔗 Blockchain Fraud Detection Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: "#555", mb: 1 }}>
                Real-time Analytics from ML Models & Blockchain Data
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", bgcolor: '#e3f2fd', p: 2, borderRadius: 2, mt: 2 }}>
                ⚡ This dashboard shows ONLY real transaction data processed by ML models and stored on blockchain.
                <br />
                ✅ No duplicate data • ✅ No sample data • ✅ All transactions are unique and verified
              </Typography>
            </Box>
          )}
        </Card>

        {/* Loading State */}
        {loading && (
          <Card sx={{ p: 4, textAlign: 'center', mb: 3 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading real-time data from blockchain and ML models...</Typography>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card sx={{ p: 4, mb: 3, bgcolor: '#fff3cd', border: '1px solid #ffeaa7' }}>
            <Typography variant="h6" sx={{ color: '#856404', mb: 2 }}>
              ⚠️ No Real Data Available
            </Typography>
            <Typography sx={{ color: '#856404', mb: 2 }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={fetchRealData}
              sx={{ mr: 2 }}
            >
              Retry Connection
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/test-data-upload"
            >
              Upload Test Data
            </Button>
          </Card>
        )}

        {/* Real Dashboard Data */}
        {dashboardData && dashboardData.metrics && (
          <>
            {/* Metrics Cards */}
            <Card sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: "#1e3c72", fontWeight: "bold" }}>
                📊 Real-time Processing Metrics
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
                {renderMetricsCard(
                  "Total Transactions",
                  dashboardData.metrics.totalTransactions?.value || "0",
                  dashboardData.metrics.totalTransactions?.subtitle || "Processed by ML",
                  dashboardData.metrics.totalTransactions?.trendValue
                )}
                {renderMetricsCard(
                  "Active Users",
                  dashboardData.metrics.totalUsers?.value || "0",
                  dashboardData.metrics.totalUsers?.subtitle || "Unique entities",
                  dashboardData.metrics.totalUsers?.trendValue
                )}
                {renderMetricsCard(
                  "Fraud Detected",
                  dashboardData.metrics.fraudulentTransactions?.value || "0",
                  dashboardData.metrics.fraudulentTransactions?.subtitle || "By ML models",
                  dashboardData.metrics.fraudulentTransactions?.trendValue
                )}
                {renderMetricsCard(
                  "Model Accuracy",
                  dashboardData.metrics.modelAccuracy?.value || "0%",
                  dashboardData.metrics.modelAccuracy?.subtitle || "Current performance",
                  dashboardData.metrics.modelAccuracy?.trendValue
                )}
              </Box>
            </Card>

            {/* Blockchain Status */}
            <Card sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: "#1e3c72", fontWeight: "bold" }}>
                ⛓️ Blockchain Status & Recent Blocks
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: dashboardData.blockchainStatus?.status === 'online' ? '#4caf50' : '#f44336'
                  }}
                />
                <Typography variant="h6">
                  {dashboardData.blockchainStatus?.label || 'Status Unknown'}
                </Typography>
                <Typography variant="body2" sx={{ ml: 'auto', color: '#666' }}>
                  Total Blocks: {dashboardData.blockchainStatus?.totalBlocks || 0} | Last sync: {dashboardData.blockchainStatus?.lastSync || 'Never'}
                </Typography>
              </Box>

              {/* Recent Blocks with Transaction Hashmaps */}
              {dashboardData.recentBlocks && dashboardData.recentBlocks.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: "#1e3c72" }}>
                    📦 Recent Blocks with Transaction Hashmaps
                  </Typography>
                  {dashboardData.recentBlocks.slice(0, 5).map((block, index) => (
                    <Card key={index} sx={{ p: 3, mb: 2, bgcolor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 'bold' }}>
                            Block #{block.blockNumber}
                          </Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                            {block.blockHash}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            <strong>Timestamp:</strong> {block.timestamp}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            <strong>Transactions:</strong> {block.transactionCount} | <strong>Fraud:</strong> {block.fraudCount}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                            <strong>Miner:</strong> {block.miner}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Transaction Hashmaps */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#1e3c72', fontWeight: 'bold' }}>
                          Transaction Hashmaps ({block.transactions.length} transactions)
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto', bgcolor: 'white', p: 2, borderRadius: 1 }}>
                          {block.transactions.slice(0, 10).map((tx, txIndex) => (
                            <Box 
                              key={txIndex} 
                              sx={{ 
                                mb: 1, 
                                pb: 1, 
                                borderBottom: txIndex < block.transactions.slice(0, 10).length - 1 ? '1px solid #eee' : 'none'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: tx.fraud ? '#d32f2f' : '#388e3c' }}>
                                <strong>{tx.fraud ? '🚨 FRAUD' : '✅ NORMAL'}:</strong> {tx.hash}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>
                                {tx.from} → {tx.to} | ${tx.amount.toFixed(2)} | {tx.type}
                              </Typography>
                            </Box>
                          ))}
                          {block.transactions.length > 10 && (
                            <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
                              ... and {block.transactions.length - 10} more transactions
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  ))}
                  {dashboardData.analysisTimestamp && (
                    <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>
                      Last Analysis: {new Date(dashboardData.analysisTimestamp).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              )}
            </Card>
          </>
        )}

        {/* Real Analytics Charts */}
        {analyticsData && (
          <Card sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: "#1e3c72", fontWeight: "bold" }}>
              📈 Fraud Detection Analytics
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
              {/* Fraud vs Normal Pie Chart */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Fraud vs Normal Transactions
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.fraudVsNormal.labels.map((label, index) => ({
                        name: label,
                        value: analyticsData.fraudVsNormal.data[index],
                        fill: COLORS[index % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {analyticsData.fraudVsNormal.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Transaction Types */}
              {analyticsData.transactionTypes && analyticsData.transactionTypes.labels.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                    Transaction Types Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={analyticsData.transactionTypes.labels.map((label, index) => ({
                        type: label,
                        normal: analyticsData.transactionTypes.normal[index] || 0,
                        fraud: analyticsData.transactionTypes.fraud[index] || 0
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="normal" fill="#00C851" name="Normal" />
                      <Bar dataKey="fraud" fill="#ff4444" name="Fraud" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>

            {/* Fraud Trend (if available) */}
            {analyticsData.fraudTrend && analyticsData.fraudTrend.labels.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Fraud Detection Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={analyticsData.fraudTrend.labels.map((label, index) => ({
                      period: label,
                      fraudRate: analyticsData.fraudTrend.fraudRate[index] || 0,
                      totalTransactions: analyticsData.fraudTrend.totalTransactions[index] || 0
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalTransactions" fill="#33b5e5" name="Total Transactions" />
                    <Line type="monotone" dataKey="fraudRate" stroke="#ff4444" name="Fraud Rate %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        )}

        {/* No Data Message */}
        {!loading && !dashboardData && !analyticsData && (
          <Card sx={{ p: 4, textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "#1e3c72" }}>
              📊 No Processed Data Available
            </Typography>
            <Typography sx={{ mb: 3, color: '#666' }}>
              This dashboard shows only real data processed through ML models and stored on blockchain.
              Upload transaction data to see live fraud detection results.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" component={Link} to="/test-data-upload">
                Upload Transaction Data
              </Button>
              <Button variant="outlined" component={Link} to="/predict">
                Run Fraud Detection
              </Button>
              <Button variant="outlined" component={Link} to="/live-analysis">
                View Live Analysis
              </Button>
            </Box>
          </Card>
        )}

        {/* Navigation */}
        <Card sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3c72" }}>
            🎛️ Admin Controls
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="contained" component={Link} to="/dashboard-overview">
              Dashboard Overview
            </Button>
            <Button variant="contained" component={Link} to="/transaction-monitoring">
              Transaction Monitoring
            </Button>
            <Button variant="contained" component={Link} to="/fraud-analytics">
              Fraud Analytics
            </Button>
            <Button variant="outlined" component={Link} to="/logout">
              Logout
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}