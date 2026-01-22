"""
Test: Blockchain Fields Populated & File-Agnostic Processing
"""
import requests
import pandas as pd
import json

BASE_URL = "http://localhost:5000"

def test_blockchain_fields():
    """Test that blockchain fields are populated with actual values"""
    print("\n" + "="*70)
    print("  TEST 1: Blockchain Fields Population")
    print("="*70)
    
    # Upload data
    print("\n[1/3] Uploading data...")
    with open('Dataset/data.csv', 'rb') as f:
        response = requests.post(f"{BASE_URL}/upload", files={'file': f})
    
    if response.status_code == 200:
        print("✅ Data uploaded")
    else:
        print(f"❌ Upload failed: {response.status_code}")
        return
    
    # Store with blockchain
    print("\n[2/3] Storing transactions with blockchain data...")
    response = requests.post(f"{BASE_URL}/transactions/store")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Stored {data.get('inserted')} transactions")
    else:
        print(f"❌ Storage failed: {response.status_code}")
        return
    
    # Verify blockchain fields
    print("\n[3/3] Verifying blockchain fields...")
    response = requests.get(f"{BASE_URL}/transactions/list?limit=1")
    
    if response.status_code == 200:
        data = response.json()
        if data.get('transactions'):
            tx = data['transactions'][0]
            blockchain = tx.get('blockchain', {})
            
            print("\n📊 Sample Transaction Blockchain Fields:")
            print(f"   batchHash: {blockchain.get('batchHash', 'NULL')}")
            print(f"   blockNumber: {blockchain.get('blockNumber', 'NULL')}")
            print(f"   txHash: {blockchain.get('txHash', 'NULL')}")
            print(f"   verified: {blockchain.get('verified', False)}")
            
            # Check if fields are populated
            if blockchain.get('batchHash') and blockchain.get('txHash'):
                print("\n✅ SUCCESS! Blockchain fields are POPULATED")
                print(f"   ✓ Hash exists: {blockchain['batchHash'][:20]}...")
                print(f"   ✓ TX Hash exists: {blockchain['txHash'][:20]}...")
                if blockchain.get('blockNumber') is not None:
                    print(f"   ✓ Block number: {blockchain['blockNumber']}")
                return True
            else:
                print("\n❌ Blockchain fields are still NULL")
                return False
    
    return False

def test_file_agnostic():
    """Test that system accepts files with any name and any columns"""
    print("\n" + "="*70)
    print("  TEST 2: File-Agnostic Processing")
    print("="*70)
    
    # Test 1: Different filename
    print("\n[Test 1] Uploading file with different name...")
    
    # Create test file with minimal columns
    test_data = pd.DataFrame({
        'transaction_amount': [100, 5000, 200],
        'transaction_type': ['PAYMENT', 'CASH_OUT', 'TRANSFER'],
        'customer_id': ['C001', 'C002', 'C003']
    })
    
    test_file = 'test_custom_file.csv'
    test_data.to_csv(test_file, index=False)
    
    with open(test_file, 'rb') as f:
        response = requests.post(f"{BASE_URL}/upload", files={'file': f})
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Accepted file: {test_file}")
        print(f"   Rows: {data.get('total_rows', 0)}")
        print(f"   System processed ANY filename: test_custom_file.csv")
    else:
        print(f"❌ File rejected: {response.status_code}")
        print(f"   Response: {response.text}")
    
    # Test 2: Different column names
    print("\n[Test 2] File with completely different column names...")
    
    test_data2 = pd.DataFrame({
        'value': [1000, 50000, 3000],
        'category': ['A', 'B', 'C'],
        'user': ['U1', 'U2', 'U3'],
        'merchant': ['M1', 'M2', 'M3']
    })
    
    test_file2 = 'my_custom_data_file.csv'
    test_data2.to_csv(test_file2, index=False)
    
    with open(test_file2, 'rb') as f:
        response = requests.post(f"{BASE_URL}/upload", files={'file': f})
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Accepted file: {test_file2}")
        print(f"   Columns: value, category, user, merchant")
        print(f"   System processed ANY column names!")
        print(f"   Rows processed: {data.get('total_rows', 0)}")
        
        # Try to store
        response2 = requests.post(f"{BASE_URL}/transactions/store")
        if response2.status_code == 200:
            print(f"✅ Stored transactions from custom file")
        
        return True
    else:
        print(f"❌ File rejected: {response.status_code}")
        return False
    
    # Cleanup
    import os
    try:
        os.remove(test_file)
        os.remove(test_file2)
    except:
        pass

def main():
    print("\n" + "="*70)
    print("  BLOCKCHAIN & FILE-AGNOSTIC TEST")
    print("="*70)
    
    # Wait for server
    import time
    print("\nWaiting for Flask server...")
    time.sleep(2)
    
    # Test 1: Blockchain fields
    blockchain_ok = test_blockchain_fields()
    
    # Test 2: File agnostic
    file_agnostic_ok = test_file_agnostic()
    
    # Summary
    print("\n" + "="*70)
    print("  TEST SUMMARY")
    print("="*70)
    print(f"Blockchain Fields Populated: {'✅ PASS' if blockchain_ok else '❌ FAIL'}")
    print(f"File-Agnostic Processing: {'✅ PASS' if file_agnostic_ok else '❌ FAIL'}")
    print("\n" + "="*70)

if __name__ == '__main__':
    main()
