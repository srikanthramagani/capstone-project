import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Predict() {
  const [form, setForm] = useState({ amount: '', type: '' });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("amount", form.amount);
      formData.append("type", form.type);
      if (file) {
        formData.append("file", file);
      }

      // 🔗 Send to backend Flask/FastAPI
      const res = await axios.post(
        "http://127.0.0.1:5000/PredictAction",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data.result);
    } catch (err) {
      setError("Prediction failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #43cea2 0%, #185a9d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
          width: 400,
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          fontWeight={700}
          sx={{ mb: 3, textAlign: "center" }}
        >
          Fraud Detection
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <TextField
            label="Amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* Dropdown for ML type selection */}
          <TextField
            select
            label="Select Data/Model Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="transaction">Transaction Data (Logistic Regression)</MenuItem>
            <MenuItem value="bank">Bank Records (Random Forest)</MenuItem>
            <MenuItem value="insurance">Insurance Claims (SVM)</MenuItem>
            <MenuItem value="credit">Credit Card Data (Neural Network)</MenuItem>
          </TextField>

          {/* File upload */}
          <Button variant="outlined" component="label">
            Upload Dataset (CSV/Excel)
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: -1 }}>
              Selected: {file.name}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary">
            Predict Fraud
          </Button>
        </form>

        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Fraud Detection Result: {result}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </motion.div>
    </Box>
  );
}
