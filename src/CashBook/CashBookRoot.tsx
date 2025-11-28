import { Grid } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";

export function CashBookRoot() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <Grid container spacing={2}>
      <Grid size={3}>
        <StaticDatePicker
          value={selectedDate}
          onChange={(v) => setSelectedDate(dayjs(v))}
          slots={{
            actionBar: () => null,
          }}
        />
      </Grid>
      <Grid size={9}></Grid>
    </Grid>
  );
}
