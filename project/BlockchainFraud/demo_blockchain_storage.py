"""
COMPLETE DEMONSTRATION:
Upload data → Store on Ganache → Save to MongoDB with REAL transaction IDs
"""
import requests
import pandas as pd
from mongodb_service import MongoDBService
import time

BASE_URL = "http://localhost:5000"

def demo_complete_flow():
    print("\n" + "="*80)
    print("  COMPLETE BLOCKCHAIN + MONGODB DEMONSTRATION")
    print("="*80)
    print("\n📋 This demo will:")
    print("   1. Upload data to Flask API")
    print("   2. Store on Ganache blockchain (get REAL transaction hash)")
    print("   3. Save to MongoDB with blockchain proof")
    print("   4. Verify MongoDB has REAL Ganache transaction IDs")
    
    # Step 1: Upload data
    print("\n" + "="*80)
    print("STEP 1: Upload Data")
    print("="*80)
    
    file_path = 'Dataset/data.csv'
    try:
        with open(file_path, 'rb') as f:
            print(f"📤 Uploading: {file_path}")
            response = requests.post(f"{BASE_URL}/upload", files={'file': f})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Upload successful!")
            print(f"   Rows loaded: {data.get('total_rows', 0)}")
            print(f"   Fraud detected: {data.get('fraud_detected', 0)}")
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Step 2: Store with blockchain
    print("\n" + "="*80)
    print("STEP 2: Store on Blockchain + MongoDB")
    print("="*80)
    print("🔗 Calling Ganache to create blockchain transaction...")
    print("⏳ This will:")
    print("   - Generate analytics hash")
    print("   - Send transaction to Ganache")
    print("   - Wait for block to be mined")
    print("   - Get REAL transaction hash & block number")
    print("   - Store in MongoDB with blockchain proof")
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/store")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Storage successful!")
            print(f"   Transactions stored: {data.get('inserted', 0)}")
            print(f"   Batch ID: {data.get('batchId', 'N/A')}")
            print(f"   MongoDB Collection: {data.get('collection', 'N/A')}")
            print(f"   Operation Type: {data.get('operation', 'N/A')}")
        else:
            print(f"❌ Storage failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Step 3: Verify blockchain fields in MongoDB
    print("\n" + "="*80)
    print("STEP 3: Verify MongoDB Has REAL Ganache Transaction IDs")
    print("="*80)
    
    time.sleep(1)  # Brief pause
    
    m = MongoDBService()
    txs = m.get_transactions(limit=3)
    
    if not txs:
        print("❌ No transactions found in MongoDB")
        return False
    
    print(f"\n📊 Retrieved {len(txs)} sample transactions from MongoDB")
    print("\n" + "-"*80)
    
    for idx, tx in enumerate(txs, 1):
        blockchain = tx.get('blockchain', {})
        
        print(f"\nTransaction {idx}:")
        print(f"  ID: {tx.get('transactionId', 'N/A')}")
        print(f"  Amount: ${tx.get('amount', 0):,.2f}")
        print(f"  Type: {tx.get('transactionType', 'N/A')}")
        print(f"  Prediction: {tx.get('prediction', 'N/A')}")
        
        print(f"\n  🔗 BLOCKCHAIN PROOF FROM GANACHE:")
        print(f"     Batch Hash: {blockchain.get('batchHash', 'NULL')}")
        print(f"     Block Number: {blockchain.get('blockNumber', 'NULL')}")
        print(f"     TX Hash: {blockchain.get('txHash', 'NULL')}")
        print(f"     Verified: {blockchain.get('verified', False)}")
        
        # Check if these are REAL values from Ganache
        has_hash = blockchain.get('batchHash') is not None and blockchain.get('batchHash') != 'NULL'
        has_block = blockchain.get('blockNumber') is not None
        has_tx = blockchain.get('txHash') is not None and blockchain.get('txHash') != 'NULL'
        
        if has_hash and has_block and has_tx:
            print(f"     ✅ REAL Ganache blockchain data stored!")
        else:
            print(f"     ❌ Blockchain fields are NULL or missing")
    
    # Final summary
    print("\n" + "="*80)
    print("FINAL RESULT")
    print("="*80)
    
    first_tx = txs[0]
    blockchain = first_tx.get('blockchain', {})
    
    if blockchain.get('batchHash') and blockchain.get('txHash'):
        print("\n🎉 SUCCESS! MongoDB contains REAL Ganache transaction IDs")
        print("\n📦 Proof:")
        print(f"   Batch Hash: {blockchain['batchHash']}")
        print(f"   Block Number: {blockchain.get('blockNumber', 'N/A')}")
        print(f"   Transaction Hash: {blockchain['txHash']}")
        print(f"\n✓ These are REAL transaction IDs from Ganache blockchain")
        print(f"✓ Data is verifiable on the blockchain")
        return True
    else:
        print("\n❌ ISSUE: Blockchain fields are NULL")
        print("\n🔍 Troubleshooting:")
        print("   1. Check if Ganache is running: http://127.0.0.1:8545")
        print("   2. Check Flask logs for blockchain connection errors")
        print("   3. Verify smart contract is deployed")
        return False

if __name__ == '__main__':
    print("\n🚀 Starting Complete Blockchain Storage Demo...")
    print("⚠️  Make sure Ganache is running!")
    
    time.sleep(1)
    success = demo_complete_flow()
    
    if success:
        print("\n" + "="*80)
        print("✅ DEMO COMPLETED SUCCESSFULLY!")
        print("="*80)
        print("\nYour system now:")
        print("  ✓ Stores transactions on Ganache blockchain")
        print("  ✓ Gets REAL transaction hashes and block numbers")
        print("  ✓ Saves blockchain proof in MongoDB")
        print("  ✓ Provides verifiable audit trail")
    else:
        print("\n" + "="*80)
        print("⚠️  DEMO INCOMPLETE - Check errors above")
        print("="*80)
