from mongodb_service import mongodb_service
import json

# Check MongoDB stats
stats = mongodb_service.get_transaction_stats()
print(f"MongoDB Stats: {json.dumps(stats, indent=2)}")

# Get sample transactions
txns = mongodb_service.get_transactions(limit=5)
print(f"\nSample transactions found: {len(txns)}")

if txns:
    print(f"First transaction keys: {list(txns[0].keys())}")
    print(f"\nFirst transaction sample:")
    print(json.dumps(txns[0], indent=2, default=str))
else:
    print("No transactions in database")
