import React from 'react';
import { clsx } from 'clsx';

const StatusIndicator = ({ 
  status = 'neutral', 
  label, 
  size = 'medium',
  className 
}) => {
  const statuses = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
    neutral: 'bg-gray-400'
  };
  
  const sizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      <div className={clsx(
        'rounded-full',
        statuses[status],
        sizes[size]
      )} />
      {label && (
        <span className="text-sm text-gray-600">{label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;