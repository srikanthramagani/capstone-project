import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full space-y-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Blockchain Fraud Detection System
          </h1>
          <p className="text-xl text-gray-600">
            Secure, Smart, and Scalable ML for Transaction Analysis
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Dashboard Button */}
          <Link
            to="/admin"
            className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Admin Dashboard
              </h2>
              <p className="text-blue-100 text-lg">
                Access comprehensive fraud analytics and system management
              </p>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300"></div>
          </Link>

          {/* Test Transaction Data Button */}
          <Link
            to="/testdata"
            className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Test Transaction Data
              </h2>
              <p className="text-orange-100 text-lg">
                Upload CSV files for batch fraud analysis and detection
              </p>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
