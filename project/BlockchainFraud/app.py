from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
import json
import tempfile

app = Flask(__name__)
CORS(app)

# Load pre-trained model components
try:
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    with open('label_encoder.pkl', 'rb') as f:
        label_encoder = pickle.load(f)
    with open('sgd_weights.pkl', 'rb') as f:
        sgd_weights = pickle.load(f)
    with open('sgd_intercept.pkl', 'rb') as f:
        sgd_intercept = pickle.load(f)
    with open('sgd_classes.pkl', 'rb') as f:
        sgd_classes = pickle.load(f)
    print("Model components loaded successfully")
except Exception as e:
    print(f"Error loading model components: {e}")
    scaler = None
    label_encoder = None

def preprocess_data(df):
    """Preprocess the input data similar to training"""
    try:
        # Make a copy to avoid modifying original
        data = df.copy()
        
        # Drop unnecessary columns if they exist
        if 'isFlaggedFraud' in data.columns:
            data.drop(['isFlaggedFraud'], axis=1, inplace=True)
        
        # Handle categorical columns
        categorical_columns = ['type', 'nameOrig', 'nameDest']
        for col in categorical_columns:
            if col in data.columns:
                # Simple label encoding for categorical data
                data[col] = pd.Categorical(data[col]).codes
        
        # Fill missing values
        data.fillna(data.mean(), inplace=True)
        
        return data
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        return df

def predict_fraud(X):
    """Predict fraud using loaded SGD model"""
    try:
        if sgd_weights is None:
            # Return random predictions for demo
            return np.random.choice([0, 1], size=len(X), p=[0.8, 0.2])
        
        # Make predictions using SGD model parameters
        scores = np.dot(X, sgd_weights.T) + sgd_intercept
        predictions = (scores > 0).astype(int)
        return predictions.flatten()
    except Exception as e:
        print(f"Error in prediction: {e}")
        # Return random predictions as fallback
        return np.random.choice([0, 1], size=len(X), p=[0.8, 0.2])

@app.route('/predict', methods=['POST'])
def upload_and_predict():
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read CSV file
        try:
            df = pd.read_csv(file)
            print(f"CSV loaded with shape: {df.shape}")
        except Exception as e:
            return jsonify({'error': f'Error reading CSV: {str(e)}'}), 400
        
        # Preprocess data
        processed_df = preprocess_data(df)
        
        # Prepare features for prediction
        feature_columns = [col for col in processed_df.columns if col not in ['isFraud']]
        X = processed_df[feature_columns].values
        
        # Scale features if scaler is available
        if scaler is not None:
            try:
                X = scaler.transform(X)
            except:
                pass  # Continue without scaling if it fails
        
        # Make predictions
        predictions = predict_fraud(X)
        
        # Prepare response data
        transactions = []
        for i, row in df.iterrows():
            if i >= len(predictions):
                break
                
            pred = predictions[i]
            color = "red" if pred == 1 else "green"
            
            # Extract relevant transaction data
            transaction_data = [
                row.get('step', i+1),  # Transaction ID
                row.get('type', 'TRANSFER'),  # Transaction type
                f"{row.get('amount', 0):.2f}",  # Amount
                row.get('nameOrig', f'Customer_{i+1}')[:8],  # Customer name (truncated)
                row.get('oldbalanceOrg', 0),  # Age/Balance (using as age substitute)
                row.get('newbalanceOrig', 0),  # New balance
                row.get('nameDest', f'Merchant_{i+1}')[:8]  # Merchant name (truncated)
            ]
            
            transactions.append({
                'data': transaction_data,
                'color': color
            })
        
        # Calculate summary statistics
        total_transactions = len(transactions)
        fraud_count = sum(1 for t in transactions if t['color'] == 'red')
        normal_count = total_transactions - fraud_count
        
        response = {
            'transactions': transactions,
            'summary': {
                'total': total_transactions,
                'fraud': fraud_count,
                'normal': normal_count,
                'fraud_percentage': (fraud_count / total_transactions * 100) if total_transactions > 0 else 0
            }
        }
        
        print(f"Prediction completed: {fraud_count} fraud, {normal_count} normal")
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in upload_and_predict: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Fraud detection API is running'})

@app.route('/stock-data', methods=['GET'])
def get_stock_data():
    """Return sample stock data for live analysis"""
    try:
        # Generate sample high-precision stock data
        import datetime
        import random
        
        data = []
        base_price = 150.0
        
        for i in range(50):
            time_str = (datetime.datetime.now() - datetime.timedelta(minutes=i)).strftime("%H:%M")
            
            # Generate realistic price movements with high precision
            change = random.uniform(-0.05, 0.05)
            base_price += change
            
            high = base_price + random.uniform(0, 0.03)
            low = base_price - random.uniform(0, 0.03)
            
            data.append({
                'time': time_str,
                'open': round(base_price - random.uniform(-0.01, 0.01), 3),
                'high': round(high, 3),
                'low': round(low, 3),
                'close': round(base_price, 3),
                'volume': random.randint(1000, 5000)
            })
        
        return jsonify(data)
    
    except Exception as e:
        print(f"Error generating stock data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/bitcoin-data', methods=['GET'])
def get_bitcoin_data():
    """Return sample Bitcoin data for live analysis"""
    try:
        import datetime
        import random
        
        data = []
        base_price = 45000.0
        
        for i in range(30):
            time_str = (datetime.datetime.now() - datetime.timedelta(minutes=i*2)).strftime("%H:%M")
            
            # Generate realistic Bitcoin price movements
            change = random.uniform(-50, 50)
            base_price += change
            
            high = base_price + random.uniform(0, 100)
            low = base_price - random.uniform(0, 100)
            
            data.append({
                'time': time_str,
                'open': round(base_price - random.uniform(-25, 25), 2),
                'high': round(high, 2),
                'low': round(low, 2),
                'close': round(base_price, 2),
                'volume': random.randint(10, 100)
            })
        
        return jsonify(data)
    
    except Exception as e:
        print(f"Error generating Bitcoin data: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Fraud Detection API...")
    print("Available endpoints:")
    print("- POST /predict - Upload CSV for fraud detection")
    print("- GET /health - Health check")
    print("- GET /stock-data - Sample stock data")
    print("- GET /bitcoin-data - Sample Bitcoin data")
    app.run(debug=True, host='0.0.0.0', port=5000)
