import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Container,
  TablePagination,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

// Define the base URL for your backend
const BASE_URL = "https://orangedynasty.global";

interface UserStats {
  user: { id: number; email: string; referralCode: string; isVerified: boolean };
  stats: { totalReferrals: number; verifiedReferrals: number; points: number };
  referralLink: string;
}

interface LeaderboardEntry {
  id: number;
  email: string;
  verifiedReferrals: number;
  points: number;
}

const Dashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        if (!userId) {
          setError("User ID is required");
          return;
        }
        // Use full URL instead of relative path
        const statsRes = await axios.get(`${BASE_URL}/epi/waitlist/user/${userId}`);
        setStats(statsRes.data);
      } catch (err: any) {
        console.error("User stats fetch error:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load user stats");
      }
    };

    const fetchLeaderboard = async () => {
      try {
        if (!userId) {
          setError("User ID is required");
          return;
        }
        // Use full URL instead of relative path
        const leaderboardRes = await axios.get(`${BASE_URL}/epi/waitlist/leaderboard?userId=${userId}`);
        setLeaderboard(leaderboardRes.data.leaderboard || []);
      } catch (err: any) {
        console.error("Leaderboard fetch error:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStats();
      fetchLeaderboard();
    } else {
      setError("User ID is required");
      setLoading(false);
    }
  }, [userId]);

  const copyReferralLink = async () => {
    if (stats?.referralLink) {
      try {
        await navigator.clipboard.writeText(stats.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy referral link:", err);
        const textArea = document.createElement("textarea");
        textArea.value = stats.referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ minHeight: "100vh", py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h6" textAlign="center">
            Loading...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom textAlign="center">
            Waitlist Dashboard
          </Typography>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          {stats && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Your Stats
                </Typography>
                <Typography variant="body1">Email: {stats.user.email}</Typography>
                <Typography variant="body1">
                  Status: {stats.user.isVerified ? "Verified" : "Unverified"}
                </Typography>
                <Typography variant="body1">Total Referrals: {stats.stats.totalReferrals}</Typography>
                <Typography variant="body1">Verified Referrals: {stats.stats.verifiedReferrals}</Typography>
                <Typography variant="body1">Points: {stats.stats.points}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Referral Link: 
                    <Box component="span" sx={{ wordBreak: "break-all", ml: 1 }}>
                      {stats.referralLink}
                    </Box>
                  </Typography>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={copyReferralLink}
                      sx={{ mt: 1, width: { xs: "100%", sm: "auto" } }}
                    >
                      {copied ? "Copied!" : "Copy Referral Link"}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Leaderboard
                </Typography>
                {leaderboard.length === 0 ? (
                  <Typography variant="body1">No leaderboard data available.</Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="leaderboard table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Rank</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Verified Referrals</TableCell>
                          <TableCell>Points</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {leaderboard
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((entry, index) => (
                            <TableRow
                              key={entry.id}
                              component={motion.tr}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              sx={{
                                bgcolor: entry.id === stats.user.id ? "rgba(255, 255, 0, 0.1)" : "inherit",
                                '&:hover': {
                                  bgcolor: entry.id === stats.user.id ? "rgba(255, 255, 0, 0.2)" : "rgba(0, 0, 0, 0.04)"
                                }
                              }}
                            >
                              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                              <TableCell>{entry.email}</TableCell>
                              <TableCell>{entry.verifiedReferrals}</TableCell>
                              <TableCell>{entry.points}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={leaderboard.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                )}
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
