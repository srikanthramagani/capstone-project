# Blockchain Proof System - Quick Reference Card

## 🚀 Quick Start Commands

### Start MongoDB
```powershell
# Windows Service
net start MongoDB

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start Ganache
- Open Ganache GUI
- Ensure running on `http://127.0.0.1:8545`

### Start Backend
```powershell
cd project\BlockchainFraud
python app.py
# Server runs on http://localhost:5000
```

### Start Frontend
```powershell
cd Frontend
npm run dev
# Server runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Store Analytics on Blockchain
```http
POST http://localhost:5000/analytics/store-blockchain

Response:
{
  "success": true,
  "batchId": "BATCH-...",
  "blockchain": {
    "transactionHash": "0x...",
    "blockNumber": 42
  }
}
```

### Get Dashboard Metrics
```http
GET http://localhost:5000/dashboard/metrics

Response:
{
  "batches": [...],
  "statistics": {
    "totalBatches": 10,
    "blockchainStoredBatches": 8
  }
}
```

---

## 🗄️ MongoDB Queries

### View All Batches
```javascript
use fraud_detection_db
db.analytics_batches.find().pretty()
```

### Find Blockchain-Stored Batches
```javascript
db.analytics_batches.find({ "blockchain.stored": true })
```

### Get Latest Batch
```javascript
db.analytics_batches.find().sort({ createdAt: -1 }).limit(1)
```

### Count Batches
```javascript
db.analytics_batches.count()
```

---

## 🔧 Key Files

### Backend
```
mongodb_service.py       - MongoDB integration
blockchain_service.py    - Blockchain + receipt capture
app.py                   - API endpoints
```

### Frontend
```
BlockchainProofDashboard.jsx    - Full dashboard page
BlockchainProofCard.jsx         - Dashboard widget
DashboardOverview.jsx           - Main dashboard
```

---

## 🔍 Verification Steps

### 1. Check Transaction in Ganache
1. Open Ganache GUI
2. Go to "Transactions" tab
3. Find TX hash from dashboard
4. Verify: Status = SUCCESS, Block number matches

### 2. Check MongoDB
```javascript
mongosh
use fraud_detection_db
db.analytics_batches.findOne({ "batchId": "BATCH-..." })
```

### 3. Check Dashboard
- Look for green ✅ checkmark
- Verify TX hash matches Ganache
- Verify block number matches Ganache

---

## 📊 MongoDB Schema

```javascript
{
  batchId: "BATCH-20260118-143522",
  totalRecords: 5000,
  fraudCount: 127,
  safeCount: 4873,
  avgFraudScore: 0.0254,
  createdAt: ISODate("..."),
  blockchain: {
    stored: true,
    txHash: "0x1a2b3c4d...",
    blockNumber: 42,
    network: "Ganache Local Network",
    gasUsed: 150000
  }
}
```

---

## 🎯 Usage Flow

1. **Upload CSV** → Test Data Upload page
2. **Process Data** → Backend runs ML inference
3. **Store on Blockchain** → Click button in Dashboard
4. **Wait 3-5 seconds** → Transaction mining
5. **View Proof** → Dashboard shows TX hash, block number

---

## ⚙️ Configuration

### MongoDB Connection
```python
# Default: localhost:27017
# Set via environment variable:
export MONGODB_URI="mongodb://localhost:27017/"
```

### Blockchain Network
```python
# blockchain_service.py
blockchain_address = 'http://127.0.0.1:8545'  # Ganache
network_name = 'Ganache Local Network'
```

### Smart Contract Address
```python
# blockchain_service.py
deployed_address = '0xYourContractAddressHere'
```

---

## 🐛 Common Issues

### MongoDB Not Connected
**Error:** `MongoDB connection failed`
**Fix:** Start MongoDB service or Docker container

### Ganache Not Connected
**Error:** `Blockchain not connected`
**Fix:** Start Ganache GUI or ganache-cli

### pymongo Not Found
**Error:** `ModuleNotFoundError: No module named 'pymongo'`
**Fix:** `pip install pymongo`

### Transaction Failed
**Error:** `Transaction failed`
**Fix:** Check contract address and Ganache connection

---

## 📁 Project Structure

```
MajorProject/
├── project/BlockchainFraud/
│   ├── app.py                    # Flask backend
│   ├── mongodb_service.py        # MongoDB integration
│   ├── blockchain_service.py     # Blockchain logic
│   └── requirements.txt          # Python dependencies
├── Frontend/
│   └── src/
│       ├── pages/
│       │   ├── BlockchainProofDashboard.jsx
│       │   └── DashboardOverview.jsx
│       └── components/dashboard/
│           └── BlockchainProofCard.jsx
└── Documentation/
    ├── BLOCKCHAIN_PROOF_IMPLEMENTATION.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── SYSTEM_FLOW_DIAGRAM.md
```

---

## 🔐 Security Notes

### Production Checklist
- [ ] Use MongoDB Atlas (cloud)
- [ ] Enable MongoDB authentication
- [ ] Use Ethereum testnet (not Ganache)
- [ ] Add API authentication
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Implement rate limiting

---

## 📞 Testing with cURL

### Store Analytics
```bash
curl -X POST http://localhost:5000/analytics/store-blockchain
```

### Get Metrics
```bash
curl http://localhost:5000/dashboard/metrics | jq
```

### Health Check
```bash
curl http://localhost:5000/health
```

---

## 📈 Dashboard Features

### Statistics Cards
- Total Batches
- Blockchain Stored
- Pending
- Current Session

### Blockchain Proof Display
- ✅ Stored on Blockchain (green)
- ⚠️ Pending (yellow)
- TX hash with copy button
- Block number
- Network name

### Auto-Refresh
- Refreshes every 30 seconds
- Manual refresh button available

---

## 🎨 Visual Indicators

```
✅ Green Checkmark  = Stored on blockchain
⚠️ Yellow Warning   = Pending (no blockchain proof)
🔷 Blue Icon        = Database/MongoDB
📦 Box Icon         = Blockchain
🔗 Link Icon        = Copy/External link
```

---

## 💡 Pro Tips

1. **Always verify in Ganache** - TX hash should exist
2. **Check MongoDB after storage** - Ensure data persisted
3. **Use batch ID for tracking** - Unique identifier
4. **Copy TX hash for records** - Proof of storage
5. **Monitor gas usage** - Optimize contract calls

---

## 📚 Additional Resources

- **Full Documentation:** `BLOCKCHAIN_PROOF_IMPLEMENTATION.md`
- **Implementation Guide:** `IMPLEMENTATION_SUMMARY.md`
- **System Diagram:** `SYSTEM_FLOW_DIAGRAM.md`
- **Setup Script:** `setup_blockchain_proof.ps1`

---

## ✅ Quick Testing Checklist

- [ ] MongoDB running
- [ ] Ganache running
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] CSV data uploaded
- [ ] "Store on Blockchain" clicked
- [ ] Alert shows TX hash
- [ ] Dashboard displays batch
- [ ] TX hash verified in Ganache
- [ ] Data verified in MongoDB

---

## 🎯 Key Takeaways

✅ **Real blockchain storage** - Not simulated
✅ **Transaction receipts** - Actual proof
✅ **MongoDB persistence** - Permanent storage
✅ **Dashboard display** - Clear visualization
✅ **Verifiable** - Can check in Ganache

---

**For detailed documentation, see: `BLOCKCHAIN_PROOF_IMPLEMENTATION.md`**
