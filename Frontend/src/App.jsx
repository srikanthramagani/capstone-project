import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminScreen from './pages/AdminScreen';
import Predict from './pages/Predict';
import Logout from './pages/Logout';
import TestDataUpload from './pages/TestDataUpload';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/adminscreen" element={<AdminScreen />} />
        <Route path="/predict" element={<Predict />} />
  <Route path="/logout" element={<Logout />} />
  <Route path="/testdata" element={<TestDataUpload />} />
      </Routes>
    </Router>
  );
}
