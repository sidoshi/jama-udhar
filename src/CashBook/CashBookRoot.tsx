import { Grid } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CashBook } from "./CashBook";
import { useAppStore } from "../store";

export function CashBookRoot() {
  const activeDate = useAppStore((state) => state.activeDate);
  const setActiveDate = useAppStore((state) => state.setActiveDate);

  return (
    <Grid container spacing={2}>
      <Grid size={3}>
        <StaticDatePicker
          value={dayjs(activeDate)}
          onChange={(v) => setActiveDate(dayjs(v))}
          slots={{
            actionBar: () => null,
          }}
        />
      </Grid>
      <Grid size={9} p={2}>
        <CashBook />
      </Grid>
    </Grid>
  );
}
