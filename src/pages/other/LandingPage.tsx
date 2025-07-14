import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Waitlist Testnet
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            Created by DEV I
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            How to Use the Waitlist Testnet
          </Typography>
          <List sx={{ textAlign: "left", maxWidth: 600, mx: "auto" }}>
            <ListItem>
              <ListItemText
                primary="Step 1: Use a Temporary Email"
                secondary={
                  <>
                    For testing, please use a temporary email to avoid using personal information. We recommend using a Telegram-based temporary email service like Temp-Mail Bot:
                    <br />
                    - Open Telegram and search for <strong>@TempMailBot</strong>.
                    - Start the bot and type <strong>/generate</strong> to get a temporary email address (e.g., example@tempmail.com).
                    - Use this email to join the waitlist.
                    - Check the bot for incoming emails by typing <strong>/inbox</strong>.
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Step 2: Join the Waitlist"
                secondary="Click the button below to go to the waitlist page and sign up with your temporary email."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Step 3: Verify Your Email"
                secondary="After joining, you'll receive a verification code via email. Enter the code within 30 minutes to verify your email."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Step 4: Refer Yourself"
                secondary="Once verified, copy your referral link from the dashboard and use it to refer yourself (using another temporary email) to test the referral system and see points distributed."
              />
            </ListItem>
          </List>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/waitlist")}
              sx={{ mt: 2 }}
            >
              Join Waitlist
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LandingPage;