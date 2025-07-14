import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";

const JoinWaitlist: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/waitlist/join", { email, referralCode });
      setUserId(response.data.userId);
      if (response.data.redirectToDashboard) {
        setMessage("Email already registered, redirecting to dashboard...");
        setTimeout(() => navigate(`/waitlist/dashboard/${response.data.userId}`), 2000);
      } else if (response.data.promptVerification) {
        setMessage("Email already registered, please enter your verification code.");
        setIsVerifying(true);
      } else {
        setMessage("Verification code sent to your email!");
        setIsVerifying(true);
      }
      setError("");
    } catch (err: any) {
      console.error("Join waitlist error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to join waitlist");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/waitlist/verify", { email, code });
      setMessage("Email verified! Redirecting to dashboard...");
      setTimeout(() => navigate(`/waitlist/dashboard/${userId}`), 2000);
    } catch (err: any) {
      console.error("Verify email error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to verify email");
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
            {isVerifying ? "Verify Your Email" : "Join Waitlist"}
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
          {!isVerifying ? (
            <Box component="form" onSubmit={handleJoin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                  Join Waitlist
                </Button>
              </motion.div>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Didn't get a code? <Link to="/get-code">Click here to query your code</Link>
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerify} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Verify Email
                </Button>
              </motion.div>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Didn't get a code? <Link to="/get-code">Click here to query your code</Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default JoinWaitlist;