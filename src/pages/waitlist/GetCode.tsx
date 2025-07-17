import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";

// Define the base URL for your backend
const BASE_URL = "https://orangedynasty.global";

const GetCode: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setError("");
    setMessage("");
    setCode("");
    setLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Make API call with proper query parameter and full URL
      const response = await axios.get(`${BASE_URL}/epi/waitlist/code`, { 
        params: { email: email.trim() } 
      });
      
      // Check if response has the expected structure
      if (response.data && response.data.verificationCode) {
        setCode(response.data.verificationCode);
        setMessage("Your verification code is displayed below.");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      console.error("Get code error:", err.response?.data);
      
      // Handle different error scenarios
      if (err.response?.status === 404) {
        setError("Email not found. Please make sure you've joined the waitlist first.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid email address");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Failed to get verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom textAlign="center">
            Get Verification Code
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
            Enter your email address to retrieve your verification code
          </Typography>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            </motion.div>
          )}
          
          <Box component="form" onSubmit={handleGetCode} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              required
              variant="outlined"
              disabled={loading}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            
            <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading || !email.trim()}
              >
                {loading ? "Getting Code..." : "Get Code"}
              </Button>
            </motion.div>
          </Box>
          
          {code && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 3, p: 2, bgcolor: "success.light", borderRadius: 1, textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "success.contrastText", mb: 1 }}>
                  Your Verification Code
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "monospace", color: "success.contrastText", mb: 1 }}>
                  {code}
                </Typography>
                <Typography variant="body2" sx={{ color: "success.contrastText" }}>
                  Use this code to verify your email address
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Return to <Link to="/waitlist" style={{ color: "primary.main" }}>Join Waitlist</Link> to enter your code.
                </Typography>
              </Box>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default GetCode;
