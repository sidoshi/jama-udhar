import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CashBookRoot } from "./CashBook/CashBookRoot";
import CmdK from "./CmdK";
import { useAppStore } from "./store";
import dayjs from "dayjs";
import { handlePDFRestore } from "./pdfRestore";
import { useSetAtom } from "jotai";
import { printPdfAtom } from "./store/slices/cashBookSlice";
import { PWAInstaller } from "./components/PWAInstaller";
import { OfflineIndicator } from "./components/OfflineIndicator";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Layout() {
  const activeDate = useAppStore((state) => state.activeDate);
  const setActiveDate = useAppStore((state) => state.setActiveDate);
  const setIsPrinting = useSetAtom(printPdfAtom);

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

        <Box display="flex" gap={1}>
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button
              variant="outlined"
              onClick={handlePDFRestore}
              color="primary"
            >
              Restore from PDF
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsPrinting(true)}
              color="primary"
            >
              Print / Export PDF
            </Button>
          </ButtonGroup>

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
        <PWAInstaller />
        <OfflineIndicator />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
