import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { CashBook } from "./CashBook";
import { useEntriesForActiveDate } from "../store";
import { WarningRounded, CheckCircle, Stars } from "@mui/icons-material";
import { toLocaleRupeeString } from "../utils";
import { Celebration } from "../components/Celebration";
import { useAtom } from "jotai";
import { celebrationEnabledAtom } from "../store/slices/cashBookSlice";

export function CashBookRoot() {
  const entries = useEntriesForActiveDate();
  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);
  const [celebrationEnabled, setCelebrationEnabled] = useAtom(
    celebrationEnabledAtom
  );

  const isBalanced = debitTotal === creditTotal && debitTotal > 0;

  return (
    <Box
      sx={{
        borderTop: isBalanced ? "6px solid" : "none",
        borderColor: "success.dark",
        transition: "all 0.5s ease-in-out",
        ...(isBalanced && {
          borderImage: "linear-gradient(90deg, #4caf50, #66bb6a, #4caf50) 1",
          animation: "borderGlow 3s ease-in-out infinite",
          "@keyframes borderGlow": {
            "0%": { borderColor: "#4caf50" },
            "50%": { borderColor: "#66bb6a" },
            "100%": { borderColor: "#4caf50" },
          },
        }),
      }}
    >
      <Celebration trigger={isBalanced} enabled={celebrationEnabled} />
      <Grid container spacing={2}>
        <Grid size={3} height="calc(100vh - 73px)" overflow="auto">
          <Paper
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "background.paper",
              zIndex: 1,
              p: 2,
              m: 2,
              border: "1px solid",
              borderColor: isBalanced ? "success.main" : "divider",
              boxShadow: isBalanced ? "0 0 20px rgba(76, 175, 80, 0.3)" : 1,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Balance: {toLocaleRupeeString(debitTotal - creditTotal)}
              </Typography>
              <Tooltip
                title={`${
                  celebrationEnabled ? "Disable" : "Enable"
                } celebration effects`}
              >
                <IconButton
                  onClick={() => setCelebrationEnabled(!celebrationEnabled)}
                  color={celebrationEnabled ? "primary" : "default"}
                  size="small"
                >
                  <Stars />
                </IconButton>
              </Tooltip>
            </Box>
            {!isBalanced && debitTotal > 0 && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <WarningRounded color="warning" />
                <Typography variant="body2" color="warning.main">
                  Unbalanced Entries!
                </Typography>
              </Box>
            )}
            {isBalanced && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <CheckCircle color="success" />
                <Typography
                  variant="body2"
                  color="success.main"
                  fontWeight="bold"
                >
                  Perfect Balance!
                </Typography>
              </Box>
            )}
          </Paper>
          <Paper
            sx={{
              p: 2,
              m: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" mb={2}>
              Recent Activity
            </Typography>

            <Divider />
            <Box p={1}>
              <Typography variant="body1">MANISH</Typography>
              <Typography variant="body2" color="textSecondary">
                BEFORE: 30,000 | AFTER: 20,000
              </Typography>
            </Box>
            <Divider />
          </Paper>
        </Grid>
        <Grid size={9} height="calc(100vh - 73px)" overflow="auto">
          <CashBook />
        </Grid>
      </Grid>
    </Box>
  );
}
