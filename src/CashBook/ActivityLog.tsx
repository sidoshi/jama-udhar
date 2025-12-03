import { Divider, Box, Typography } from "@mui/material";
import type { ActivityLog } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";

export function ActivityLogEntry({ log }: { log: ActivityLog }) {
  const getDiffAmount = () => {
    if (log.kind === "update" && log.oldAmount && log.newAmount) {
      return log.newAmount - log.oldAmount;
    }
    return 0;
  };

  const getDiffColor = () => {
    const diff = getDiffAmount();
    if (diff > 0) return "success.main";
    if (diff < 0) return "error.main";
    return "text.secondary";
  };

  return (
    <>
      <Divider />
      <Box p={2}>
        {log.kind === "add" && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="success.main"
              >
                ADDED ENTRY
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
              <strong>{log.account}</strong> • {toLocaleRupeeString(log.amount)}
            </Typography>
          </Box>
        )}

        {log.kind === "delete" && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "error.main",
                }}
              />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="error.main"
              >
                DELETED ENTRY
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
              <strong>{log.account}</strong> • {toLocaleRupeeString(log.amount)}
            </Typography>
          </Box>
        )}

        {log.kind === "update" && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "info.main",
                }}
              />
              <Typography variant="body2" fontWeight="medium" color="info.main">
                UPDATED ENTRY
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ ml: 2, mb: 0.5 }}
            >
              <strong>{log.account}</strong>
            </Typography>
            <Box
              sx={{ ml: 2 }}
              display="flex"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
            >
              <Typography variant="body2" color="text.secondary">
                {toLocaleRupeeString(log.oldAmount)}
              </Typography>
              <Typography
                variant="body2"
                color={getDiffColor()}
                fontWeight="medium"
              >
                {getDiffAmount() > 0 ? "+" : ""}
                {toLocaleRupeeString(getDiffAmount())}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                =
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                fontWeight="medium"
              >
                {toLocaleRupeeString(log.newAmount)}
              </Typography>
            </Box>
          </Box>
        )}

        {log.kind === "init" && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="primary.main"
              >
                INITIALIZED
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
              New hisab from <strong>{log.date}</strong>
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
    </>
  );
}
