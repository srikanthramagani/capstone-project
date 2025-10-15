import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';

const RecentActivity = () => {
  // Mock recent activity data
  const activities = [
    {
      id: 1,
      type: 'fraud_detected',
      message: 'Suspicious transaction flagged',
      details: 'Transaction #TXN-2023-4567 flagged for unusual spending pattern',
      timestamp: '2 minutes ago',
      severity: 'high',
      txId: 'TXN-2023-4567'
    },
    {
      id: 2,
      type: 'model_update',
      message: 'ML model retrained',
      details: 'Fraud detection model updated with latest transaction data',
      timestamp: '15 minutes ago',
      severity: 'info',
      accuracy: '94.7%'
    },
    {
      id: 3,
      type: 'transaction_approved',
      message: 'Large transaction verified',
      details: 'Transaction #TXN-2023-4563 ($50,000) verified and approved',
      timestamp: '1 hour ago',
      severity: 'success',
      txId: 'TXN-2023-4563'
    },
    {
      id: 4,
      type: 'system_maintenance',
      message: 'System maintenance completed',
      details: 'Scheduled maintenance window completed successfully',
      timestamp: '3 hours ago',
      severity: 'info'
    },
    {
      id: 5,
      type: 'fraud_detected',
      message: 'Multiple fraud attempts blocked',
      details: '5 suspicious transactions from IP 192.168.1.100 blocked',
      timestamp: '4 hours ago',
      severity: 'warning'
    }
  ];

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
        {activities.map((activity) => {
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
                    {activity.txId && (
                      <Button variant="ghost" size="small" className="p-1">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
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
        })}
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;