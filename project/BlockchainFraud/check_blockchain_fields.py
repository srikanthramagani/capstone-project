"""
Quick check of blockchain fields in MongoDB
"""
from mongodb_service import MongoDBService
import json

def check_blockchain_fields():
    print("\n" + "="*70)
    print("  CHECKING BLOCKCHAIN FIELDS IN MONGODB")
    print("="*70)
    
    m = MongoDBService()
    
    # Get a sample transaction
    txs = m.get_transactions(limit=5)
    
    if not txs:
        print("\n❌ No transactions found in database")
        print("   Need to upload and store data first")
        return False
    
    print(f"\n✅ Found {len(txs)} transactions")
    print("\nFirst transaction blockchain fields:")
    print("-" * 70)
    
    for idx, tx in enumerate(txs[:3], 1):
        blockchain = tx.get('blockchain', {})
        print(f"\nTransaction {idx}:")
        print(f"  Transaction ID: {tx.get('transactionId', 'N/A')}")
        print(f"  Amount: ${tx.get('amount', 0):,.2f}")
        print(f"  Prediction: {tx.get('prediction', 'N/A')}")
        print(f"\n  BLOCKCHAIN FIELDS:")
        print(f"    batchHash: {blockchain.get('batchHash', 'NULL')}")
        print(f"    blockNumber: {blockchain.get('blockNumber', 'NULL')}")
        print(f"    txHash: {blockchain.get('txHash', 'NULL')}")
        print(f"    verified: {blockchain.get('verified', False)}")
        
        # Check if populated
        has_hash = blockchain.get('batchHash') is not None
        has_tx = blockchain.get('txHash') is not None
        
        if has_hash and has_tx:
            print(f"  ✅ Blockchain fields ARE POPULATED")
        else:
            print(f"  ❌ Blockchain fields are NULL")
    
    # Summary
    print("\n" + "="*70)
    print("  SUMMARY")
    print("="*70)
    
    first_tx = txs[0]
    blockchain = first_tx.get('blockchain', {})
    
    if blockchain.get('batchHash') and blockchain.get('txHash'):
        print("✅ SUCCESS! Blockchain fields are POPULATED with values")
        print(f"\nSample values:")
        print(f"  Hash: {blockchain['batchHash'][:40]}...")
        print(f"  TX Hash: {blockchain['txHash'][:40]}...")
        if blockchain.get('blockNumber') is not None:
            print(f"  Block: {blockchain['blockNumber']}")
        return True
    else:
        print("❌ ISSUE: Blockchain fields are NULL")
        print("\nTo fix:")
        print("1. Upload data: POST /upload with CSV file")
        print("2. Store with blockchain: POST /transactions/store")
        return False

if __name__ == '__main__':
    check_blockchain_fields()
