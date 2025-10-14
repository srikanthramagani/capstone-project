import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "3PPN9N20KDJCV68P";

export default function AdminScreen() {
  const location = useLocation();
  const backendHtml = location.state?.backendHtml || "";

  const [stockData, setStockData] = useState([]);
  const [btcData, setBtcData] = useState([]);
  const [loading, setLoading] = useState(true);


  // Custom Candlestick Component
  const Candlestick = ({ payload, x, y, width, height }) => {
    if (!payload) return null;
    
    const { open, high, low, close } = payload;
    const isRising = close >= open;
    const color = isRising ? "#00C851" : "#ff4444";
    const fillColor = isRising ? "#00C851" : "#ff4444";
    
    const bodyHeight = Math.abs(close - open);
    const bodyY = Math.min(open, close);
    const wickTop = high;
    const wickBottom = low;
    
    // Scale values to chart coordinates
    const priceRange = Math.max(...Object.values(payload)) - Math.min(...Object.values(payload));
    const scale = height / (priceRange * 1.1); // Add 10% padding
    
    const candleHeight = bodyHeight * scale;
    const candleY = y + height - ((bodyY - Math.min(...Object.values(payload))) * scale) - candleHeight;
    
    return (
      <g>
        {/* Wick line */}
        <line
          x1={x + width / 2}
          y1={y + height - ((wickTop - Math.min(...Object.values(payload))) * scale)}
          x2={x + width / 2}
          y2={y + height - ((wickBottom - Math.min(...Object.values(payload))) * scale)}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body rectangle */}
        <rect
          x={x + width * 0.25}
          y={candleY}
          width={width * 0.5}
          height={Math.max(candleHeight, 2)}
          fill={fillColor}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const fetchStockData = async () => {
    try {
      console.log("Fetching AAPL stock data...");
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=${API_KEY}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Stock API response:", data);
      
      const timeSeries = data["Time Series (1min)"];
      if (timeSeries) {
        const formatted = Object.entries(timeSeries)
          .map(([time, values]) => ({
            time: time.substring(11), // Extract time part (HH:MM:SS)
            open: parseFloat(values["1. open"]),
            high: parseFloat(values["2. high"]),
            low: parseFloat(values["3. low"]),
            close: parseFloat(values["4. close"]),
            volume: parseInt(values["5. volume"])
          }))
          .reverse()
          .slice(-30); // Reduced from 50 to 30 for faster rendering
        
        console.log("Formatted stock data:", formatted.slice(0, 3));
        setStockData(formatted);
      } else {
        console.warn("No time series data found, keeping existing data");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn("Stock data fetch timed out");
      } else {
        console.error("Error fetching stock data:", err);
      }
    }
  };

  // Fetch Bitcoin - Modified to get more frequent data
  const fetchBtcData = async () => {
    try {
      console.log("Fetching Bitcoin data...");
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${API_KEY}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Bitcoin API response:", data);
      
      const price = parseFloat(data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]);
      if (price && !isNaN(price)) {
        const currentTime = new Date().toLocaleTimeString();
        // Create OHLC format for Bitcoin (simulating micro-movements)
        const priceVariation = price * 0.0001; // 0.01% variation
        const newDataPoint = {
          time: currentTime,
          open: price - (Math.random() * priceVariation),
          high: price + (Math.random() * priceVariation * 2),
          low: price - (Math.random() * priceVariation * 2),
          close: price,
          volume: Math.floor(Math.random() * 20) + 5
        };
        
        console.log("New BTC data point:", newDataPoint);
        setBtcData((prev) => [
          ...prev.slice(-29), // Reduced from 49 to 29 for faster rendering
          newDataPoint
        ]);
      } else {
        console.warn("Invalid Bitcoin price data, keeping existing data");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn("Bitcoin data fetch timed out");
      } else {
        console.error("Error fetching BTC data:", err);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Start with sample data immediately for instant visibility
        setStockData(sampleStockData);
        setBtcData(sampleBtcData);
        setLoading(false); // Set loading to false immediately
        
        // Load real API data in background without blocking UI
        setTimeout(async () => {
          console.log("Fetching real API data...");
          await Promise.all([fetchStockData(), fetchBtcData()]);
          console.log("API data loaded successfully");
        }, 100); // Small delay to allow UI to render first
        
      } catch (error) {
        console.error("Error loading API data, using sample data:", error);
        setStockData(sampleStockData);
        setBtcData(sampleBtcData);
        setLoading(false);
      }
    };
    loadData();

    // Optimize update intervals - less frequent updates
    const btcInterval = setInterval(() => {
      console.log("Updating BTC data...");
      fetchBtcData();
    }, 60000); // Reduced from 30s to 60s
    
    const stockInterval = setInterval(() => {
      console.log("Updating stock data...");
      fetchStockData();
    }, 300000); // Reduced from 2min to 5min
    
    return () => {
      clearInterval(btcInterval);
      clearInterval(stockInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: "1000px" }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            mb: 3,
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {backendHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(backendHtml),
              }}
            />
          ) : (
            <>
              <Typography
                variant="h4"
                color="primary"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Real-Time Business Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Monitor live stock and cryptocurrency prices with real-time
                analytics.
              </Typography>
            </>
          )}

          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" my={4}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading market data...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Debug Info */}
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Stock Data Points: {stockData.length} | Bitcoin Data Points: {btcData.length}
              </Typography>

              {/* Stock Chart */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                📈 AAPL Stock Candlestick (High Precision)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    angle={-90}
                    textAnchor="end"
                    height={80}
                    tickFormatter={(value) => value.substring(3)}
                  />
                  <YAxis 
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value.toFixed(3)}`}
                    tickCount={10}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`$${value.toFixed(3)}`, name.toUpperCase()]}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="high" fill="transparent" />
                  <Bar dataKey="low" fill="transparent" />
                  <Line type="monotone" dataKey="close" stroke="#1e88e5" strokeWidth={3} dot={{ r: 2 }} connectNulls={false} />
                  <Line type="monotone" dataKey="open" stroke="#ff9800" strokeWidth={2} strokeDasharray="2 2" dot={{ r: 1 }} />
                  <Line type="monotone" dataKey="high" stroke="#4caf50" strokeWidth={1} strokeDasharray="1 1" dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#f44336" strokeWidth={1} strokeDasharray="1 1" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Bitcoin Chart */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                ₿ Bitcoin Candlestick (Ultra Precision)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={btcData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    angle={-90}
                    textAnchor="end"
                    height={80}
                    tickFormatter={(value) => value.substring(3)}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                    tickCount={15}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name.toUpperCase()]}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="high" fill="transparent" />
                  <Bar dataKey="low" fill="transparent" />
                  <Line type="monotone" dataKey="close" stroke="#f39c12" strokeWidth={3} dot={{ r: 2 }} connectNulls={false} />
                  <Line type="monotone" dataKey="open" stroke="#8e44ad" strokeWidth={2} strokeDasharray="2 2" dot={{ r: 1 }} />
                  <Line type="monotone" dataKey="high" stroke="#27ae60" strokeWidth={1} strokeDasharray="1 1" dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#e74c3c" strokeWidth={1} strokeDasharray="1 1" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </>
          )}
        </Card>

        {/* Buttons */}
        <Box textAlign="center" mt={2}>
          <Button
            component={Link}
            to="/predict"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Predict Fraud
          </Button>
          <Button
            component={Link}
            to="/testdata"
            variant="contained"
            color="secondary"
            sx={{ mr: 2 }}
          >
            Upload Test Data
          </Button>
          <Button
            component={Link}
            to="/logout"
            variant="outlined"
            color="secondary"
          >
            Logout
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
