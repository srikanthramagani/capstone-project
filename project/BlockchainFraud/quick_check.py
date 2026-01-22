from mongodb_service import MongoDBService

m = MongoDBService()
txs = m.get_transactions(limit=1)

if txs:
    tx = txs[0]
    bc = tx.get('blockchain', {})
    print('\nBlockchain Fields in MongoDB:')
    print('='*50)
    print(f"  batchHash: {bc.get('batchHash', 'NULL')}")
    print(f"  blockNumber: {bc.get('blockNumber', 'NULL')}")
    print(f"  txHash: {bc.get('txHash', 'NULL')}")
    print(f"  verified: {bc.get('verified', False)}")
    print('='*50)
    
    if bc.get('batchHash') and bc.get('txHash'):
        print('\n✅ SUCCESS! Blockchain fields are POPULATED')
    else:
        print('\n❌ Blockchain fields are NULL')
else:
    print('No transactions in database')
