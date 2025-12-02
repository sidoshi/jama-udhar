import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CashBookRoot } from "./CashBook/CashBookRoot";
import CmdK from "./CmdK";
import { useAppStore } from "./store";
import dayjs from "dayjs";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Layout() {
  const activeDate = useAppStore((state) => state.activeDate);
  const setActiveDate = useAppStore((state) => state.setActiveDate);

  return (
    <Box>
      <Box
        p={2}
        borderBottom="1px solid gray"
        justifyContent="space-between"
        display="flex"
        alignItems="center"
      >
        <Typography variant="h5">Chandan Hisab</Typography>

        <DatePicker
          value={dayjs(activeDate)}
          format="DD MMM, YYYY"
          onChange={(v) => setActiveDate(dayjs(v))}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
      </Box>

      <CashBookRoot />
      <CmdK />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Layout />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
