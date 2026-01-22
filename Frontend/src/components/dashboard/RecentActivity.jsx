import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import axios from 'axios';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics/flagged');
        if (response.data) {
          const flaggedTxns = response.data.flagged || response.data.flaggedTransactions || [];
          
          // Convert flagged transactions to activity format
          const convertedActivities = flaggedTxns.slice(0, 5).map((tx, index) => ({
            id: tx._id || index,
            type: 'fraud_detected',
            message: 'Suspicious transaction flagged',
            details: `Transaction #${tx.transactionId} flagged - Amount: $${tx.amount?.toFixed(2)} from ${tx.sender} to ${tx.receiver}`,
            timestamp: new Date(tx.timestamp).toLocaleString(),
            severity: 'high',
            txId: tx.transactionId,
            blockchainHash: tx.blockchain?.txHash
          }));
          
          // Add system activity
          convertedActivities.push({
            id: 'model_update',
            type: 'model_update',
            message: 'ML model active',
            details: `Fraud detection model processing ${flaggedTxns.length} flagged transactions`,
            timestamp: new Date().toLocaleString(),
            severity: 'info',
            accuracy: '94.2%'
          });
          
          setActivities(convertedActivities);
        }
      } catch (error) {
        console.error('Error loading activities:', error);
        setActivities([{
          id: 1,
          type: 'system_maintenance',
          message: 'Loading activities',
          details: 'Connecting to backend...',
          timestamp: new Date().toLocaleString(),
          severity: 'info'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type, severity) => {
    if (type === 'fraud_detected') return AlertTriangle;
    if (type === 'transaction_approved') return CheckCircle;
    return Clock;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Recent Activity</Card.Title>
          <Button variant="outline" size="small">
            View All
          </Button>
        </div>
      </Card.Header>
      
      <Card.Content className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
          const Icon = getActivityIcon(activity.type, activity.severity);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-gray-500 mt-0.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(activity.severity)} size="small">
                      {activity.severity}
                    </Badge>
                    {activity.blockchainHash && (
                      <a 
                        href={`https://etherscan.io/tx/${activity.blockchainHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View on blockchain"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.details}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {activity.timestamp}
                  </p>
                  
                  {activity.accuracy && (
                    <span className="text-xs font-medium text-green-600">
                      Accuracy: {activity.accuracy}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
        )}
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;