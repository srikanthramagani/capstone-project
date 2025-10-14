import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/Logout").finally(() => {
      setTimeout(() => navigate("/"), 1200);
    });
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: isMobile ? 3 : 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={700}
            sx={{ mb: 3, color: "#fff", textAlign: "center" }}
          >
            Logging out...
          </Typography>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            <CircularProgress size={isMobile ? 40 : 50} sx={{ color: "#fff" }} />
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}
