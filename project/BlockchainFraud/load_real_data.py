"""
Load real transaction data from dataset into blockchain service
This script initializes the blockchain service with real processed transactions
"""
from blockchain_service import blockchain_service
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def load_dataset_to_blockchain():
    """Load actual transaction data from dataset and store in blockchain"""
    print("=" * 60)
    print("Loading REAL transaction data into blockchain...")
    print("=" * 60)
    
    try:
        # Load the actual dataset
        df = pd.read_csv('Dataset/data.csv')
        print(f"✅ Loaded dataset with {len(df)} transactions")
        
        # Take a sample of transactions (e.g., 1000 for performance)
        sample_size = min(1000, len(df))
        df_sample = df.head(sample_size)
        print(f"📊 Processing {sample_size} transactions...")
        
        success_count = 0
        fraud_count = 0
        
        for i, row in df_sample.iterrows():
            # Get fraud status from actual data
            is_fraud = int(row.get('isFraud', 0))
            if is_fraud == 1:
                fraud_count += 1
            
            # Prepare transaction data
            transaction_data = {
                'sender': str(row.get('nameOrig', f'Customer_{i+1}'))[:30],
                'receiver': str(row.get('nameDest', f'Merchant_{i+1}'))[:30],
                'amount': float(row.get('amount', 0)),
                'type': str(row.get('type', 'TRANSFER')),
                'timestamp': (datetime.now() - timedelta(hours=i)).isoformat(),
                'confidence': 0.95
            }
            
            # Add to blockchain (will skip duplicates automatically)
            processed_tx = blockchain_service.add_processed_transaction(
                transaction_data, 
                is_fraud
            )
            
            if processed_tx:
                success_count += 1
            
            # Progress indicator
            if (i + 1) % 100 == 0:
                print(f"  ⏳ Processed {i + 1}/{sample_size} transactions...")
        
        print("=" * 60)
        print(f"✅ Successfully loaded {success_count} REAL transactions")
        print(f"🚨 Fraud transactions: {fraud_count}")
        print(f"✅ Normal transactions: {success_count - fraud_count}")
        print(f"📊 Fraud rate: {(fraud_count/success_count*100):.2f}%")
        print("=" * 60)
        
        # Get and display stats
        stats = blockchain_service.get_transaction_count()
        print(f"\n📈 Blockchain Statistics:")
        print(f"   Total: {stats['total']}")
        print(f"   Fraud: {stats['fraud']}")
        print(f"   Normal: {stats['normal']}")
        print("=" * 60)
        
        return success_count
        
    except FileNotFoundError:
        print("❌ Error: Dataset/data.csv not found!")
        print("   Please ensure the dataset file exists.")
        return 0
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return 0

if __name__ == '__main__':
    load_dataset_to_blockchain()
