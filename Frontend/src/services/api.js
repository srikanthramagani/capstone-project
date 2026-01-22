const BASE_URL = 'http://localhost:5000';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardMetrics() {
    return this.request('/dashboard/metrics');
  }

  async getBitcoinData() {
    return this.request('/bitcoin-data');
  }

  // Transaction APIs
  async getTransactions(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/transactions?${searchParams}`);
  }

  // Analytics APIs
  async getAnalyticsCharts() {
    return this.request('/analytics/charts');
  }

  async getFlaggedTransactions() {
    return this.request('/analytics/flagged');
  }

  async retrainModel() {
    return this.request('/analytics/retrain', {
      method: 'POST',
    });
  }

  async runFraudDetection() {
    return this.request('/analytics/detect', {
      method: 'POST',
    });
  }

  // ML Prediction API
  async predictFraud(data) {
    return this.request('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();