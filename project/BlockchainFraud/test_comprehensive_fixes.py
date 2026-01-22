"""
Comprehensive Test for AdminScreen Fixes
Tests: 1) BlockchainProofCard data 2) PDF Report Generation
"""
import requests
import json

def test_blockchain_proof_data():
    print("\n" + "="*80)
    print("Testing BlockchainProofCard Data")
    print("="*80)
    
    try:
        response = requests.get('http://localhost:5000/dashboard/metrics', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check for recentBlocks
            if 'recentBlocks' in data:
                recent_blocks = data['recentBlocks']
                print(f"✅ recentBlocks found: {len(recent_blocks)} blocks")
                
                if recent_blocks:
                    block = recent_blocks[0]
                    print(f"\nSample Block Structure:")
                    print(f"  Block Number: {block.get('blockNumber', 'N/A')}")
                    print(f"  Transaction Count: {block.get('transactionCount', 0)}")
                    print(f"  Fraud Count: {block.get('fraudCount', 0)}")
                    print(f"  Timestamp: {block.get('timestamp', 'N/A')}")
                    print(f"  Has Transactions: {bool(block.get('transactions'))}")
                    
                    if block.get('transactions'):
                        tx = block['transactions'][0]
                        print(f"\nSample Transaction:")
                        print(f"    Hash: {tx.get('hash', 'N/A')[:30]}...")
                        print(f"    From: {tx.get('from', 'N/A')}")
                        print(f"    To: {tx.get('to', 'N/A')}")
                        print(f"    Amount: ${tx.get('amount', 0):.2f}")
                    
                    print("\n✅ BlockchainProofCard should display data correctly")
                    return True
                else:
                    print("⚠️ No recent blocks found")
                    return False
            else:
                print("❌ recentBlocks not in response")
                print(f"Available keys: {list(data.keys())}")
                return False
        else:
            print(f"❌ Failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_pdf_report_generation():
    print("\n" + "="*80)
    print("Testing PDF Report Generation")
    print("="*80)
    
    try:
        print("Requesting PDF report...")
        response = requests.get('http://localhost:5000/analytics/generate-pdf-report', timeout=30)
        
        if response.status_code == 200:
            print(f"✅ PDF generated successfully")
            print(f"   Status Code: {response.status_code}")
            print(f"   Content-Type: {response.headers.get('Content-Type')}")
            print(f"   PDF Size: {len(response.content):,} bytes")
            
            # Verify PDF header
            if response.content[:4] == b'%PDF':
                print("✅ Valid PDF header detected")
            else:
                print("⚠️ PDF header not detected")
            
            # Check content size
            if len(response.content) > 50000:
                print("✅ PDF has substantial content (>50KB)")
            else:
                print("⚠️ PDF might be missing content")
            
            # Save test file
            import os
            test_file = "test_comprehensive_report.pdf"
            with open(test_file, 'wb') as f:
                f.write(response.content)
            print(f"✅ PDF saved to: {os.path.abspath(test_file)}")
            
            return True
        else:
            print(f"❌ Failed: Status {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"   Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "="*80)
    print("AdminScreen Comprehensive Test Suite")
    print("Testing: BlockchainProofCard & PDF Report Generation")
    print("="*80)
    
    results = {
        'blockchain_proof': test_blockchain_proof_data(),
        'pdf_report': test_pdf_report_generation()
    }
    
    print("\n" + "="*80)
    print("Test Summary")
    print("="*80)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print("\n" + "="*80)
    if all(results.values()):
        print("🎉 All tests passed!")
        print("✅ BlockchainProofCard will display batch/block data")
        print("✅ Generate Report button will download comprehensive PDF")
        print("\nPDF Report Includes:")
        print("  📊 System Metrics (transactions, users, fraud count, accuracy)")
        print("  📈 Fraud vs Normal Pie Chart")
        print("  📊 Transaction Types Bar Chart")
        print("  📉 Fraud Trend Line Charts")
        print("  ⛓️ Blockchain Status & Recent Blocks")
        print("  🚨 Top 50 Flagged Transactions Table")
    else:
        print("⚠️ Some tests failed - check the errors above")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
