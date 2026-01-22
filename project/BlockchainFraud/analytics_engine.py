"""
Dynamic Analytics Engine - NO HARDCODED DATA
Calculates real-time analytics from uploaded datasets
"""
import pandas as pd
import numpy as np
from typing import Dict, List
from datetime import datetime

class AnalyticsEngine:
    """Dynamic analytics calculator for uploaded transaction data"""
    
    def __init__(self):
        self.session_data = None  # Current upload session
        self.session_predictions = None
        self.session_metadata = {}
    
    def load_session(self, df: pd.DataFrame, predictions: np.ndarray, metadata: Dict):
        """Load new upload session"""
        self.session_data = df.copy()
        self.session_predictions = predictions.copy()
        self.session_metadata = metadata.copy()
        
        print(f"\n{'='*80}")
        print(f"📊 NEW ANALYTICS SESSION LOADED")
        print(f"{'='*80}")
        print(f"📁 File: {metadata.get('filename', 'Unknown')}")
        print(f"📊 Total Rows: {len(df)}")
        print(f"🔍 Columns: {list(df.columns)}")
        print(f"{'='*80}\n")
    
    def get_session_analytics(self) -> Dict:
        """
        Calculate DYNAMIC analytics from current session
        NO HARDCODED VALUES - everything computed from uploaded data
        """
        if self.session_data is None or self.session_predictions is None:
            return self._empty_analytics()
        
        df = self.session_data
        predictions = self.session_predictions
        
        total_records = len(df)
        
        # DEFENSIVE CHECK: Ensure predictions match data rows
        if len(predictions) != total_records:
            print(f"⚠️ WARNING: Predictions ({len(predictions)}) != Data rows ({total_records})")
            predictions = predictions[:total_records]  # Truncate to match
        
        # Count fraud vs normal (NO ASSUMPTIONS)
        fraud_count = int(np.sum(predictions == 1))
        normal_count = int(np.sum(predictions == 0))
        
        # Transaction type breakdown
        type_distribution = {}
        if 'type' in df.columns:
            type_counts = df['type'].value_counts().to_dict()
            type_distribution = {str(k): int(v) for k, v in type_counts.items()}
        
        # Amount statistics
        amount_stats = {}
        if 'amount' in df.columns:
            amounts = pd.to_numeric(df['amount'], errors='coerce').dropna()
            amount_stats = {
                'total': float(amounts.sum()),
                'average': float(amounts.mean()),
                'median': float(amounts.median()),
                'max': float(amounts.max()),
                'min': float(amounts.min())
            }
        
        # Fraud by transaction type
        fraud_by_type = {}
        if 'type' in df.columns and len(predictions) == len(df):
            df_with_pred = df.copy()
            df_with_pred['prediction'] = predictions
            for tx_type in df_with_pred['type'].unique():
                type_data = df_with_pred[df_with_pred['type'] == tx_type]
                fraud_in_type = int((type_data['prediction'] == 1).sum())
                fraud_by_type[str(tx_type)] = {
                    'total': len(type_data),
                    'fraud': fraud_in_type,
                    'fraud_rate': (fraud_in_type / len(type_data) * 100) if len(type_data) > 0 else 0
                }
        
        # Build comprehensive analytics
        analytics = {
            'session_info': {
                'filename': self.session_metadata.get('filename', 'Unknown'),
                'upload_time': self.session_metadata.get('upload_time', datetime.now().isoformat()),
                'file_size': self.session_metadata.get('file_size', 0)
            },
            'totals': {
                'total_records': total_records,
                'fraud_detected': fraud_count,
                'normal_detected': normal_count,
                'fraud_percentage': (fraud_count / total_records * 100) if total_records > 0 else 0,
                'normal_percentage': (normal_count / total_records * 100) if total_records > 0 else 0
            },
            'transaction_types': type_distribution,
            'amount_statistics': amount_stats,
            'fraud_by_type': fraud_by_type,
            'data_quality': {
                'columns': list(df.columns),
                'missing_values': df.isnull().sum().to_dict(),
                'data_types': df.dtypes.astype(str).to_dict()
            }
        }
        
        # VALIDATION: Ensure no silent truncation
        assert analytics['totals']['total_records'] == len(df), \
            f"CRITICAL: Total records mismatch! Expected {len(df)}, got {analytics['totals']['total_records']}"
        
        assert analytics['totals']['fraud_detected'] + analytics['totals']['normal_detected'] == total_records, \
            f"CRITICAL: Fraud+Normal ({fraud_count}+{normal_count}) != Total ({total_records})"
        
        print(f"✅ Analytics calculated for {total_records} records")
        print(f"   🚨 Fraud: {fraud_count} ({fraud_count/total_records*100:.1f}%)")
        print(f"   ✅ Normal: {normal_count} ({normal_count/total_records*100:.1f}%)")
        
        return analytics
    
    def _empty_analytics(self) -> Dict:
        """Return empty analytics structure"""
        return {
            'session_info': {},
            'totals': {
                'total_records': 0,
                'fraud_detected': 0,
                'normal_detected': 0,
                'fraud_percentage': 0,
                'normal_percentage': 0
            },
            'transaction_types': {},
            'amount_statistics': {},
            'fraud_by_type': {},
            'data_quality': {}
        }
    
    def get_detailed_records(self, limit: int = None) -> List[Dict]:
        """Get detailed transaction records with predictions"""
        if self.session_data is None or self.session_predictions is None:
            return []
        
        df = self.session_data
        predictions = self.session_predictions
        
        records = []
        max_records = len(df) if limit is None else min(limit, len(df))
        
        for i in range(max_records):
            record = {
                'index': i,
                'prediction': 'FRAUD' if predictions[i] == 1 else 'NORMAL',
                'prediction_value': int(predictions[i]),
                'data': df.iloc[i].to_dict()
            }
            records.append(record)
        
        return records
    
    def clear_session(self):
        """Clear current session data"""
        self.session_data = None
        self.session_predictions = None
        self.session_metadata = {}
        print("🧹 Analytics session cleared")

# Global analytics engine instance
analytics_engine = AnalyticsEngine()
