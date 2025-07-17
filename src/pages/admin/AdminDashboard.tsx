import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

// Define the base URL for your backend
const BASE_URL = "https://orangedynasty.global";

interface AdminStats {
  totalWaitlisted: number;
  verifiedWaitlisted: number;
  unverifiedWaitlisted: number;
  totalPoints: number;
}

interface LeaderboardEntry {
  id: number;
  referralCode: string;
  verifiedReferrals: number;
  points: number;
}

interface AdminDashboardResponse {
  stats: AdminStats;
  leaderboard: LeaderboardEntry[];
  total?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Use full URL instead of relative path
        const response = await axios.get(`${BASE_URL}/epi/waitlist/admin/dashboard`);
        
        const data: AdminDashboardResponse = response.data;
        
        setStats(data.stats);
        setLeaderboard(data.leaderboard || []);
      } catch (err: any) {
        console.error("Admin dashboard fetch error:", err.response?.data);
        
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login as admin.");
        } else if (err.response?.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response?.data?.message || "Failed to load admin dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLeaderboard = leaderboard.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ minHeight: "100vh", py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading admin dashboard...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom textAlign="center">
            Admin Dashboard
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
                  Overview Statistics
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Card sx={{ bgcolor: "primary.main", color: "white", width: "100%" }}>
                        <CardContent>
                          <Typography variant="h6">Total Waitlisted</Typography>
                          <Typography variant="h4">{stats.totalWaitlisted}</Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Card sx={{ bgcolor: "success.main", color: "white", width: "100%" }}>
                        <CardContent>
                          <Typography variant="h6">Verified Users</Typography>
                          <Typography variant="h4">{stats.verifiedWaitlisted}</Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Card sx={{ bgcolor: "warning.main", color: "white", width: "100%" }}>
                        <CardContent>
                          <Typography variant="h6">Unverified Users</Typography>
                          <Typography variant="h4">{stats.unverifiedWaitlisted}</Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Card sx={{ bgcolor: "info.main", color: "white", width: "100%" }}>
                        <CardContent>
                          <Typography variant="h6">Total Points</Typography>
                          <Typography variant="h4">{stats.totalPoints}</Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>
                  Top Referrers Leaderboard
                </Typography>
                
                {leaderboard.length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
                    No leaderboard data available.
                  </Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="admin leaderboard table">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Rank</strong></TableCell>
                          <TableCell><strong>Referral Code</strong></TableCell>
                          <TableCell><strong>Verified Referrals</strong></TableCell>
                          <TableCell><strong>Points</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedLeaderboard.map((entry, index) => (
                          <TableRow
                            key={entry.id}
                            component={motion.tr}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                              '&:hover': { bgcolor: 'action.selected' }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {entry.referralCode}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">
                                {entry.verifiedReferrals}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold" color="primary">
                                {entry.points}
                              </Typography>
                            </TableCell>
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

export default AdminDashboard;
