import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";

const GetCode: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/waitlist/code`, { params: { email } });
      setCode(response.data.verificationCode);
      setMessage("Your verification code is displayed below.");
      setError("");
    } catch (err: any) {
      console.error("Get code error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to get verification code");
      setCode("");
    }
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              variant="outlined"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Get Code
              </Button>
            </motion.div>
          </Box>
          {code && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body1">
                Your verification code is: <strong>{code}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Return to <Link to="/waitlist">Join Waitlist</Link> to enter your code.
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default GetCode;
