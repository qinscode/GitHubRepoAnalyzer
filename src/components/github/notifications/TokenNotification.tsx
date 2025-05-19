import { Snackbar, Alert, Zoom } from "@mui/material";

interface TokenMessageProps {
  message: string;
  severity: "success" | "error" | "info";
}

interface TokenNotificationProps {
  tokenMessage: TokenMessageProps | null;
  onClose: () => void;
}

const TokenNotification = ({ 
  tokenMessage, 
  onClose 
}: TokenNotificationProps) => {
  return (
    <Snackbar
      TransitionComponent={Zoom}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={3000}
      open={tokenMessage !== null}
      onClose={onClose}
    >
      <Alert
        className={tokenMessage ? `custom-alert ${tokenMessage.severity}` : ""}
        severity={tokenMessage?.severity || "info"}
        sx={{
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          color: "white",
          ".MuiAlert-icon": {
            color: "white",
          },
        }}
        onClose={onClose}
      >
        {tokenMessage?.message || ""}
      </Alert>
    </Snackbar>
  );
};

export default TokenNotification; 