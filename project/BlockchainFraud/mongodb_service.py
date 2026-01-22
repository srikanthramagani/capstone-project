"""
MongoDB Service for Analytics and Blockchain Proof Persistence
Stores analytics batches with verifiable blockchain transaction receipts
"""
from pymongo import MongoClient
from datetime import datetime
from typing import Dict, List, Optional
import os

class MongoDBService:
    def __init__(self):
        """Initialize MongoDB connection"""
        # MongoDB connection string (configurable via environment variable)
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://srikanthramagani_db_user:123@cluster0.fy8rq8o.mongodb.net/?appName=Cluster0')
        self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        try:
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client['fraud_detection_db']
            self.analytics_collection = self.db['analytics_batches']
            self.transactions_collection = self.db['transactions']
            
            # Create indexes for efficient queries
            self.analytics_collection.create_index([("createdAt", -1)])
            self.analytics_collection.create_index([("blockchain.txHash", 1)])
            self.analytics_collection.create_index([("blockchain.blockNumber", 1)])
            
            print("✅ MongoDB connected successfully")
            self.connected = True
        except Exception as e:
            print(f"⚠️ MongoDB connection failed: {e}")
            print("⚠️ Running without MongoDB persistence")
            self.connected = False
    
    def store_analytics_batch(self, analytics_data: Dict, blockchain_proof: Optional[Dict] = None) -> str:
        """
        Store analytics batch with blockchain proof
        
        Args:
            analytics_data: Analytics metrics (fraudCount, safeCount, etc.)
            blockchain_proof: Blockchain transaction receipt data
        
        Returns:
            Batch ID of the stored document
        """
        if not self.connected:
            print("⚠️ MongoDB not connected - skipping storage")
            return None
        
        try:
            # Generate batch ID
            batch_id = f"BATCH-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            
            # Prepare document structure
            document = {
                'batchId': batch_id,
                'totalRecords': analytics_data.get('totalRecords', 0),
                'fraudCount': analytics_data.get('fraudCount', 0),
                'safeCount': analytics_data.get('safeCount', 0),
                'avgFraudScore': analytics_data.get('avgFraudScore', 0.0),
                'createdAt': datetime.utcnow(),
                'blockchain': {
                    'stored': False,
                    'txHash': None,
                    'blockNumber': None,
                    'network': None
                }
            }
            
            # Add blockchain proof if available
            if blockchain_proof:
                document['blockchain'] = {
                    'stored': True,
                    'txHash': blockchain_proof.get('transactionHash'),
                    'blockNumber': blockchain_proof.get('blockNumber'),
                    'network': blockchain_proof.get('network', 'Ganache Local'),
                    'gasUsed': blockchain_proof.get('gasUsed'),
                    'confirmedAt': datetime.utcnow()
                }
            
            # Insert into MongoDB
            result = self.analytics_collection.insert_one(document)
            print(f"✅ Analytics batch stored in MongoDB: {batch_id}")
            
            if blockchain_proof:
                print(f"   📦 TX Hash: {blockchain_proof.get('transactionHash')}")
                print(f"   📦 Block Number: {blockchain_proof.get('blockNumber')}")
            
            return batch_id
        
        except Exception as e:
            print(f"❌ Error storing analytics batch: {e}")
            return None
    
    def update_blockchain_proof(self, batch_id: str, blockchain_proof: Dict) -> bool:
        """
        Update existing batch with blockchain proof
        
        Args:
            batch_id: The batch ID to update
            blockchain_proof: Blockchain transaction receipt
        
        Returns:
            Success status
        """
        if not self.connected:
            return False
        
        try:
            result = self.analytics_collection.update_one(
                {'batchId': batch_id},
                {
                    '$set': {
                        'blockchain.stored': True,
                        'blockchain.txHash': blockchain_proof.get('transactionHash'),
                        'blockchain.blockNumber': blockchain_proof.get('blockNumber'),
                        'blockchain.network': blockchain_proof.get('network', 'Ganache Local'),
                        'blockchain.gasUsed': blockchain_proof.get('gasUsed'),
                        'blockchain.confirmedAt': datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Blockchain proof updated for batch: {batch_id}")
                return True
            else:
                print(f"⚠️ Batch not found: {batch_id}")
                return False
        
        except Exception as e:
            print(f"❌ Error updating blockchain proof: {e}")
            return False
    
    def get_recent_analytics(self, limit: int = 10) -> List[Dict]:
        """
        Retrieve recent analytics batches with blockchain proof
        
        Args:
            limit: Number of recent batches to retrieve
        
        Returns:
            List of analytics batches
        """
        if not self.connected:
            return []
        
        try:
            batches = list(
                self.analytics_collection
                .find({})
                .sort('createdAt', -1)
                .limit(limit)
            )
            
            # Convert ObjectId to string for JSON serialization
            for batch in batches:
                batch['_id'] = str(batch['_id'])
                # Format datetime to ISO string
                if 'createdAt' in batch:
                    batch['createdAt'] = batch['createdAt'].isoformat()
                if 'blockchain' in batch and 'confirmedAt' in batch['blockchain']:
                    if batch['blockchain']['confirmedAt']:
                        batch['blockchain']['confirmedAt'] = batch['blockchain']['confirmedAt'].isoformat()
            
            return batches
        
        except Exception as e:
            print(f"❌ Error retrieving analytics: {e}")
            return []
    
    def get_blockchain_statistics(self) -> Dict:
        """
        Get statistics about blockchain-stored analytics
        
        Returns:
            Statistics dictionary
        """
        if not self.connected:
            return {
                'totalBatches': 0,
                'blockchainStoredBatches': 0,
                'pendingBatches': 0
            }
        
        try:
            total = self.analytics_collection.count_documents({})
            blockchain_stored = self.analytics_collection.count_documents({'blockchain.stored': True})
            
            return {
                'totalBatches': total,
                'blockchainStoredBatches': blockchain_stored,
                'pendingBatches': total - blockchain_stored
            }
        
        except Exception as e:
            print(f"❌ Error retrieving statistics: {e}")
            return {
                'totalBatches': 0,
                'blockchainStoredBatches': 0,
                'pendingBatches': 0
            }
    
    def get_batch_by_id(self, batch_id: str) -> Optional[Dict]:
        """
        Retrieve specific batch by ID
        
        Args:
            batch_id: The batch ID to retrieve
        
        Returns:
            Batch document or None
        """
        if not self.connected:
            return None
        
        try:
            batch = self.analytics_collection.find_one({'batchId': batch_id})
            
            if batch:
                batch['_id'] = str(batch['_id'])
                if 'createdAt' in batch:
                    batch['createdAt'] = batch['createdAt'].isoformat()
                if 'blockchain' in batch and 'confirmedAt' in batch['blockchain']:
                    if batch['blockchain']['confirmedAt']:
                        batch['blockchain']['confirmedAt'] = batch['blockchain']['confirmedAt'].isoformat()
            
            return batch
        
        except Exception as e:
            print(f"❌ Error retrieving batch: {e}")
            return None
    
    def store_transaction(self, transaction_data: Dict, blockchain_hash: str = None) -> Optional[str]:
        """
        Store individual transaction with blockchain proof
        This produces MongoDB op: "i" (insert) operation
        
        Args:
            transaction_data: Transaction details (amount, type, sender, etc.)
            blockchain_hash: Hash stored on blockchain
        
        Returns:
            Transaction ID if successful, None otherwise
        """
        if not self.connected:
            print("⚠️ MongoDB not connected - cannot store transaction")
            return None
        
        try:
            # Generate unique transaction ID
            tx_id = f"TX-{datetime.now().strftime('%Y%m%d%H%M%S')}-{len(transaction_data.get('sender', ''))}"
            
            # Prepare document with explicit structure
            document = {
                'transactionId': tx_id,
                'amount': float(transaction_data.get('amount', 0)),
                'transactionType': transaction_data.get('type', 'TRANSFER'),
                'sender': transaction_data.get('sender', 'Unknown'),
                'receiver': transaction_data.get('receiver', 'Unknown'),
                'prediction': transaction_data.get('prediction', 'UNKNOWN'),
                'isFraud': int(transaction_data.get('isFraud', 0)),
                'confidence': float(transaction_data.get('confidence', 0.0)),
                'timestamp': datetime.utcnow(),
                'blockchain': {
                    'hash': blockchain_hash if blockchain_hash else None,
                    'verified': blockchain_hash is not None,
                    'storedAt': datetime.utcnow() if blockchain_hash else None
                },
                'metadata': {
                    'step': transaction_data.get('step', 0),
                    'oldbalanceOrg': transaction_data.get('oldbalanceOrg', 0),
                    'newbalanceOrig': transaction_data.get('newbalanceOrig', 0)
                }
            }
            
            # CRITICAL: Use insertOne to ensure op: "i" operation
            # This explicitly inserts into the 'transactions' collection
            result = self.transactions_collection.insert_one(document)
            
            if result.inserted_id:
                print(f"✅ Transaction stored in MongoDB: {tx_id}")
                print(f"   Collection: fraud_detection_db.transactions")
                print(f"   ObjectId: {result.inserted_id}")
                print(f"   Operation: op='i' (INSERT)")
                return tx_id
            else:
                print("❌ Insert failed - no ID returned")
                return None
        
        except Exception as e:
            print(f"❌ Error storing transaction: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def store_transactions_batch(self, transactions: List[Dict], blockchain_data: Dict = None) -> Dict:
        """
        Store multiple transactions in batch
        Produces multiple op: "i" operations
        
        Args:
            transactions: List of transaction dictionaries
            blockchain_data: Blockchain reference data
        
        Returns:
            Dictionary with insertion results
        """
        if not self.connected:
            print("⚠️ MongoDB not connected - cannot store transactions")
            return {'success': False, 'inserted': 0}
        
        try:
            documents = []
            batch_id = f"BATCH-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            for idx, tx in enumerate(transactions):
                tx_id = f"{batch_id}-TX{idx+1:04d}"
                
                document = {
                    'transactionId': tx_id,
                    'batchId': batch_id,
                    'amount': float(tx.get('amount', 0)),
                    'transactionType': tx.get('type', 'TRANSFER'),
                    'sender': tx.get('sender', f"Customer_{idx+1}"),
                    'receiver': tx.get('receiver', f"Merchant_{idx+1}"),
                    'prediction': tx.get('prediction', 'NORMAL'),
                    'isFraud': int(tx.get('isFraud', 0)),
                    'confidence': float(tx.get('confidence', 0.0)),
                    'timestamp': datetime.utcnow(),
                    'blockchain': {
                        'batchHash': blockchain_data.get('hash') if blockchain_data else None,
                        'blockNumber': blockchain_data.get('blockNumber') if blockchain_data else None,
                        'txHash': blockchain_data.get('transactionHash') if blockchain_data else None,
                        'verified': blockchain_data is not None
                    }
                }
                documents.append(document)
            
            # CRITICAL: Use insert_many for batch operations
            # This produces multiple op: "i" operations
            if documents:
                result = self.transactions_collection.insert_many(documents)
                inserted_count = len(result.inserted_ids)
                
                print(f"✅ Batch transactions stored in MongoDB")
                print(f"   Collection: fraud_detection_db.transactions")
                print(f"   Inserted: {inserted_count} documents")
                print(f"   Operation: op='i' (INSERT) x {inserted_count}")
                print(f"   Batch ID: {batch_id}")
                
                return {
                    'success': True,
                    'inserted': inserted_count,
                    'batchId': batch_id,
                    'insertedIds': [str(id) for id in result.inserted_ids]
                }
            else:
                return {'success': False, 'inserted': 0}
        
        except Exception as e:
            print(f"❌ Error storing transaction batch: {e}")
            import traceback
            traceback.print_exc()
            return {'success': False, 'inserted': 0, 'error': str(e)}
    
    def get_transactions(self, limit: int = 50, filter_fraud: Optional[bool] = None) -> List[Dict]:
        """
        Retrieve transactions from MongoDB
        
        Args:
            limit: Maximum number of transactions to retrieve
            filter_fraud: If True, only fraud; if False, only normal; if None, all
        
        Returns:
            List of transaction documents
        """
        if not self.connected:
            return []
        
        try:
            query = {}
            if filter_fraud is not None:
                query['isFraud'] = 1 if filter_fraud else 0
            
            transactions = list(
                self.transactions_collection
                .find(query)
                .sort('timestamp', -1)
                .limit(limit)
            )
            
            # Convert ObjectId and datetime for JSON serialization
            for tx in transactions:
                tx['_id'] = str(tx['_id'])
                if 'timestamp' in tx:
                    tx['timestamp'] = tx['timestamp'].isoformat()
                if 'blockchain' in tx and 'storedAt' in tx['blockchain']:
                    if tx['blockchain']['storedAt']:
                        tx['blockchain']['storedAt'] = tx['blockchain']['storedAt'].isoformat()
            
            return transactions
        
        except Exception as e:
            print(f"❌ Error retrieving transactions: {e}")
            return []
    
    def get_transaction_stats(self) -> Dict:
        """
        Get transaction statistics from MongoDB
        
        Returns:
            Statistics dictionary
        """
        if not self.connected:
            return {'totalTransactions': 0, 'fraudTransactions': 0, 'normalTransactions': 0}
        
        try:
            total = self.transactions_collection.count_documents({})
            fraud = self.transactions_collection.count_documents({'isFraud': 1})
            normal = self.transactions_collection.count_documents({'isFraud': 0})
            
            return {
                'totalTransactions': total,
                'fraudTransactions': fraud,
                'normalTransactions': normal,
                'fraudPercentage': (fraud / total * 100) if total > 0 else 0
            }
        
        except Exception as e:
            print(f"❌ Error retrieving transaction stats: {e}")
            return {'totalTransactions': 0, 'fraudTransactions': 0, 'normalTransactions': 0}

# Don't create global instance - let app.py create it
# mongodb_service = MongoDBService()
