from mongodb_service import MongoDBService
import os

os.environ['FLASK_ENV'] = 'development'
svc = MongoDBService()

# Get distinct transaction types
types = svc.transactions_collection.distinct('transactionType')

print("Transaction types in database:")
for t in types:
    count = svc.transactions_collection.count_documents({'transactionType': t})
    print(f"  - {t}: {count:,} transactions")

print(f"\nTotal types: {len(types)}")
