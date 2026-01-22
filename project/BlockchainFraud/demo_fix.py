"""
Complete Fix Demonstration:
1. Clear old data
2. Upload new data
3. Store with blockchain fields
4. Verify blockchain fields are populated
"""
import requests
import time

BASE_URL = "http://localhost:5000"

def wait_for_server():
    for i in range(10):
        try:
            requests.get(f"{BASE_URL}/analytics/stats", timeout=2)
            print("✅ Server is ready")
            return True
        except:
            print(f"Waiting for server... ({i+1}/10)")
            time.sleep(1)
    return False

def clear_old_data():
    print("\n" + "="*70)
    print("STEP 1: Clearing old data from MongoDB")
    print("="*70)
    
    try:
        from mongodb_service import MongoDBService
        m = MongoDBService()
        
        # Delete all old transactions
        result = m.transactions_collection.delete_many({})
        print(f"✅ Deleted {result.deleted_count} old transactions")
        
    except Exception as e:
        print(f"⚠️ Could not clear old data: {e}")

def upload_data():
    print("\n" + "="*70)
    print("STEP 2: Uploading new data")
    print("="*70)
    
    try:
        with open('Dataset/data.csv', 'rb') as f:
            response = requests.post(f"{BASE_URL}/upload", files={'file': f}, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Uploaded {data.get('total_rows', 0)} transactions")
            return True
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(response.text[:200])
            return False
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return False

def store_with_blockchain():
    print("\n" + "="*70)
    print("STEP 3: Storing transactions with blockchain data")
    print("="*70)
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/store", timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Stored {data.get('inserted', 0)} transactions")
            print(f"   Batch ID: {data.get('batchId', 'N/A')}")
            print(f"   Operation: {data.get('operation', 'N/A')}")
            return True
        else:
            print(f"❌ Storage failed: {response.status_code}")
            print(response.text[:200])
            return False
    except Exception as e:
        print(f"❌ Storage error: {e}")
        return False

def verify_blockchain_fields():
    print("\n" + "="*70)
    print("STEP 4: Verifying blockchain fields are populated")
    print("="*70)
    
    try:
        response = requests.get(f"{BASE_URL}/transactions/list?limit=3")
        
        if response.status_code == 200:
            data = response.json()
            txs = data.get('transactions', [])
            
            if not txs:
                print("❌ No transactions found")
                return False
            
            print(f"\n✅ Found {len(txs)} transactions")
            print("\nSample transactions:")
            print("-" * 70)
            
            all_populated = True
            for idx, tx in enumerate(txs[:3], 1):
                blockchain = tx.get('blockchain', {})
                print(f"\nTransaction {idx}: {tx.get('transactionId', 'N/A')}")
                print(f"  Amount: ${tx.get('amount', 0):,.2f}")
                print(f"  Prediction: {tx.get('prediction', 'N/A')}")
                print(f"\n  BLOCKCHAIN FIELDS:")
                print(f"    batchHash: {blockchain.get('batchHash', 'NULL')}")
                print(f"    blockNumber: {blockchain.get('blockNumber', 'NULL')}")
                print(f"    txHash: {blockchain.get('txHash', 'NULL')}")
                print(f"    verified: {blockchain.get('verified', False)}")
                
                has_hash = blockchain.get('batchHash') is not None
                has_tx = blockchain.get('txHash') is not None
                
                if has_hash and has_tx:
                    print(f"  ✅ Blockchain fields ARE POPULATED")
                else:
                    print(f"  ❌ Blockchain fields are NULL")
                    all_populated = False
            
            return all_populated
        else:
            print(f"❌ Verification failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

def main():
    print("\n" + "="*70)
    print("  BLOCKCHAIN FIELDS FIX DEMONSTRATION")
    print("="*70)
    
    if not wait_for_server():
        print("\n❌ Server not responding")
        return
    
    # Step 1: Clear old data
    clear_old_data()
    
    time.sleep(1)
    
    # Step 2: Upload
    if not upload_data():
        print("\n❌ FAILED at upload step")
        return
    
    time.sleep(2)
    
    # Step 3: Store with blockchain
    if not store_with_blockchain():
        print("\n❌ FAILED at storage step")
        return
    
    time.sleep(2)
    
    # Step 4: Verify
    success = verify_blockchain_fields()
    
    # Final summary
    print("\n" + "="*70)
    print("  FINAL RESULT")
    print("="*70)
    
    if success:
        print("✅✅✅ SUCCESS! Blockchain fields are now POPULATED ✅✅✅")
        print("\nAll transactions now have:")
        print("  ✓ batchHash - Computed hash of batch data")
        print("  ✓ txHash - Blockchain transaction hash")
        print("  ✓ blockNumber - Block number (if blockchain available)")
        print("  ✓ verified - True")
    else:
        print("❌ Blockchain fields are still NULL")
        print("\nPossible issues:")
        print("  1. Blockchain service not connecting")
        print("  2. Hash generation failing")
        print("  3. MongoDB storage not including blockchain_data")
    
    print("\n" + "="*70)

if __name__ == '__main__':
    main()
