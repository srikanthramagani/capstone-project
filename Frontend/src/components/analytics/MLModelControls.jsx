import React, { useState } from 'react';
import { Play, RotateCcw, Download, Settings } from 'lucide-react';
import { Button, Card, Badge, Spinner } from '../ui';

const MLModelControls = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [isRunningDetection, setIsRunningDetection] = useState(false);

  const modelInfo = {
    currentModel: 'Random Forest v2.1',
    lastTrained: '2024-01-15T08:30:00Z',
    accuracy: 94.7,
    precision: 92.3,
    recall: 89.6,
    f1Score: 90.9,
    trainingDataSize: 150000,
    features: 23
  };

  const handleRerunDetection = async () => {
    setIsRunningDetection(true);
    // Simulate API call
    setTimeout(() => {
      setIsRunningDetection(false);
      console.log('Fraud detection completed');
    }, 3000);
  };

  const handleRetrainModel = async () => {
    setIsTraining(true);
    // Simulate API call
    setTimeout(() => {
      setIsTraining(false);
      console.log('Model training completed');
    }, 8000);
  };

  const handleExportReport = () => {
    console.log('Exporting fraud detection report');
    // Implement report export logic
  };

  return (
    <div className="space-y-6">
      {/* Model Status Card */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>ML Model Status</Card.Title>
            <Badge variant="success" size="medium">
              Active
            </Badge>
          </div>
        </Card.Header>
        
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{modelInfo.accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{modelInfo.precision}%</p>
              <p className="text-sm text-gray-600">Precision</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{modelInfo.recall}%</p>
              <p className="text-sm text-gray-600">Recall</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{modelInfo.f1Score}%</p>
              <p className="text-sm text-gray-600">F1 Score</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Current Model:</span>
                <span className="ml-2 font-medium">{modelInfo.currentModel}</span>
              </div>
              <div>
                <span className="text-gray-500">Training Data Size:</span>
                <span className="ml-2 font-medium">{modelInfo.trainingDataSize.toLocaleString()} records</span>
              </div>
              <div>
                <span className="text-gray-500">Features:</span>
                <span className="ml-2 font-medium">{modelInfo.features} variables</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-500 text-sm">Last Trained:</span>
              <span className="ml-2 text-sm font-medium">
                {new Date(modelInfo.lastTrained).toLocaleString()}
              </span>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Action Controls */}
      <Card>
        <Card.Header>
          <Card.Title>Model Actions</Card.Title>
        </Card.Header>
        
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Re-run Detection */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Fraud Detection</h4>
                <Play className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Run fraud detection on recent transactions
              </p>
              <Button
                onClick={handleRerunDetection}
                disabled={isRunningDetection}
                loading={isRunningDetection}
                className="w-full"
              >
                {isRunningDetection ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Running Detection...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Re-run Detection
                  </>
                )}
              </Button>
            </div>

            {/* Model Retraining */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Model Training</h4>
                <RotateCcw className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Retrain model with latest transaction data
              </p>
              <Button
                onClick={handleRetrainModel}
                disabled={isTraining}
                loading={isTraining}
                variant="success"
                className="w-full"
              >
                {isTraining ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Training Model...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retrain Model
                  </>
                )}
              </Button>
            </div>

            {/* Export Report */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Analytics Report</h4>
                <Download className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Generate comprehensive fraud analytics report
              </p>
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Model Configuration */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Model Configuration</h4>
                <p className="text-sm text-gray-600">Adjust detection thresholds and parameters</p>
              </div>
              <Button variant="outline" size="small">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default MLModelControls;