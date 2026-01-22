"""
Test QuickStats Component Data Loading
Verifies that the fraudTrend data structure is correct
"""
import requests
import json

def test_fraud_trend_structure():
    print("\n" + "="*80)
    print("Testing fraudTrend Data Structure for QuickStats Component")
    print("="*80)
    
    try:
        response = requests.get('http://localhost:5000/analytics/charts', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analytics Charts endpoint responding")
            
            # Check if success flag exists
            if 'success' in data:
                print(f"✅ Success flag present: {data['success']}")
            
            # Check fraudTrend structure
            if 'fraudTrend' in data:
                fraud_trend = data['fraudTrend']
                print(f"\n📊 Fraud Trend Data Structure:")
                print(f"   Labels: {fraud_trend.get('labels', [])}")
                print(f"   Fraud Rates: {fraud_trend.get('fraudRate', [])}")
                print(f"   Total Transactions: {fraud_trend.get('totalTransactions', [])}")
                
                # Verify all arrays have same length
                labels = fraud_trend.get('labels', [])
                rates = fraud_trend.get('fraudRate', [])
                totals = fraud_trend.get('totalTransactions', [])
                
                if len(labels) == len(rates) == len(totals):
                    print(f"\n✅ All arrays have matching length: {len(labels)} data points")
                    
                    # Calculate what QuickStats will display
                    print(f"\n📈 What QuickStats will show:")
                    for i in range(min(len(labels), 5)):  # Show first 5
                        fraud_count = round((totals[i] * rates[i]) / 100)
                        legitimate = totals[i] - fraud_count
                        print(f"   {labels[i]}: {legitimate} legitimate, {fraud_count} fraud (Total: {totals[i]})")
                    
                    if len(labels) > 5:
                        print(f"   ... and {len(labels) - 5} more data points")
                    
                    return True
                else:
                    print(f"❌ Array length mismatch: labels={len(labels)}, rates={len(rates)}, totals={len(totals)}")
                    return False
            else:
                print("❌ fraudTrend missing from response")
                return False
        else:
            print(f"❌ Failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_report_data_availability():
    print("\n" + "="*80)
    print("Testing Report Generation Data Availability")
    print("="*80)
    
    try:
        # Test all endpoints needed for report
        endpoints = {
            'Dashboard Metrics': 'http://localhost:5000/dashboard/metrics',
            'Analytics Charts': 'http://localhost:5000/analytics/charts',
            'Flagged Transactions': 'http://localhost:5000/analytics/flagged'
        }
        
        all_available = True
        for name, url in endpoints.items():
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ {name}: Available")
                    
                    # Count data items
                    if name == 'Flagged Transactions':
                        flagged = data.get('flagged', data.get('flaggedTransactions', []))
                        print(f"   → {len(flagged)} flagged transactions available")
                else:
                    print(f"❌ {name}: Status {response.status_code}")
                    all_available = False
            except Exception as e:
                print(f"❌ {name}: {e}")
                all_available = False
        
        if all_available:
            print("\n✅ All data sources available for report generation")
        else:
            print("\n❌ Some data sources unavailable")
        
        return all_available
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("QuickStats & Quick Actions Test Suite")
    print("="*80)
    
    results = {
        'fraud_trend': test_fraud_trend_structure(),
        'report_data': test_report_data_availability()
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
        print("✅ QuickStats should display transaction trends correctly")
        print("✅ Generate Report button should work properly")
    else:
        print("⚠️ Some tests failed - check the errors above")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
