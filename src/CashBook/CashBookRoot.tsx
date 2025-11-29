import { Box, Grid, Paper, Typography } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CashBook } from "./CashBook";
import { useAppStore, useEntriesForActiveDate } from "../store";
import { WarningRounded, CheckCircle } from "@mui/icons-material";
import { toLocaleRupeeString } from "../utils";

export function CashBookRoot() {
  const activeDate = useAppStore((state) => state.activeDate);
  const setActiveDate = useAppStore((state) => state.setActiveDate);
  const entries = useEntriesForActiveDate();
  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box
      sx={{
        borderTop: debitTotal === creditTotal ? "6px solid" : "none",
        borderColor: "success.dark",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={3}>
          <StaticDatePicker
            value={dayjs(activeDate)}
            onChange={(v) => setActiveDate(dayjs(v))}
            slots={{
              actionBar: () => null,
            }}
          />

          <Paper
            sx={{ p: 2, m: 2, border: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6">
              Balance: {toLocaleRupeeString(debitTotal - creditTotal)}
            </Typography>
            {debitTotal !== creditTotal && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <WarningRounded color="warning" />
                <Typography variant="body2" color="warning.main">
                  Warning: Debit and Credit totals do not match!
                </Typography>
              </Box>
            )}
            {debitTotal === creditTotal && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <CheckCircle color="success" />
                <Typography variant="body2" color="success.main">
                  Debit and Credit totals are balanced.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid size={9} height="calc(100vh - 72px)" overflow="auto">
          <CashBook />
        </Grid>
      </Grid>
    </Box>
  );
}
