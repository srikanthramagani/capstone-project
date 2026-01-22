"""
Upload ANY file for fraud detection and MongoDB storage

Usage:
    python upload_and_analyze.py <your_file.csv>
    python upload_and_analyze.py C:\path\to\your\data.csv
    python upload_and_analyze.py my_transactions.xlsx
"""
import requests
import sys
import os
from mongodb_service import MongoDBService

BASE_URL = "http://localhost:5000"

def upload_and_analyze(file_path):
    """Upload user's file, analyze, and store in MongoDB"""
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        print(f"\nUsage: python upload_and_analyze.py <your_file.csv>")
        return False
    
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path) / 1024  # KB
    
    print("="*70)
    print("  FRAUD DETECTION - USER FILE UPLOAD")
    print("="*70)
    print(f"\n📁 File: {file_name}")
    print(f"📏 Size: {file_size:.2f} KB")
    print(f"📂 Path: {file_path}")
    
    # Step 1: Upload user's file
    print(f"\n{'='*70}")
    print("STEP 1: Uploading Your File")
    print('='*70)
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (file_name, f)}
            response = requests.post(f"{BASE_URL}/upload", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ File uploaded and analyzed!")
            print(f"   Total rows: {data.get('total_rows', 0)}")
            print(f"   Fraud detected: {data.get('fraud_detected', 0)}")
            print(f"   Normal: {data.get('total_rows', 0) - data.get('fraud_detected', 0)}")
            
            total = data.get('total_rows', 0)
            fraud = data.get('fraud_detected', 0)
            if total > 0:
                fraud_rate = (fraud / total) * 100
                print(f"   Fraud rate: {fraud_rate:.2f}%")
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error uploading file: {e}")
        return False
    
    # Step 2: Store in MongoDB
    print(f"\n{'='*70}")
    print("STEP 2: Storing Results in MongoDB")
    print('='*70)
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/store")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Stored in MongoDB!")
            print(f"   Database: fraud_detection_db")
            print(f"   Collection: transactions")
            print(f"   Inserted: {data.get('inserted', 0)} documents")
            print(f"   Batch ID: {data.get('batchId', 'N/A')}")
        else:
            print(f"⚠️  Analysis done but storage failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error storing results: {e}")
        return False
    
    # Step 3: Show sample results
    print(f"\n{'='*70}")
    print("STEP 3: Sample Results from MongoDB")
    print('='*70)
    
    try:
        m = MongoDBService()
        txs = m.get_transactions(limit=3)
        
        if txs:
            print(f"\n📊 Latest {len(txs)} transactions:\n")
            
            for idx, tx in enumerate(txs, 1):
                prediction = tx.get('prediction')
                icon = '🚨 FRAUD' if prediction == 'FRAUD' else '✅ NORMAL'
                
                print(f"{idx}. {tx.get('transactionId')}")
                print(f"   Amount: ${tx.get('amount', 0):,.2f}")
                print(f"   Type: {tx.get('transactionType')}")
                print(f"   Result: {icon}")
                print()
        else:
            print("⚠️  No transactions found")
            
    except Exception as e:
        print(f"⚠️  Could not retrieve results: {e}")
    
    print("="*70)
    print("✅ COMPLETE! Your file has been analyzed and stored.")
    print("="*70)
    return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("\n" + "="*70)
        print("  FRAUD DETECTION - Upload & Analyze Any File")
        print("="*70)
        print("\nUsage:")
        print("  python upload_and_analyze.py <file_path>")
        print("\nExamples:")
        print("  python upload_and_analyze.py my_data.csv")
        print("  python upload_and_analyze.py C:\\Users\\data\\transactions.csv")
        print("  python upload_and_analyze.py ../Downloads/new_data.xlsx")
        print("\nSupported formats: CSV, TXT, PDF, Excel (.xls, .xlsx), JSON")
        print("="*70)
        sys.exit(1)
    
    file_path = sys.argv[1]
    upload_and_analyze(file_path)
