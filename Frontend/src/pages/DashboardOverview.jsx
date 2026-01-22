import React, { useState } from 'react';
import { AdminLayout } from '../components';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickStats from '../components/dashboard/QuickStats';
import BlockchainProofCard from '../components/dashboard/BlockchainProofCard';
import axios from 'axios';

const DashboardOverview = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Call backend PDF generation endpoint
      const response = await axios.get('http://localhost:5000/analytics/generate-pdf-report', {
        responseType: 'blob' // Important: tells axios to expect binary data
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fraud-detection-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('✅ PDF Report generated successfully with charts and analysis!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRunTraining = async () => {
    setIsTraining(true);
    try {
      const response = await axios.post('http://localhost:5000/analytics/retrain');
      if (response.data.success) {
        alert(`✅ Model retrained successfully!\nAccuracy: ${response.data.accuracy || 'N/A'}`);
      } else {
        alert('❌ Model training failed. Please check the backend logs.');
      }
    } catch (error) {
      console.error('Error training model:', error);
      alert('❌ Failed to start model training. Please ensure the backend is running.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-gray-600">
            Monitor fraud detection system performance and recent activity
          </p>
        </div>

        {/* Main Metrics */}
        <DashboardMetrics />

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <QuickStats />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Blockchain Proof Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlockchainProofCard />
          
          {/* Additional Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <p className="text-gray-600 mt-1">
                  Common administrative tasks
                </p>
              </div>
              <div className="flex flex-col space-y-3 mt-4">
                <button 
                  onClick={handleRunTraining}
                  disabled={isTraining}
                  className="bg-white text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isTraining ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Training...
                    </>
                  ) : 'Run Model Training'}
                </button>
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGeneratingReport ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardOverview;