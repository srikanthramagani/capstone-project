import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Box, Card, Typography, Button, TextField } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import Particles from "react-tsparticles";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendHtml, setBackendHtml] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return setError("Please enter username");
    if (!password) return setError("Please enter password");

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("t1", username);
      formData.append("t2", password);

      const res = await axios.post(
        "http://127.0.0.1:5000/AdminLoginAction",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: "text" }
      );
      setBackendHtml(res.data);

      if (res.data.includes("Welcome")) {
        setTimeout(() => navigate("/adminscreen"), 1200);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      {/* Blockchain Nodes Particle Background */}
      <Particles
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: "#48aff0" },
            shape: {
              type: "image",
              image: [
                { src: "https://img.icons8.com/ios-filled/50/48aff0/block.png", width: 20, height: 20 },
                { src: "https://img.icons8.com/ios-filled/50/48aff0/connection-node.png", width: 20, height: 20 },
              ],
            },
            opacity: { value: 0.7 },
            size: { value: 15, random: true },
            move: { enable: true, speed: 1, direction: "none", outModes: "bounce" },
            links: { enable: true, distance: 120, color: "#48aff0", opacity: 0.3, width: 1 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100 },
              push: { quantity: 4 },
            },
          },
          detectRetina: true,
        }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {/* Login Card with subtle blockchain glow */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Card
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(25px)",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#fff",
            width: { xs: "90vw", sm: "400px" },
            boxShadow: "0 0 20px rgba(72, 175, 240, 0.4), 0 0 40px rgba(72, 175, 240, 0.2)",
            animation: "cardGlow 2.5s ease-in-out infinite",
            "&:hover": { transform: "scale(1.05)", transition: "0.3s ease" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <LockOutlinedIcon sx={{ fontSize: 50, color: "#48aff0", mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Admin Login
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, textAlign: "center", color: "rgba(255,255,255,0.7)" }}
            >
              Blockchain & Machine Learning for Fraud Detection
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#48aff0" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#48aff0" },
                },
              }}
              InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#48aff0" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#48aff0" },
                },
              }}
              InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
            />
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                background: "linear-gradient(90deg,#137cbd,#48aff0)",
                "&:hover": { background: "linear-gradient(90deg,#48aff0,#137cbd)" },
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {backendHtml && (
            <Box
              sx={{
                mt: 3,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                p: 2,
                maxHeight: 200,
                overflow: "auto",
                color: "#fff",
              }}
            >
              <Typography variant="h6" color="#48aff0">
                Backend Response:
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(backendHtml) }} />
            </Box>
          )}
        </Card>
      </motion.div>

      {/* Animations */}
      <style>
        {`
          @keyframes gradientAnimation {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }

          @keyframes cardGlow {
            0% {
              box-shadow: 0 0 20px rgba(72, 175, 240, 0.4), 0 0 40px rgba(72, 175, 240, 0.2);
            }
            50% {
              box-shadow: 0 0 30px rgba(72, 175, 240, 0.6), 0 0 60px rgba(72, 175, 240, 0.3);
            }
            100% {
              box-shadow: 0 0 20px rgba(72, 175, 240, 0.4), 0 0 40px rgba(72, 175, 240, 0.2);
            }
          }
        `}
      </style>
    </Box>
  );
}
