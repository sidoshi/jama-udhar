import { Box, Paper, Grid, Typography, Divider } from "@mui/material";
import type { Entry } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { DNDRow } from "./DNDRow";

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
            <Grid container size={12} px={1}>
              <Grid size={7}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {title}
                </Typography>
              </Grid>
              <Grid size={5} textAlign="left">
                <Typography variant="subtitle1" fontWeight="bold">
                  Amount
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
              <DNDRow key={entry.id} entry={entry} />
            ))}
          </Grid>
        </Box>

        {/* Sticky Footer */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            p: 2,
            pt: 1,
            textAlign: "right",
            borderTop: 1,
            color: type === "debit" ? "error.dark" : "success.dark",
            borderColor: "divider",
            borderBottom: "1px solid",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Total:{" "}
            {toLocaleRupeeString(entries.reduce((sum, e) => sum + e.amount, 0))}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
