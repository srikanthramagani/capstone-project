from mongodb_service import MongoDBService

m = MongoDBService()
sample = m.transactions_collection.find_one()
print("Sample transaction fields:")
for key, value in sample.items():
    print(f"  {key}: {type(value).__name__} = {value if len(str(value)) < 50 else str(value)[:50] + '...'}")
