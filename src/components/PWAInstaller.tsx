import React from "react";
import { Button } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import usePWAInstall from "react-pwa-install-prompt";

export const PWAInstaller: React.FC = () => {
  const { isInstallPromptSupported, promptInstall } = usePWAInstall();

  // Don't show button if already installed or not supported
  if (!isInstallPromptSupported) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      startIcon={<GetApp />}
      onClick={promptInstall}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        bgcolor: "background.paper",
        zIndex: 1000,
      }}
    >
      Install App
    </Button>
  );
};
