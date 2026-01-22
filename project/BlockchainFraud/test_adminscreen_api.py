"""
Test script for AdminScreen page API endpoints
Verifies that all dashboard components will receive proper data
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_dashboard_metrics():
    """Test /dashboard/metrics endpoint for AdminScreen"""
    print("\n" + "="*80)
    print("Testing /dashboard/metrics endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/metrics", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Dashboard Metrics endpoint working!")
            print(f"\nTotal Transactions: {data['metrics']['totalTransactions']['value']}")
            print(f"Total Users: {data['metrics']['totalUsers']['value']}")
            print(f"Fraudulent Transactions: {data['metrics']['fraudulentTransactions']['value']}")
            print(f"Model Accuracy: {data['metrics']['modelAccuracy']['value']}")
            print(f"\nBlockchain Status: {data['blockchainStatus']['status']}")
            print(f"Total Blocks: {data['blockchainStatus']['totalBlocks']}")
            print(f"Recent Blocks Count: {len(data.get('recentBlocks', []))}")
            
            # Show sample block data
            if data.get('recentBlocks'):
                block = data['recentBlocks'][0]
                print(f"\nSample Block:")
                print(f"  Block Number: {block['blockNumber']}")
                print(f"  Transactions: {block['transactionCount']}")
                print(f"  Fraud Count: {block['fraudCount']}")
                print(f"  Timestamp: {block['timestamp']}")
                
            return True
        else:
            print(f"❌ Failed: Status {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_analytics_charts():
    """Test /analytics/charts endpoint for QuickStats"""
    print("\n" + "="*80)
    print("Testing /analytics/charts endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/analytics/charts", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analytics Charts endpoint working!")
            print(f"\nFraud vs Normal: {data['fraudVsNormal']['data']}")
            print(f"Labels: {data['fraudVsNormal']['labels']}")
            
            if data.get('transactionTypes'):
                print(f"\nTransaction Types:")
                for i, label in enumerate(data['transactionTypes']['labels']):
                    normal = data['transactionTypes']['normal'][i]
                    fraud = data['transactionTypes']['fraud'][i]
                    print(f"  {label}: {normal} normal, {fraud} fraud")
            
            if data.get('fraudTrend'):
                print(f"\nFraud Trend Data Points: {len(data['fraudTrend']['labels'])}")
                
            return True
        else:
            print(f"❌ Failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_analytics_flagged():
    """Test /analytics/flagged endpoint for RecentActivity"""
    print("\n" + "="*80)
    print("Testing /analytics/flagged endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/analytics/flagged", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            flagged = data.get('flagged', data.get('flaggedTransactions', []))
            print(f"✅ Flagged Transactions endpoint working!")
            print(f"\nTotal Flagged Transactions: {len(flagged)}")
            
            if flagged:
                tx = flagged[0]
                print(f"\nSample Flagged Transaction:")
                print(f"  Transaction ID: {tx.get('transactionId', 'N/A')}")
                print(f"  Amount: ${tx.get('amount', 0):.2f}")
                print(f"  From: {tx.get('sender', 'N/A')}")
                print(f"  To: {tx.get('receiver', 'N/A')}")
                print(f"  Blockchain Hash: {tx.get('blockchain', {}).get('txHash', 'N/A')[:20]}...")
                
            return True
        else:
            print(f"❌ Failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("AdminScreen Page API Test Suite")
    print("Testing all endpoints required for /adminscreen dashboard")
    print("="*80)
    
    results = {
        'dashboard_metrics': test_dashboard_metrics(),
        'analytics_charts': test_analytics_charts(),
        'analytics_flagged': test_analytics_flagged()
    }
    
    print("\n" + "="*80)
    print("Test Summary")
    print("="*80)
    
    all_passed = all(results.values())
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print("\n" + "="*80)
    if all_passed:
        print("🎉 All API endpoints are working correctly!")
        print("✅ AdminScreen page should display real data properly")
    else:
        print("⚠️ Some endpoints failed - check the errors above")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
