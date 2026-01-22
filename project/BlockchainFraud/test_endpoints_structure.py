import requests
import json

BASE_URL = "http://localhost:5000"

print("=" * 80)
print("TESTING ADMIN SCREEN ENDPOINTS")
print("=" * 80)

# Test 1: Dashboard Metrics
print("\n1. Testing /dashboard/metrics")
print("-" * 80)
try:
    response = requests.get(f"{BASE_URL}/dashboard/metrics")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Status: {response.status_code}")
        print(f"Response structure:")
        print(f"  - Has 'metrics': {('metrics' in data)}")
        print(f"  - Has 'blockchainStatus': {('blockchainStatus' in data)}")
        print(f"  - Has 'recentBlocks': {('recentBlocks' in data)}")
        
        if 'metrics' in data:
            print(f"\nMetrics structure:")
            for key in data['metrics']:
                print(f"  - {key}: {data['metrics'][key]}")
        
        if 'recentBlocks' in data:
            print(f"\nRecent Blocks: {len(data['recentBlocks'])} blocks")
            if data['recentBlocks']:
                block = data['recentBlocks'][0]
                print(f"  First block structure:")
                print(f"    - blockNumber: {block.get('blockNumber')}")
                print(f"    - transactionCount: {block.get('transactionCount')}")
                print(f"    - Has transactions array: {('transactions' in block)}")
                if 'transactions' in block:
                    print(f"    - Transactions in block: {len(block['transactions'])}")
    else:
        print(f"❌ Status: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 2: Analytics Charts
print("\n\n2. Testing /analytics/charts")
print("-" * 80)
try:
    response = requests.get(f"{BASE_URL}/analytics/charts")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Status: {response.status_code}")
        print(f"Response structure:")
        print(f"  - Has 'fraudVsNormal': {('fraudVsNormal' in data)}")
        print(f"  - Has 'transactionTypes': {('transactionTypes' in data)}")
        print(f"  - Has 'fraudTrend': {('fraudTrend' in data)}")
        
        if 'fraudVsNormal' in data:
            print(f"\nFraud vs Normal:")
            print(f"  Labels: {data['fraudVsNormal'].get('labels')}")
            print(f"  Data: {data['fraudVsNormal'].get('data')}")
        
        if 'transactionTypes' in data:
            print(f"\nTransaction Types:")
            print(f"  Labels: {data['transactionTypes'].get('labels')}")
            print(f"  Normal: {data['transactionTypes'].get('normal')}")
            print(f"  Fraud: {data['transactionTypes'].get('fraud')}")
    else:
        print(f"❌ Status: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 3: Flagged Transactions
print("\n\n3. Testing /analytics/flagged")
print("-" * 80)
try:
    response = requests.get(f"{BASE_URL}/analytics/flagged")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Status: {response.status_code}")
        print(f"Flagged transactions: {len(data.get('flagged', []))}")
        if data.get('flagged'):
            print(f"\nFirst flagged transaction:")
            first = data['flagged'][0]
            print(f"  Transaction ID: {first.get('transactionId')}")
            print(f"  Amount: ${first.get('amount')}")
            print(f"  Type: {first.get('transactionType')}")
            print(f"  Blockchain Hash: {first.get('blockchain', {}).get('txHash')}")
    else:
        print(f"❌ Status: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

print("\n" + "=" * 80)
print("ENDPOINT TESTING COMPLETE")
print("=" * 80)
