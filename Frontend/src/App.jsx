import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminScreen from './pages/AdminScreen';
import DashboardOverview from './pages/DashboardOverview';
import TransactionMonitoring from './pages/TransactionMonitoring';
import FraudAnalytics from './pages/FraudAnalytics';
import Predict from './pages/Predict';
import Logout from './pages/Logout';
import TestDataUpload from './pages/TestDataUpload';

// Test components (can be removed in production)
import AdminScreenTest from './pages/AdminScreenTest';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/adminscreen" element={<DashboardOverview />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/transactions" element={<TransactionMonitoring />} />
        <Route path="/analytics" element={<FraudAnalytics />} />
        
        {/* Legacy/Additional Routes */}
        <Route path="/predict" element={<Predict />} />
        <Route path="/testdata" element={<TestDataUpload />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Test Routes (remove in production) */}
        <Route path="/layout-test" element={<AdminScreenTest />} />
        <Route path="/legacy-admin" element={<AdminScreen />} />
      </Routes>
    </Router>
  );
}
