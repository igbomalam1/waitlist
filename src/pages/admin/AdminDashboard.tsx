import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Grid,
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
} from "@mui/material";
import { motion } from "framer-motion";

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

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const response = await axios.get(`/epi/waitlist/admin/dashboard?page=${page + 1}&limit=${rowsPerPage}`);
        setStats(response.data.stats);
        setLeaderboard(response.data.leaderboard || []);
        setTotal(response.data.total || 0);
        setError("");
      } catch (err: any) {
        console.error("Admin dashboard fetch error:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load admin dashboard");
      }
    };
    fetchAdminDashboard();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              <Box sx={{ mb: 2 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            </motion.div>
          )}
          {stats && (
            <>
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "primary.light", color: "white" }}>
                      <CardContent>
                        <Typography variant="h6">Total Waitlisted</Typography>
                        <Typography variant="h4">{stats.totalWaitlisted}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "success.light", color: "white" }}>
                      <CardContent>
                        <Typography variant="h6">Verified Waitlisted</Typography>
                        <Typography variant="h4">{stats.verifiedWaitlisted}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "warning.light", color: "white" }}>
                      <CardContent>
                        <Typography variant="h6">Unverified Waitlisted</Typography>
                        <Typography variant="h4">{stats.unverifiedWaitlisted}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "info.light", color: "white" }}>
                      <CardContent>
                        <Typography variant="h6">Total Points Distributed</Typography>
                        <Typography variant="h4">{stats.totalPoints}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Leaderboard
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="leaderboard table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Referral Code</TableCell>
                        <TableCell>Verified Referrals</TableCell>
                        <TableCell>Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.map((entry, index) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{entry.referralCode}</TableCell>
                          <TableCell>{entry.verifiedReferrals}</TableCell>
                          <TableCell>{entry.points}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;