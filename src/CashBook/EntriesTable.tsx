import { Box, Paper, Grid, Typography, Divider } from "@mui/material";
import type { Entry } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { Row } from "./Row";

type TableProps = {
  id: string;
  title: string;
  type: "debit" | "credit";
  entries: Entry[];
};

export function EntriesTable({ title, entries, type }: TableProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 300 }}>
      <Paper
        id={`${type}-entries-table`}
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            p: 2,
            pb: 0,
          }}
        >
          <Grid container>
            <Grid container size={12} px={0}>
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {title}
                </Typography>
              </Grid>
              <Grid size={6} textAlign="left">
                <Typography variant="subtitle1" fontWeight="bold">
                  Amount
                </Typography>
              </Grid>
            </Grid>

            {/* Total Section */}
            <Grid container size={12} px={0} py={1}>
              <Grid size={6}>
                <Typography variant="h6" fontWeight="bold" sx={{}}>
                  Total
                </Typography>
              </Grid>
              <Grid size={6} textAlign="left">
                <Typography variant="h6" fontWeight="bold" sx={{}}>
                  {toLocaleRupeeString(
                    entries.reduce((sum, e) => sum + e.amount, 0),
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
          </Grid>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
            pb: 2,
          }}
        >
          <Grid container>
            {entries.length === 0 && (
              <Grid size={12} py={10} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  No entries available.
                </Typography>
              </Grid>
            )}

            {entries.map((entry) => (
              <Row key={entry.id} entry={entry} />
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
