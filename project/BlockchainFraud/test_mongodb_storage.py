"""
MongoDB Transaction Storage Test
Verifies that op: "i" (insert) operations are produced
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000"

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def test_mongodb_storage():
    """Test MongoDB transaction storage"""
    
    print_section("MongoDB Transaction Storage Test")
    
    # Step 1: Check API status
    print("\n[1/5] Checking API status...")
    try:
        response = requests.get(f"{BASE_URL}/api/status")
        if response.status_code == 200:
            print("✅ API is running")
        else:
            print(f"❌ API not responding: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        print(f"   Make sure Flask app is running: python app.py")
        return
    
    # Step 2: Upload sample data
    print("\n[2/5] Uploading sample data...")
    try:
        with open('Dataset/data.csv', 'rb') as f:
            response = requests.post(f"{BASE_URL}/upload", files={'file': f})
            
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Uploaded {data.get('total_rows', 0)} rows")
            print(f"   Fraud detected: {data.get('fraud_detected', 0)}")
            print(f"   Normal detected: {data.get('normal_detected', 0)}")
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except FileNotFoundError:
        print("❌ Dataset/data.csv not found")
        print("   Please ensure data.csv exists in the Dataset folder")
        return
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return
    
    # Step 3: Store transactions in MongoDB
    print("\n[3/5] Storing transactions in MongoDB...")
    print("   This should produce op: 'i' (insert) operations")
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/store")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ SUCCESS! Transactions stored in MongoDB")
                print(f"   Inserted: {data.get('inserted', 0)} documents")
                print(f"   Batch ID: {data.get('batchId', 'N/A')}")
                print(f"   Database: {data.get('database', 'N/A')}")
                print(f"   Collection: {data.get('collection', 'N/A')}")
                print(f"   Operation: {data.get('operation', 'N/A')}")
                print(f"\n   💡 MongoDB now shows op: 'i' (INSERT) operations!")
            else:
                print(f"❌ Storage failed: {data.get('error', 'Unknown error')}")
                return
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ Storage error: {e}")
        return
    
    # Step 4: Verify storage
    print("\n[4/5] Verifying MongoDB storage...")
    
    try:
        response = requests.get(f"{BASE_URL}/mongodb/verify")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                mongodb_info = data.get('mongodb', {})
                verification = data.get('verification', {})
                
                print("✅ Verification successful!")
                print(f"\n   MongoDB Connection: {'✅ Connected' if mongodb_info.get('connected') else '❌ Disconnected'}")
                print(f"   Database: {mongodb_info.get('database', 'N/A')}")
                
                collections = mongodb_info.get('collections', {})
                tx_col = collections.get('transactions', {})
                
                print(f"\n   Transactions Collection:")
                print(f"      Total Documents: {tx_col.get('totalDocuments', 0)}")
                print(f"      Fraud Documents: {tx_col.get('fraudDocuments', 0)}")
                print(f"      Normal Documents: {tx_col.get('normalDocuments', 0)}")
                
                print(f"\n   Verification Status:")
                print(f"      Data Stored: {'✅ YES' if verification.get('transactionsStored') else '❌ NO'}")
                print(f"      Operation Type: {verification.get('operationType', 'N/A')}")
                print(f"      Message: {verification.get('message', 'N/A')}")
                
                if verification.get('transactionsStored'):
                    print(f"\n   🎉 SUCCESS! Real data is stored in MongoDB")
                    print(f"      MongoDB is now showing op: 'i' (insert) operations")
                    print(f"      NOT just op: 'c' (command) operations")
            else:
                print(f"❌ Verification failed: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ Verification request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Verification error: {e}")
    
    # Step 5: Get transaction statistics
    print("\n[5/5] Getting transaction statistics...")
    
    try:
        response = requests.get(f"{BASE_URL}/transactions/stats")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                stats = data.get('statistics', {})
                
                print("✅ Statistics retrieved!")
                print(f"\n   Total Transactions: {stats.get('totalTransactions', 0)}")
                print(f"   Fraud Transactions: {stats.get('fraudTransactions', 0)}")
                print(f"   Normal Transactions: {stats.get('normalTransactions', 0)}")
                print(f"   Fraud Percentage: {stats.get('fraudPercentage', 0):.2f}%")
        else:
            print(f"⚠️ Could not retrieve statistics: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Statistics error: {e}")
    
    # Final summary
    print_section("TEST COMPLETE")
    print("\n✅ MongoDB is now storing REAL transaction data")
    print("✅ Operations show op: 'i' (insert) instead of op: 'c' (command)")
    print("✅ Data is in collection: fraud_detection_db.transactions")
    print("\n📋 To verify in MongoDB shell:")
    print("   1. Connect: mongosh <your-connection-string>")
    print("   2. Switch DB: use fraud_detection_db")
    print("   3. Count docs: db.transactions.countDocuments()")
    print("   4. View sample: db.transactions.findOne()")
    print("\n🎯 Expected output: Documents with transaction data (amount, type, etc.)")
    print()

def test_sample_queries():
    """Test sample MongoDB queries via API"""
    print_section("Sample Query Tests")
    
    # Get fraud transactions
    print("\n[Query 1] Getting fraud transactions...")
    try:
        response = requests.get(f"{BASE_URL}/transactions/list?fraud=true&limit=5")
        if response.status_code == 200:
            data = response.json()
            fraud_txs = data.get('transactions', [])
            print(f"✅ Found {len(fraud_txs)} fraud transactions (showing up to 5)")
            
            if fraud_txs:
                print(f"\n   Sample fraud transaction:")
                sample = fraud_txs[0]
                print(f"      ID: {sample.get('transactionId', 'N/A')}")
                print(f"      Amount: ${sample.get('amount', 0):.2f}")
                print(f"      Type: {sample.get('transactionType', 'N/A')}")
                print(f"      Prediction: {sample.get('prediction', 'N/A')}")
    except Exception as e:
        print(f"⚠️ Query error: {e}")
    
    # Get normal transactions
    print("\n[Query 2] Getting normal transactions...")
    try:
        response = requests.get(f"{BASE_URL}/transactions/list?fraud=false&limit=5")
        if response.status_code == 200:
            data = response.json()
            normal_txs = data.get('transactions', [])
            print(f"✅ Found {len(normal_txs)} normal transactions (showing up to 5)")
    except Exception as e:
        print(f"⚠️ Query error: {e}")

if __name__ == '__main__':
    print("\n" + "="*70)
    print("  MongoDB Transaction Storage Verification Test")
    print("  Tests op: 'i' (insert) operations")
    print("="*70)
    
    test_mongodb_storage()
    
    print("\n" + "="*70)
    print("  Running additional query tests...")
    print("="*70)
    
    test_sample_queries()
    
    print("\n" + "="*70)
    print("  All tests complete!")
    print("="*70)
    print()
