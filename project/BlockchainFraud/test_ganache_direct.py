"""
Test direct Ganache connection and transaction
"""
from blockchain_service import BlockchainService
from datetime import datetime

def test_ganache_connection():
    print("\n" + "="*70)
    print("  TESTING GANACHE BLOCKCHAIN CONNECTION")
    print("="*70)
    
    bs = BlockchainService()
    
    # Check connection
    print(f"\n1. Connection Status:")
    print(f"   Web3 Connected: {bs.web3.isConnected() if bs.web3 else False}")
    print(f"   Contract Loaded: {bs.contract is not None}")
    
    if bs.web3 and bs.web3.isConnected():
        print(f"   Blockchain URL: {bs.blockchain_address}")
        print(f"   Default Account: {bs.web3.eth.default_account}")
        try:
            print(f"   Block Number: {bs.web3.eth.blockNumber}")
            print(f"   Chain ID: {bs.web3.eth.chainId}")
        except:
            print(f"   Block Number: {bs.web3.eth.getBlock('latest')['number']}")
            print(f"   Chain ID: {bs.web3.version.network}")
    
    # Test analytics storage
    print(f"\n2. Testing Blockchain Transaction:")
    print(f"   Creating test analytics data...")
    
    batch_data = {
        'totalRecords': 100,
        'fraudCount': 25,
        'safeCount': 75,
        'avgFraudScore': 0.85,
        'timestamp': datetime.now().isoformat()
    }
    
    # Compute hash
    analytics_hash = bs.compute_analytics_hash(batch_data)
    print(f"   Analytics Hash: {analytics_hash}")
    
    # Store on blockchain
    batch_id = f"TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    print(f"   Batch ID: {batch_id}")
    print(f"\n   📤 Sending transaction to Ganache...")
    
    blockchain_proof = bs.store_analytics_on_blockchain(analytics_hash, batch_id)
    
    if blockchain_proof:
        print(f"\n   ✅ SUCCESS! Transaction completed")
        print(f"\n   📦 Blockchain Proof:")
        print(f"      Transaction Hash: {blockchain_proof.get('transactionHash', 'N/A')}")
        print(f"      Block Number: {blockchain_proof.get('blockNumber', 'N/A')}")
        print(f"      Gas Used: {blockchain_proof.get('gasUsed', 'N/A')}")
        print(f"      Status: {blockchain_proof.get('status', 'N/A')}")
        print(f"      Contract: {blockchain_proof.get('contractAddress', 'N/A')}")
        
        print(f"\n   🎉 These are REAL Ganache transaction values!")
        return True
    else:
        print(f"\n   ❌ FAILED! No blockchain proof returned")
        print(f"\n   Troubleshooting:")
        print(f"      - Check if Ganache is running")
        print(f"      - Check if smart contract is deployed")
        print(f"      - Check Flask logs for errors")
        return False

if __name__ == '__main__':
    success = test_ganache_connection()
    
    print("\n" + "="*70)
    if success:
        print("✅ GANACHE CONNECTION WORKING - REAL TRANSACTION IDS AVAILABLE")
    else:
        print("❌ GANACHE CONNECTION ISSUE - CHECK CONFIGURATION")
    print("="*70)
