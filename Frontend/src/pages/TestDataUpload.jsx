import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
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
} from "recharts";

export default function TestDataUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
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
      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.response?.data?.error || err.message || "Backend error"}`);
    }
    setLoading(false);
  };

  // --- Stats helpers ---
  const getStatistics = (transactions) => {
    if (!transactions || !transactions.length) return [];
    const fraud = transactions.filter((t) => t.color === "red").length;
    const normal = transactions.filter((t) => t.color === "green").length;
    return [
      { name: "Fraud", value: fraud },
      { name: "Normal", value: normal },
    ];
  };

  const transactions = result?.transactions ?? [];
  const stats = useMemo(() => getStatistics(transactions), [transactions]);

  const totals = useMemo(
    () => ({
      total: transactions.length,
      fraud: stats.find((s) => s.name === "Fraud")?.value || 0,
      normal: stats.find((s) => s.name === "Normal")?.value || 0,
    }),
    [transactions.length, stats]
  );

  const barData = useMemo(
    () => stats.map((s) => ({ name: s.name, Count: s.value })),
    [stats]
  );

  const COLORS = ["#e53935", "#43a047"]; // Red/Green

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        overflowX: "hidden", // prevent black strip from horizontal overflow
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 1200 }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            background: "rgba(255,255,255,0.95)",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color="#137cbd"
            fontWeight={700}
            gutterBottom
          >
            Upload Test Data (CSV)
          </Typography>

          {/* Upload form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{
                marginBottom: 8,
                border: "1px solid #d0d7de",
                padding: "6px 10px",
                borderRadius: 8,
                background: "#fff",
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ py: 1.25, px: 4, fontWeight: "bold", borderRadius: "10px" }}
            >
              {loading ? (
                <>
                  <CircularProgress size={22} sx={{ color: "white", mr: 1 }} />
                  Uploading...
                </>
              ) : (
                "Upload & Predict"
              )}
            </Button>
          </form>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Results */}
          {transactions.length > 0 && (
            <Box sx={{ mt: 6 }}>
              {/* ===== Summary + Charts (TOP) ===== */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Summary cards */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {totals.total}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      textAlign: "center",
                      background: "#ffebee",
                    }}
                  >
                    <Typography variant="subtitle2" color="error">
                      Fraud
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="error.main">
                      {totals.fraud}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      textAlign: "center",
                      background: "#e8f5e9",
                    }}
                  >
                    <Typography variant="subtitle2" color="success.main">
                      Normal
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {totals.normal}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography
                variant="h5"
                color="#185a9d"
                fontWeight={600}
                gutterBottom
                align="center"
              >
                Fraud vs Normal Statistics
              </Typography>

              <Grid container spacing={4} sx={{ mt: 1 }}>
                {/* Pie */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, height: 340 }}>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {stats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>

                {/* Bar */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, height: 340 }}>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Count" fill="#137cbd" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* ===== Transaction cards (BOTTOM) ===== */}
              <Box sx={{ mt: 6 }}>
                <Typography
                  variant="h5"
                  color="#185a9d"
                  fontWeight={600}
                  gutterBottom
                >
                  Transaction Details
                </Typography>

                <Grid container spacing={2}>
                  {transactions.map((txn, idx) => {
                    const isFraud = txn.color === "red";
                    const [id, type, amount, customer, age, , merchant] = txn.data;

                    return (
                      <Grid item xs={12} md={6} lg={4} key={idx}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: isFraud ? "#ffebee" : "#e8f5e9",
                              boxShadow: 3,
                              height: "100%",
                            }}
                          >
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="h6" fontWeight={600}>
                                Transaction #{id}
                              </Typography>
                              <Chip
                                label={isFraud ? "FRAUD" : "NORMAL"}
                                color={isFraud ? "error" : "success"}
                                sx={{ fontWeight: "bold" }}
                              />
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography><b>Type:</b> {type}</Typography>
                            <Typography><b>Amount:</b> ${amount}</Typography>
                            <Typography><b>Customer:</b> {customer}</Typography>
                            <Typography><b>Merchant:</b> {merchant}</Typography>
                            <Typography><b>Age:</b> {age}</Typography>
                          </Paper>
                        </motion.div>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          )}
        </Card>
      </motion.div>
    </Box>
  );
}
