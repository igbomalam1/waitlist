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
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setError("");
    setMessage("");
    setLoadingJoin(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoadingJoin(false);
        return;
      }

      const response = await axios.post("/epi/waitlist/join", { 
        email: email.trim(), 
        referralCode: referralCode.trim() 
      });
      
      setUserId(response.data.userId);
      
      if (response.data.redirectToDashboard) {
        setMessage("Email already registered and verified! Redirecting to dashboard...");
        setTimeout(() => navigate(`/waitlist/dashboard/${response.data.userId}`), 2000);
      } else if (response.data.promptVerification) {
        setMessage("Email already registered but not verified. Please enter your verification code.");
        setIsVerifying(true);
      } else {
        setMessage("Verification code sent to your email! Please check your inbox.");
        setIsVerifying(true);
      }
    } catch (err: any) {
      console.error("Join waitlist error:", err.response?.data);
      
      // Handle different error scenarios
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid email or referral code");
      } else if (err.response?.status === 409) {
        setError("Email already exists. Please use a different email or verify your existing account.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Failed to join waitlist. Please try again.");
      }
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setError("");
    setMessage("");
    setLoadingVerify(true);

    try {
      // Validate verification code
      if (!code.trim()) {
        setError("Please enter your verification code");
        setLoadingVerify(false);
        return;
      }

      await axios.post("/epi/waitlist/verify", { 
        email: email.trim(), 
        code: code.trim() 
      });
      
      setMessage("Email verified successfully! Redirecting to dashboard...");
      setTimeout(() => {
        if (userId) {
          navigate(`/waitlist/dashboard/${userId}`);
        } else {
          setError("User ID not found. Please try joining the waitlist again.");
        }
      }, 2000);
    } catch (err: any) {
      console.error("Verify email error:", err.response?.data);
      
      // Handle different error scenarios
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid verification code");
      } else if (err.response?.status === 404) {
        setError("User not found. Please join the waitlist first.");
      } else if (err.response?.status === 409) {
        setError("Email already verified. Redirecting to dashboard...");
        if (userId) {
          setTimeout(() => navigate(`/waitlist/dashboard/${userId}`), 2000);
        }
      } else {
        setError(err.response?.data?.message || "Failed to verify email. Please try again.");
      }
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
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
            {isVerifying ? "Verify Your Email" : "Join Waitlist"}
          </Typography>

          {/* Show referral code if present */}
          {referralCode && !isVerifying && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
              <Typography variant="body2" textAlign="center">
                You're joining with referral code: <strong>{referralCode}</strong>
              </Typography>
            </Box>
          )}

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
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                required
                variant="outlined"
                disabled={loadingJoin}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              
              <motion.div whileHover={{ scale: loadingJoin ? 1 : 1.05 }} whileTap={{ scale: loadingJoin ? 1 : 0.95 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  disabled={loadingJoin || !email.trim()}
                >
                  {loadingJoin ? "Joining..." : "Join Waitlist"}
                </Button>
              </motion.div>
              
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Already have an account? <Link to="/get-code" style={{ color: "primary.main" }}>Get your verification code</Link>
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerify} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}>
                We've sent a verification code to <strong>{email}</strong>
              </Typography>
              
              <TextField
                label="Verification Code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                fullWidth
                required
                variant="outlined"
                disabled={loadingVerify}
                placeholder="Enter your verification code"
                autoComplete="off"
              />
              
              <motion.div whileHover={{ scale: loadingVerify ? 1 : 1.05 }} whileTap={{ scale: loadingVerify ? 1 : 0.95 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  disabled={loadingVerify || !code.trim()}
                >
                  {loadingVerify ? "Verifying..." : "Verify Email"}
                </Button>
              </motion.div>
              
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Didn't receive a code? <Link to="/get-code" style={{ color: "primary.main" }}>Resend verification code</Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default JoinWaitlist;
