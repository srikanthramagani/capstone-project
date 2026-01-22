"""
Quick script to populate MongoDB with test transaction data
"""
from mongodb_service import MongoDBService
import random
from datetime import datetime

def populate_test_data():
    mongo = MongoDBService()
    
    if not mongo.connected:
        print("❌ MongoDB not connected!")
        return
    
    # Check current count
    current_count = mongo.transactions_collection.count_documents({})
    print(f"Current transactions in DB: {current_count}")
    
    if current_count > 0:
        response = input(f"Database already has {current_count} transactions. Add more? (y/n): ")
        if response.lower() != 'y':
            print("Exiting...")
            return
    
    # Generate test transactions
    transaction_types = ['TRANSFER', 'PAYMENT', 'CASH_OUT', 'CASH_IN', 'DEBIT']
    transactions = []
    
    print("\n🔄 Generating 1000 test transactions...")
    
    for i in range(1000):
        is_fraud = 1 if random.random() < 0.15 else 0  # 15% fraud rate
        tx_type = random.choice(transaction_types)
        amount = random.uniform(100, 100000) if is_fraud == 0 else random.uniform(50000, 500000)
        
        transaction = {
            'step': i + 1,
            'type': tx_type,
            'amount': round(amount, 2),
            'nameOrig': f'C{random.randint(1000000, 9999999)}',
            'oldbalanceOrg': round(random.uniform(0, 100000), 2),
            'newbalanceOrig': round(random.uniform(0, 100000), 2),
            'nameDest': f'M{random.randint(1000000, 9999999)}',
            'oldbalanceDest': round(random.uniform(0, 100000), 2),
            'newbalanceDest': round(random.uniform(0, 100000), 2),
            'isFraud': is_fraud,
            'prediction': 'FRAUD' if is_fraud == 1 else 'NORMAL',
            'confidence': round(random.uniform(0.75, 0.99), 2),
            'processed_at': datetime.now().isoformat(),
            'filename': 'test_data_population'
        }
        transactions.append(transaction)
    
    # Insert in batches
    batch_size = 100
    for i in range(0, len(transactions), batch_size):
        batch = transactions[i:i + batch_size]
        mongo.transactions_collection.insert_many(batch)
        print(f"   Inserted batch {i//batch_size + 1}/{len(transactions)//batch_size}")
    
    # Verify
    final_count = mongo.transactions_collection.count_documents({})
    fraud_count = mongo.transactions_collection.count_documents({'isFraud': 1})
    
    print(f"\n✅ Data population complete!")
    print(f"   Total transactions: {final_count}")
    print(f"   Fraud transactions: {fraud_count}")
    print(f"   Normal transactions: {final_count - fraud_count}")
    print(f"\n🌐 Now refresh your analytics page to see the data!")

if __name__ == '__main__':
    populate_test_data()
