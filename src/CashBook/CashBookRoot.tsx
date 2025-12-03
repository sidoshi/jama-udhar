import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Button,
  ButtonGroup,
} from "@mui/material";
import { CashBook } from "./CashBook";
import {
  useActivityLogForActiveDate,
  useEntriesForActiveDate,
  useUndoRedo,
} from "../store";
import {
  WarningRounded,
  CheckCircle,
  Stars,
  Redo,
  Undo,
} from "@mui/icons-material";
import { toLocaleRupeeString } from "../utils";
import { Celebration } from "../components/Celebration";
import { useAtom } from "jotai";
import { celebrationEnabledAtom } from "../store/slices/cashBookSlice";
import { ActivityLogEntry } from "./ActivityLog";

export function CashBookRoot() {
  const entries = useEntriesForActiveDate();
  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);
  const recentActivity = useActivityLogForActiveDate();
  const [celebrationEnabled, setCelebrationEnabled] = useAtom(
    celebrationEnabledAtom
  );

  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const isBalanced = debitTotal + creditTotal === 0 && creditTotal > 0;

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
        <Grid size={3} height="calc(100vh - 79px)" overflow="auto">
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
                Balance: {toLocaleRupeeString(debitTotal + creditTotal)}
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
            {!isBalanced && creditTotal > 0 && (
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
              height: "calc(100% - 160px)",
              overflowY: "auto",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
              mb={2}
            >
              <Typography variant="h6">Recent Activity</Typography>
              <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button
                  onClick={() => undo()}
                  disabled={!canUndo}
                  color="primary"
                >
                  <Undo />
                </Button>

                <Button
                  onClick={() => redo()}
                  disabled={!canRedo}
                  color="primary"
                >
                  <Redo />
                </Button>
              </ButtonGroup>
            </Box>

            {recentActivity.length === 0 && (
              <>
                <Divider />
                <Box p={1}>
                  <Typography variant="body2" color="textSecondary">
                    No recent activity.
                  </Typography>
                </Box>
                <Divider />
              </>
            )}

            {recentActivity.map((log) => (
              <ActivityLogEntry log={log} key={log.id} />
            ))}
          </Paper>
        </Grid>
        <Grid size={9} height="calc(100vh - 79px)" overflow="auto">
          <CashBook />
        </Grid>
      </Grid>
    </Box>
  );
}
