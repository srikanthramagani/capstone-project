# Blockchain Proof System - Visual Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  DashboardOverview.jsx                                      │    │
│  │  ├── BlockchainProofCard.jsx                               │    │
│  │  │   └── Displays blockchain proof visually               │    │
│  │  └── Button: "Store on Blockchain"                        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP POST
                                   │ /analytics/store-blockchain
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Flask - app.py)                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  1. Compute Analytics Metrics                              │    │
│  │     - Total Records: 5000                                  │    │
│  │     - Fraud Count: 127                                     │    │
│  │     - Safe Count: 4873                                     │    │
│  │                                                             │    │
│  │  2. Generate Analytics Hash (SHA256)                       │    │
│  │     hash = sha256("5000_127_4873_0.0254")                 │    │
│  │     → "1a2b3c4d5e6f..."                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
│                                   ↓                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  blockchain_service.store_analytics_on_blockchain()        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Web3.py Transaction
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN (Ganache / Ethereum)                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Smart Contract: MLContract.sol                            │    │
│  │  Function: saveBestModel()                                 │    │
│  │                                                             │    │
│  │  Store:                                                     │    │
│  │    - model_name: "Analytics_BATCH-..."                    │    │
│  │    - model_weight: "1a2b3c4d5e6f..." (analytics hash)     │    │
│  │    - model_intercept: "BATCH-20260118-143522"             │    │
│  │    - model_classes: "2026-01-18T14:35:22.000Z"            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
│                                   ↓                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Transaction Mined ✅                                      │    │
│  │  Block #42                                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
│                                   ↓                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Transaction Receipt Generated                             │    │
│  │  {                                                         │    │
│  │    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d...",          │    │
│  │    blockNumber: 42,                                        │    │
│  │    gasUsed: 150000,                                        │    │
│  │    status: 1 (SUCCESS)                                     │    │
│  │  }                                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Receipt Returned
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (blockchain_service.py)                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Extract Blockchain Proof from Receipt:                   │    │
│  │  {                                                         │    │
│  │    transactionHash: "0x1a2b3c...",                        │    │
│  │    blockNumber: 42,                                        │    │
│  │    network: "Ganache Local",                              │    │
│  │    gasUsed: 150000                                         │    │
│  │  }                                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Pass to MongoDB Service
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     MONGODB (mongodb_service.py)                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Store Analytics + Blockchain Proof                        │    │
│  │  {                                                         │    │
│  │    batchId: "BATCH-20260118-143522",                      │    │
│  │    totalRecords: 5000,                                     │    │
│  │    fraudCount: 127,                                        │    │
│  │    safeCount: 4873,                                        │    │
│  │    avgFraudScore: 0.0254,                                 │    │
│  │    createdAt: ISODate("2026-01-18T14:35:22Z"),           │    │
│  │    blockchain: {                                           │    │
│  │      stored: true,                    ← PROOF FLAG        │    │
│  │      txHash: "0x1a2b3c4d...",        ← BLOCKCHAIN PROOF  │    │
│  │      blockNumber: 42,                 ← BLOCKCHAIN PROOF  │    │
│  │      network: "Ganache Local",        ← BLOCKCHAIN PROOF  │    │
│  │      gasUsed: 150000,                 ← BLOCKCHAIN PROOF  │    │
│  │      confirmedAt: ISODate(...)        ← TIMESTAMP         │    │
│  │    }                                                       │    │
│  │  }                                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Return Success
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (app.py)                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Return Response to Frontend                               │    │
│  │  {                                                         │    │
│  │    success: true,                                          │    │
│  │    batchId: "BATCH-20260118-143522",                      │    │
│  │    blockchain: {                                           │    │
│  │      stored: true,                                         │    │
│  │      transactionHash: "0x1a2b3c4d...",                   │    │
│  │      blockNumber: 42                                       │    │
│  │    }                                                       │    │
│  │  }                                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ JSON Response
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Show Success Alert                                        │    │
│  │  ✅ Analytics stored on blockchain!                       │    │
│  │     Batch ID: BATCH-20260118-143522                       │    │
│  │     TX Hash: 0x1a2b3c4d...                               │    │
│  │     Block: 42                                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                   │                                  │
│                                   ↓                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Auto-Refresh Dashboard                                    │    │
│  │  GET /dashboard/metrics                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Fetch Latest Batches
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         MONGODB                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Query: Find all batches, sort by createdAt DESC          │    │
│  │  Return batches with blockchain proof                      │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Return Batches
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (BlockchainProofCard)                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Display Batches                                           │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │ BATCH-20260118-143522                            │     │    │
│  │  │ Records: 5000 | Fraud: 127                      │     │    │
│  │  │ ✅ Stored on Blockchain                         │     │    │
│  │  │ Block: #42                                       │     │    │
│  │  │ TX: 0x1a2b3c... [Copy]                         │     │    │
│  │  │ Network: Ganache Local Network                  │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘


## Data Flow Summary

1. **User Action**
   - Click "Store on Blockchain" button

2. **Backend Processing**
   - Compute analytics from current session
   - Generate SHA256 hash of analytics

3. **Blockchain Storage**
   - Send transaction to smart contract
   - Store analytics hash on-chain
   - Wait for transaction to be mined

4. **Proof Capture**
   - Get transaction receipt from blockchain
   - Extract: txHash, blockNumber, gasUsed

5. **MongoDB Persistence**
   - Store analytics + blockchain proof
   - Flag as "blockchain.stored = true"

6. **Dashboard Display**
   - Fetch from MongoDB
   - Display batch with visual indicators
   - Show TX hash, block number, network

7. **Verification**
   - User can copy TX hash
   - Check in Ganache
   - Verify in MongoDB


## Key Components

### Backend Components
```
app.py
├── /analytics/store-blockchain      (API endpoint)
├── blockchain_service.py
│   ├── store_analytics_on_blockchain()
│   └── compute_analytics_hash()
└── mongodb_service.py
    ├── store_analytics_batch()
    └── get_recent_analytics()
```

### Frontend Components
```
DashboardOverview.jsx
└── BlockchainProofCard.jsx
    ├── Statistics display
    ├── Recent batches list
    └── Blockchain proof details
```

### Data Storage
```
MongoDB: fraud_detection_db
└── analytics_batches (collection)
    ├── batchId
    ├── analytics (totalRecords, fraudCount, etc.)
    └── blockchain (txHash, blockNumber, network)

Blockchain: Ganache
└── MLContract
    └── saveBestModel(name, hash, batchId, timestamp)
```


## Blockchain Proof Components

### What Gets Stored On-Chain
- Analytics hash (SHA256)
- Batch ID
- Timestamp

### What Gets Captured from Receipt
- Transaction hash (unique identifier)
- Block number (where tx was mined)
- Gas used (computational cost)
- Status (success/fail)

### What Gets Stored in MongoDB
- All analytics data
- All blockchain proof
- Timestamps
- Storage status flag


## Security & Verification

### Blockchain Security
✅ Transaction hash is cryptographically secure
✅ Block number proves when data was stored
✅ Cannot be modified once mined
✅ Independently verifiable in Ganache

### MongoDB Security
✅ Stores exact TX hash from blockchain
✅ Stores exact block number from receipt
✅ Timestamps are server-side generated
✅ Can cross-reference with blockchain

### Verification Process
1. Copy TX hash from dashboard
2. Open Ganache → Transactions tab
3. Search for TX hash
4. Verify: exists, success, block number matches
5. Check MongoDB: verify data matches


## Error Handling Flow

```
Upload Data
    ↓
Compute Analytics
    ↓
Store on Blockchain? ──→ [Blockchain Unavailable]
    │                           ↓
    │                    Store in MongoDB
    │                    blockchain.stored = false
    │                    Return warning to user
    ↓
[Blockchain Available]
    ↓
Send Transaction
    ↓
Wait for Receipt ──→ [Transaction Failed]
    │                      ↓
    │               Log error
    │               Return error to user
    │               No MongoDB entry
    ↓
[Transaction Success]
    ↓
Capture Receipt
    ↓
Store in MongoDB
blockchain.stored = true
    ↓
Return success to user
    ↓
Dashboard displays proof
```


## Complete System Flow (30,000 ft view)

```
CSV Upload → ML Inference → Analytics Computed
                                    ↓
                        User Clicks "Store on Blockchain"
                                    ↓
            ┌──────────────────────────────────────┐
            │   Send TX to Blockchain Contract    │
            │   Wait for Mining                    │
            │   Capture Transaction Receipt        │
            └──────────────────────────────────────┘
                                    ↓
            ┌──────────────────────────────────────┐
            │   Store in MongoDB                   │
            │   - Analytics Data                   │
            │   - Blockchain Proof                 │
            └──────────────────────────────────────┘
                                    ↓
            ┌──────────────────────────────────────┐
            │   Dashboard Displays                 │
            │   ✅ Stored on Blockchain           │
            │   TX: 0x1a2b3c... Block: #42        │
            └──────────────────────────────────────┘
```

This visual representation shows how every piece connects to provide
verifiable blockchain proof from end to end.
