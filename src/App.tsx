import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CashBookRoot } from "./CashBook/CashBookRoot";
import CmdK from "./CmdK";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Layout() {
  return (
    <Box>
      <Box p={2} borderBottom="1px solid gray">
        <Typography variant="h5">Chandan Hisab</Typography>
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
