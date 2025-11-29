import { Box, Paper, Grid, Typography, Divider } from "@mui/material";
import type { Entry } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { AddEntryForm } from "./AddEntryForm";
import { DNDRow } from "./DNDRow";

type TableProps = {
  id: string;
  title: string;
  type: Entry["type"];
  entries: Entry[];
};

export function EntriesTable({ title, entries, type }: TableProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 300 }}>
      <Paper
        sx={{
          p: 2,
          minHeight: 400,
        }}
      >
        <AddEntryForm type={type} />
        <Grid container>
          <Grid container size={12} px={1}>
            <Grid size={8}>
              <Typography variant="subtitle1" fontWeight="bold">
                {title}
              </Typography>
            </Grid>
            <Grid size={4} textAlign="right">
              <Typography variant="subtitle1" fontWeight="bold">
                Amount
              </Typography>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {entries.length === 0 && (
            <Grid size={12} py={10} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                No entries available.
              </Typography>
            </Grid>
          )}

          {entries.reverse().map((entry) => (
            <DNDRow key={entry.id} entry={entry} />
          ))}
        </Grid>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="h4" fontWeight="bold">
            Total:{" "}
            {toLocaleRupeeString(entries.reduce((sum, e) => sum + e.amount, 0))}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
