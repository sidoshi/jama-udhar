import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showOfflineAlert, setShowOfflineAlert] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOfflineAlert(true);
    }
  }, [isOnline]);

  const handleClose = () => {
    setShowOfflineAlert(false);
  };

  return (
    <Snackbar
      open={showOfflineAlert && !isOnline}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
        You're offline. Don't worry - your cash book is still available and your
        changes will sync when you're back online!
      </Alert>
    </Snackbar>
  );
};
