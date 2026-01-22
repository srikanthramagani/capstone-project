# 🚀 HOW TO USE: Upload ANY File for Fraud Detection

## Quick Start

### Method 1: Command Line (Any File)
```bash
cd project\BlockchainFraud
python upload_and_analyze.py YOUR_FILE.csv
```

**Examples:**
```bash
# Local file in current directory
python upload_and_analyze.py my_transactions.csv

# Full path
python upload_and_analyze.py C:\Users\Documents\data.csv

# Relative path
python upload_and_analyze.py ..\Downloads\transactions.xlsx

# Different formats
python upload_and_analyze.py financial_data.txt
python upload_and_analyze.py report.pdf
python upload_and_analyze.py data.json
```

### Method 2: Interactive Mode
```bash
python interactive_upload.py
```
Then follow the prompts:
- Enter file path (or drag & drop)
- Confirm upload
- See results instantly

### Method 3: Using API Directly
```bash
# Upload any file
curl -X POST http://localhost:5000/upload -F "file=@C:\path\to\your_file.csv"

# Store results
curl -X POST http://localhost:5000/transactions/store

# View results
curl http://localhost:5000/transactions/list?limit=10
```

## What Your File Needs

**Minimum Requirements:**
- Any file format: CSV, TXT, PDF, Excel (.xls, .xlsx), JSON
- Can have ANY column names
- Will process whatever data you provide

**Optional Columns** (for best results):
- `amount` or `transaction_amount`
- `type` or `transaction_type`
- Customer/sender information
- Any other transaction details

**The system adapts to YOUR data structure!**

## Examples

### Example 1: Upload from Downloads folder
```bash
python upload_and_analyze.py C:\Users\srika\Downloads\new_transactions.csv
```

**Output:**
```
✅ File uploaded and analyzed!
   Total rows: 1500
   Fraud detected: 45
   Normal: 1455
   Fraud rate: 3.00%

✅ Stored in MongoDB!
   Inserted: 1500 documents
```

### Example 2: Upload from USB drive
```bash
python upload_and_analyze.py E:\bank_data_2026.xlsx
```

### Example 3: Upload from network location
```bash
python upload_and_analyze.py \\NetworkDrive\shared\transactions.csv
```

## What Happens

1. **Upload** → System receives your file
2. **Parse** → Extracts transaction data
3. **Analyze** → ML model predicts fraud
4. **Store** → Saves to MongoDB with predictions
5. **Done** → Results available in database and API

## View Results

### Check MongoDB:
```javascript
use fraud_detection_db
db.transactions.find().sort({_id: -1}).limit(10).pretty()
```

### Check via API:
```bash
# Get recent transactions
curl http://localhost:5000/transactions/list?limit=10

# Get fraud cases only
curl http://localhost:5000/transactions/list?filter=fraud

# Get statistics
curl http://localhost:5000/transactions/stats
```

### View in Frontend:
Open browser: `http://localhost:5173`

## Testing with Different Files

### Test 1: Small file (20 rows)
```bash
python upload_and_analyze.py my_test_data.csv
```

### Test 2: Large file (28,000+ rows)
```bash
python upload_and_analyze.py Dataset\data.csv
```

### Test 3: Your own file
```bash
python upload_and_analyze.py "C:\path\to\your\actual\data.csv"
```

## No Limitations!

✅ **ANY file name** - Upload whatever you want
✅ **ANY file size** - Process millions of transactions
✅ **ANY columns** - System adapts to your data
✅ **ANY format** - CSV, Excel, TXT, PDF, JSON

## Complete Workflow

```bash
# 1. Make sure Flask is running
cd project\BlockchainFraud
python app.py

# 2. In another terminal, upload your file
python upload_and_analyze.py YOUR_FILE.csv

# 3. Results automatically stored in MongoDB
# 4. View at http://localhost:5173
```

## Summary

**Before:** System used hardcoded `Dataset/data.csv`
**Now:** Upload ANY file you want!

```bash
# Upload whatever file you have
python upload_and_analyze.py <ANY_FILE>
```

That's it! 🎉
