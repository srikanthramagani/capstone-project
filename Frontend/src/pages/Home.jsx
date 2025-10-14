import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  AdminPanelSettings, 
  Assessment, 
  CloudUpload, 
  TrendingUp,
  Security 
} from '@mui/icons-material';

export default function Home() {
  const features = [
    {
      title: "Admin Dashboard",
      description: "Access comprehensive fraud analytics and system management",
      link: "/admin",
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: '#32f1d5ff' }} />,
      color: "#efeff3ff"
    },
    {
      title: "Fraud Prediction",
      description: "Real-time transaction fraud detection and analysis",
      link: "/predict",
      icon: <Security sx={{ fontSize: 40, color: '#43a047' }} />,
      color: "#43a047"
    },
    {
      title: "Test Data Upload",
      description: "Upload CSV files for batch fraud analysis",
      link: "/testdata",
      icon: <CloudUpload sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: "#ff9800"
    },
    {
      title: "Live Market Analysis",
      description: "Real-time market data and trend visualization",
      link: "/liveanalysis",
      icon: <TrendingUp sx={{ fontSize: 40, color: '#e91e63' }} />,
      color: "#e91e63"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(120deg, #0f1e27ff 0%, #48aff0 100%)', 
      p: 3,
      overflowY: 'auto'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <Typography variant="h2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
          Blockchain Fraud Detection
        </Typography>
        <Typography variant="h5" color="#e3f2fd" sx={{ mb: 4 }}>
          Secure, Smart, and Scalable ML for Transaction Analysis
        </Typography>
      </motion.div>

      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    boxShadow: 6,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 12,
                      transform: 'translateY(-4px)'
                    }
                  }}
                  component={Link}
                  to={feature.link}
                  style={{ textDecoration: 'none' }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color={feature.color}
                      sx={{ mb: 1 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <Typography variant="body1" color="#e3f2fd" sx={{ mb: 3 }}>
            Choose a feature above to get started with fraud detection and analysis
          </Typography>
          <Button 
            component={Link} 
            to="/admin" 
            variant="contained" 
            color="primary" 
            size="large" 
            sx={{ 
              fontWeight: 600, 
              px: 4, 
              py: 1.5, 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Get Started
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
