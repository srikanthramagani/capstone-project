from mongodb_service import MongoDBService

m = MongoDBService()
print(f'Total docs: {m.transactions_collection.count_documents({})}')
print(f'With type field: {m.transactions_collection.count_documents({"type": {"$exists": True}})}')
print(f'With step field: {m.transactions_collection.count_documents({"step": {"$exists": True}})}')
print(f'Fraud count: {m.transactions_collection.count_documents({"isFraud": 1})}')
