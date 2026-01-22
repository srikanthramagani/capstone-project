# MongoDB Storage Architecture

## Before Fix (Problem)

```
┌─────────────────┐
│   Flask App     │
│   (app.py)      │
└────────┬────────┘
         │
         │ Only creates indexes
         ▼
┌─────────────────────────────────┐
│   MongoDB Service               │
│                                 │
│   ✗ Collection created         │
│   ✗ Indexes added              │
│   ✗ No insert operations       │
└────────┬────────────────────────┘
         │
         │ Only op: "c" commands
         ▼
┌─────────────────────────────────┐
│   MongoDB Database              │
│   fraud_detection_db            │
│                                 │
│   transactions: []  ❌ EMPTY   │
│   analytics_batches: [...]      │
│                                 │
│   Oplog shows:                  │
│   - op: "c" (commands)          │
│   - ns: "$cmd"                  │
└─────────────────────────────────┘
```

**Result**: No actual data stored! ❌

---

## After Fix (Solution)

```
┌─────────────────────────────────────────┐
│   Flask App (app.py)                    │
│                                         │
│   POST /upload                          │
│   POST /transactions/store   ← NEW!    │
│   GET  /transactions/list    ← NEW!    │
│   GET  /mongodb/verify       ← NEW!    │
└────────┬────────────────────────────────┘
         │
         │ Explicit insert calls
         ▼
┌─────────────────────────────────────────┐
│   MongoDB Service (mongodb_service.py)  │
│                                         │
│   ✓ store_transaction()      ← NEW!    │
│   ✓ store_transactions_batch() ← NEW!  │
│   ✓ get_transactions()       ← NEW!    │
│   ✓ get_transaction_stats()  ← NEW!    │
│                                         │
│   Calls:                                │
│   - collection.insert_one(doc)          │
│   - collection.insert_many(docs)        │
└────────┬────────────────────────────────┘
         │
         │ op: "i" insert operations
         ▼
┌─────────────────────────────────────────┐
│   MongoDB Database                      │
│   fraud_detection_db                    │
│                                         │
│   transactions: [1000+ docs] ✅        │
│   ├─ Transaction 1                      │
│   ├─ Transaction 2                      │
│   ├─ ...                                │
│   └─ Transaction N                      │
│                                         │
│   analytics_batches: [batches]          │
│                                         │
│   Oplog shows:                          │
│   - op: "i" (inserts) ✅               │
│   - ns: "fraud_detection_db.transactions"│
└─────────────────────────────────────────┘
```

**Result**: Real data stored with proper inserts! ✅

---

## Data Flow

### Upload & Store Flow

```
1. User Uploads CSV
   │
   ├─→ POST /upload
   │   └─→ Parse & train model
   │       └─→ Store in memory
   │
   └─→ POST /transactions/store
       │
       ├─→ Loop through transactions
       │   ├─→ Create document structure
       │   │   ├─ transactionId
       │   │   ├─ amount
       │   │   ├─ type
       │   │   ├─ sender/receiver
       │   │   ├─ prediction
       │   │   ├─ isFraud
       │   │   ├─ confidence
       │   │   ├─ timestamp
       │   │   └─ blockchain data
       │   │
       │   └─→ collection.insert_many(documents)
       │       │
       │       └─→ MongoDB op: "i" ✅
       │
       └─→ Return success + inserted count
```

### Verification Flow

```
GET /mongodb/verify
   │
   ├─→ Count documents
   │   └─→ db.transactions.countDocuments()
   │
   ├─→ Get statistics
   │   ├─→ Total transactions
   │   ├─→ Fraud count
   │   └─→ Normal count
   │
   ├─→ Get sample data
   │   └─→ db.transactions.find().limit(2)
   │
   └─→ Return verification status
       ├─ transactionsStored: true/false
       ├─ operationType: "op: i (insert)"
       └─ Sample documents
```

---

## MongoDB Operation Types

```
┌──────────────────────────────────────────────────┐
│  Operation Type    │  Code  │  What It Means    │
├──────────────────────────────────────────────────┤
│  Command           │  "c"   │  Admin operations │
│                    │        │  - ping           │
│                    │        │  - createIndex    │
│                    │        │  - listCollections│
│                    │        │  Namespace: $cmd  │
│                    │        │  ❌ NOT data     │
├──────────────────────────────────────────────────┤
│  Insert            │  "i"   │  Data insertion   │
│                    │        │  - insertOne      │
│                    │        │  - insertMany     │
│                    │        │  Namespace: db.col│
│                    │        │  ✅ REAL DATA    │
├──────────────────────────────────────────────────┤
│  Update            │  "u"   │  Data modification│
│  Delete            │  "d"   │  Data removal     │
│  Query             │  N/A   │  Data retrieval   │
└──────────────────────────────────────────────────┘
```

---

## Document Structure Comparison

### ❌ Before (No Data)

```javascript
// Empty collection
db.transactions.find()
// Returns: nothing

db.transactions.countDocuments()
// Returns: 0
```

### ✅ After (With Data)

```javascript
// Populated collection
db.transactions.findOne()
// Returns:
{
  "_id": ObjectId("65a1b2c3d4e5f6789"),
  "transactionId": "BATCH-20260119-TX0001",
  "amount": 5000.50,
  "transactionType": "CASH_OUT",
  "sender": "C123456",
  "receiver": "M987654",
  "prediction": "FRAUD",
  "isFraud": 1,
  "confidence": 0.85,
  "timestamp": ISODate("2026-01-19T12:30:45Z"),
  "blockchain": {
    "batchHash": "0x123abc...",
    "verified": true
  }
}

db.transactions.countDocuments()
// Returns: 1000 (actual count)
```

---

## API Endpoint Map

```
┌─────────────────────────────────────────────────┐
│  Endpoint                  │  Purpose           │
├─────────────────────────────────────────────────┤
│  POST /upload              │  Upload CSV data   │
│                            │  (existing)        │
├─────────────────────────────────────────────────┤
│  POST /transactions/store  │  Store to MongoDB  │
│                            │  Produces op: "i"  │
│                            │  ✅ NEW            │
├─────────────────────────────────────────────────┤
│  GET /transactions/list    │  Retrieve stored   │
│    ?limit=N                │  transactions      │
│    ?fraud=true/false       │  ✅ NEW            │
├─────────────────────────────────────────────────┤
│  GET /transactions/stats   │  Get statistics    │
│                            │  ✅ NEW            │
├─────────────────────────────────────────────────┤
│  GET /mongodb/verify       │  Verify storage    │
│                            │  Check op: "i"     │
│                            │  ✅ NEW            │
└─────────────────────────────────────────────────┘
```

---

## Testing Workflow

```
┌────────────────────────────────────────────┐
│  1. Start Flask App                        │
│     python app.py                          │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│  2. Run Test Script                        │
│     python test_mongodb_storage.py         │
│                                            │
│     Tests:                                 │
│     ✓ API connection                       │
│     ✓ Data upload                          │
│     ✓ MongoDB storage                      │
│     ✓ Verification                         │
│     ✓ Statistics                           │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│  3. Check MongoDB                          │
│     mongosh <connection-string>            │
│                                            │
│     Commands:                              │
│     > use fraud_detection_db               │
│     > db.transactions.countDocuments()     │
│     > db.transactions.findOne()            │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│  4. Verify Results                         │
│                                            │
│     ✅ Documents exist                     │
│     ✅ op: "i" operations logged          │
│     ✅ Correct namespace                   │
│     ✅ Data structure correct              │
└────────────────────────────────────────────┘
```

---

## Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| **Data Storage** | In-memory only | Persisted to MongoDB |
| **Operations** | Only op: "c" | op: "i" for inserts |
| **Namespace** | $cmd | fraud_detection_db.transactions |
| **Document Count** | 0 | 1000+ |
| **Verification** | Not possible | Dedicated endpoint |
| **Retrieval** | Not possible | Query endpoints |
| **Statistics** | None | Available via API |

---

## Success Indicators

```
✅ MongoDB Connection
   └─ mongodb_service.connected == True

✅ Data Upload
   └─ POST /upload returns success

✅ Data Storage
   └─ POST /transactions/store
       └─ inserted > 0

✅ Verification
   └─ GET /mongodb/verify
       └─ transactionsStored == True
       └─ operationType == "op: i (insert)"

✅ MongoDB Shell
   └─ db.transactions.countDocuments() > 0
   └─ db.transactions.findOne() returns data

✅ Operation Logs
   └─ MongoDB logs show op: "i"
   └─ Namespace: fraud_detection_db.transactions
```

---

## Common Patterns

### Pattern 1: Single Transaction Insert

```python
# Store one transaction
tx_id = mongodb_service.store_transaction(
    transaction_data={...},
    blockchain_hash="0x123..."
)
```

**Result**: 1 op: "i" operation

### Pattern 2: Batch Insert

```python
# Store multiple transactions
result = mongodb_service.store_transactions_batch(
    transactions=[tx1, tx2, ..., txN]
)
```

**Result**: N op: "i" operations

### Pattern 3: Query & Verify

```python
# Get stored transactions
txs = mongodb_service.get_transactions(limit=10)

# Get statistics
stats = mongodb_service.get_transaction_stats()
```

**Result**: Read operations (no op: "i", but confirms data exists)

---

**Status**: ✅ Architecture Fixed & Verified
