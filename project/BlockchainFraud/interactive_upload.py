"""
Interactive Fraud Detection Tool
Upload any file and get instant fraud analysis
"""
import requests
import os
from mongodb_service import MongoDBService

BASE_URL = "http://localhost:5000"

def main():
    print("\n" + "="*70)
    print("  🔍 FRAUD DETECTION SYSTEM")
    print("="*70)
    print("\nThis tool will:")
    print("  1. Upload your transaction file")
    print("  2. Analyze it for fraud")
    print("  3. Store results in MongoDB")
    print("\nSupported formats: CSV, TXT, PDF, Excel, JSON")
    print("="*70)
    
    # Ask for file path
    print("\n📁 Enter the path to your transaction file:")
    print("   (or drag and drop the file here)")
    file_path = input("\nFile path: ").strip().strip('"').strip("'")
    
    if not file_path:
        print("\n❌ No file specified")
        return
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"\n❌ Error: File not found")
        print(f"   Path: {file_path}")
        return
    
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path) / 1024  # KB
    
    print(f"\n✅ File found:")
    print(f"   Name: {file_name}")
    print(f"   Size: {file_size:.2f} KB")
    
    # Confirm
    confirm = input("\n📤 Upload and analyze this file? (y/n): ").strip().lower()
    if confirm != 'y':
        print("\n❌ Cancelled")
        return
    
    # Upload
    print(f"\n{'='*70}")
    print("⏳ Uploading and analyzing...")
    print('='*70)
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (file_name, f)}
            response = requests.post(f"{BASE_URL}/upload", files=files)
        
        if response.status_code == 200:
            data = response.json()
            total = data.get('total_rows', 0)
            fraud = data.get('fraud_detected', 0)
            normal = total - fraud
            
            print(f"\n✅ ANALYSIS COMPLETE!")
            print(f"\n📊 Results:")
            print(f"   Total Transactions: {total:,}")
            print(f"   🚨 Fraud Detected: {fraud:,} ({(fraud/total*100) if total > 0 else 0:.1f}%)")
            print(f"   ✅ Normal: {normal:,} ({(normal/total*100) if total > 0 else 0:.1f}%)")
        else:
            print(f"\n❌ Upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return
    
    # Store
    print(f"\n{'='*70}")
    print("💾 Storing results in MongoDB...")
    print('='*70)
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/store")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ STORED SUCCESSFULLY!")
            print(f"   Database: fraud_detection_db")
            print(f"   Documents: {data.get('inserted', 0):,}")
            print(f"   Batch ID: {data.get('batchId', 'N/A')}")
        else:
            print(f"\n⚠️  Storage failed: {response.status_code}")
            
    except Exception as e:
        print(f"\n⚠️  Storage error: {e}")
    
    # Show samples
    print(f"\n{'='*70}")
    print("📋 Sample Fraud Cases:")
    print('='*70)
    
    try:
        m = MongoDBService()
        # Get fraud transactions only
        all_txs = m.get_transactions(limit=100)
        fraud_txs = [tx for tx in all_txs if tx.get('prediction') == 'FRAUD'][:5]
        
        if fraud_txs:
            for idx, tx in enumerate(fraud_txs, 1):
                print(f"\n{idx}. {tx.get('transactionId')}")
                print(f"   💰 Amount: ${tx.get('amount', 0):,.2f}")
                print(f"   📝 Type: {tx.get('transactionType')}")
                print(f"   👤 Sender: {tx.get('sender')}")
                print(f"   🎯 Receiver: {tx.get('receiver')}")
        else:
            print("\n✅ No fraud detected in recent transactions!")
            
    except Exception as e:
        pass
    
    print(f"\n{'='*70}")
    print("✅ DONE! Your file has been processed.")
    print("="*70)
    print("\nYou can view all results at: http://localhost:5173")
    print("="*70)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Cancelled by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
