# Blockchain Proof System - Troubleshooting Guide

## Common Issues and Solutions

---

## Issue 1: ERR_CONNECTION_REFUSED

### Symptoms
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
127.0.0.1:5000/predict:1
```

### Root Cause
Backend Flask server is not running on port 5000.

### Solution
```powershell
cd project\BlockchainFraud
python app.py
```

### Verification
```powershell
# Check if port 5000 is listening
netstat -ano | findstr :5000
```

---

## Issue 2: MongoDB Connection Failed

### Symptoms
```
⚠️ MongoDB connection failed: [Errno 111] Connection refused
⚠️ Running without MongoDB persistence
```

### Root Cause
MongoDB service is not running.

### Solution Option 1: Windows Service
```powershell
net start MongoDB
```

### Solution Option 2: Docker
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Solution Option 3: Check Installation
```powershell
# Check if MongoDB is installed
Get-Service MongoDB

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

### Verification
```powershell
# Connect to MongoDB
mongosh

# Should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
```

---

## Issue 3: Blockchain Not Connected

### Symptoms
```
⚠️ Ganache not connected. Running in standalone mode.
⚠️ Blockchain not connected - cannot store analytics
```

### Root Cause
Ganache blockchain is not running on port 8545.

### Solution
1. Open Ganache GUI application
2. Ensure it's running on `http://127.0.0.1:8545`
3. Check "QUICKSTART" workspace is active

### Verification
```powershell
# Test connection
curl -X POST http://127.0.0.1:8545 `
  -H "Content-Type: application/json" `
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Should return: {"jsonrpc":"2.0","id":1,"result":"0x..."}
```

---

## Issue 4: pymongo Module Not Found

### Symptoms
```
ModuleNotFoundError: No module named 'pymongo'
```

### Root Cause
pymongo package is not installed.

### Solution
```powershell
cd project\BlockchainFraud
pip install pymongo==4.5.0

# Or install all dependencies
pip install -r requirements.txt
```

### Verification
```powershell
python -c "import pymongo; print(pymongo.__version__)"
# Should output: 4.5.0
```

---

## Issue 5: Smart Contract Not Found

### Symptoms
```
⚠️ MLContract.json not found. Running without contract.
```

### Root Cause
Contract JSON file is missing or in wrong location.

### Solution
```powershell
# Copy contract JSON from eth/build/contracts/
copy eth\build\contracts\MLContract.json project\BlockchainFraud\

# Or check if it exists
dir project\BlockchainFraud\MLContract.json
```

---

## Issue 6: Transaction Failed

### Symptoms
```
❌ Error storing analytics on blockchain: Transaction failed
```

### Root Causes & Solutions

#### Cause A: Wrong Contract Address
**Solution:** Update contract address in `blockchain_service.py`
```python
deployed_address = '0xYourCorrectContractAddress'
```

#### Cause B: Insufficient Gas
**Solution:** Increase gas limit
```python
tx_hash = contract.functions.saveBestModel(...).transact({
    'from': self.web3.eth.default_account,
    'gas': 500000  # Increase from 300000
})
```

#### Cause C: Account Has No Ether
**Solution:** Check Ganache accounts have ETH balance

---

## Issue 7: Dashboard Shows No Batches

### Symptoms
Dashboard displays "No batches stored yet"

### Possible Causes

#### Cause A: No Data Uploaded
**Solution:** Upload CSV data first
1. Go to Test Data Upload page
2. Upload a CSV file
3. Wait for processing to complete

#### Cause B: Analytics Not Stored
**Solution:** Click "Store Current Analytics on Blockchain"

#### Cause C: MongoDB Empty
**Solution:** Check MongoDB
```javascript
mongosh
use fraud_detection_db
db.analytics_batches.find().count()
```

---

## Issue 8: Frontend Can't Fetch from Backend

### Symptoms
```
Access to XMLHttpRequest blocked by CORS policy
```

### Root Cause
CORS issue or backend not running.

### Solution
1. Ensure backend is running
2. Check CORS configuration in `app.py`
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

3. Restart backend server

---

## Issue 9: Transaction Hash Not Showing

### Symptoms
Batch shows "Pending" instead of blockchain proof

### Root Cause
Transaction not mined or receipt capture failed.

### Solution & Debugging

1. **Check Ganache**
   - Open Ganache → Transactions tab
   - Look for recent transactions
   - Verify status is SUCCESS

2. **Check Backend Logs**
   ```
   Should see:
   📤 Transaction sent: 0x...
   ⏳ Waiting for transaction to be mined...
   ✅ Analytics stored on blockchain!
   ```

3. **Check MongoDB**
   ```javascript
   db.analytics_batches.findOne({ 
     "batchId": "BATCH-..." 
   })
   // Check if blockchain.stored = true
   ```

---

## Issue 10: Dashboard Not Auto-Refreshing

### Symptoms
Dashboard doesn't update after storing analytics.

### Root Cause
Auto-refresh interval or React state issue.

### Solution
1. **Manual Refresh:** Click the refresh button
2. **Check Console:** Look for errors in browser console
3. **Restart Frontend:**
   ```powershell
   # Stop frontend (Ctrl+C)
   npm run dev
   ```

---

## Issue 11: Port Already in Use

### Symptoms
```
OSError: [Errno 48] Address already in use
```

### Root Cause
Port 5000 is occupied by another process.

### Solution
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or use different port in app.py
app.run(debug=True, port=5001, host='0.0.0.0')
```

---

## Issue 12: Web3 Version Mismatch

### Symptoms
```
AttributeError: 'Web3' object has no attribute 'is_connected'
```

### Root Cause
web3.py version incompatibility.

### Solution
```powershell
pip uninstall web3
pip install web3==6.10.0
```

---

## Issue 13: MongoDB Authentication Failed

### Symptoms
```
pymongo.errors.OperationFailure: Authentication failed
```

### Root Cause
MongoDB requires authentication but credentials not provided.

### Solution
1. **For Local Development:** Disable auth
2. **For Production:** Set connection string
   ```python
   mongo_uri = "mongodb://username:password@localhost:27017/"
   ```

---

## Issue 14: Frontend Build Errors

### Symptoms
```
Module not found: Can't resolve 'lucide-react'
```

### Root Cause
Missing npm dependencies.

### Solution
```powershell
cd Frontend
npm install lucide-react
npm install axios
npm install
```

---

## Diagnostic Commands

### Check All Services
```powershell
# MongoDB
Get-Service MongoDB

# Backend
netstat -ano | findstr :5000

# Ganache
curl -X POST http://127.0.0.1:8545 `
  -H "Content-Type: application/json" `
  -d '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}'

# MongoDB
mongosh --eval "db.version()"
```

### View Logs
```powershell
# Backend logs (terminal output)
cd project\BlockchainFraud
python app.py

# MongoDB logs
# Check: C:\Program Files\MongoDB\Server\<version>\log\mongod.log

# Browser console (F12 in browser)
```

---

## Reset Everything (Nuclear Option)

If nothing works, reset the entire system:

```powershell
# 1. Stop all services
taskkill /F /IM python.exe
taskkill /F /IM node.exe
net stop MongoDB

# 2. Clear MongoDB
mongosh
use fraud_detection_db
db.analytics_batches.deleteMany({})
exit

# 3. Restart Ganache
# Close and reopen Ganache GUI

# 4. Reinstall Python dependencies
cd project\BlockchainFraud
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# 5. Reinstall Node dependencies
cd ../../Frontend
rmdir /S /Q node_modules
npm install

# 6. Start everything fresh
# Terminal 1: MongoDB
net start MongoDB

# Terminal 2: Backend
cd project\BlockchainFraud
python app.py

# Terminal 3: Frontend
cd Frontend
npm run dev
```

---

## Verification Checklist

Run through this checklist to verify everything is working:

- [ ] MongoDB is running (port 27017)
- [ ] Can connect with `mongosh`
- [ ] Ganache is running (port 8545)
- [ ] Backend server is running (port 5000)
- [ ] Can access http://localhost:5000/health
- [ ] Frontend is running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Upload CSV works
- [ ] Store on blockchain works
- [ ] Dashboard displays batches
- [ ] TX hash matches Ganache
- [ ] MongoDB has records

---

## Getting Help

### Debug Mode
Enable more verbose logging:

```python
# app.py
app.run(debug=True, port=5000, host='0.0.0.0')

# blockchain_service.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Versions
```powershell
python --version          # Should be 3.8+
node --version           # Should be 16+
mongosh --version        # Should be 1.0+
pip show web3            # Should be 6.10.0
pip show pymongo         # Should be 4.5.0
```

### System Information
```powershell
# Windows version
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# Python packages
pip list

# Node packages
cd Frontend
npm list
```

---

## Prevention Tips

1. **Always start services in order:**
   - MongoDB first
   - Ganache second
   - Backend third
   - Frontend last

2. **Check logs regularly:**
   - Backend terminal for errors
   - Browser console for frontend errors
   - MongoDB logs for database issues

3. **Keep dependencies updated:**
   - Run `pip install -r requirements.txt` periodically
   - Run `npm install` in Frontend folder

4. **Backup MongoDB data:**
   ```bash
   mongodump --db fraud_detection_db --out backup/
   ```

5. **Document contract addresses:**
   - Keep track of deployed contract addresses
   - Update `blockchain_service.py` when redeploying

---

**If issues persist, check:**
- `BLOCKCHAIN_PROOF_IMPLEMENTATION.md` for detailed setup
- `IMPLEMENTATION_SUMMARY.md` for overview
- Backend terminal output for error messages
- Browser console (F12) for frontend errors
