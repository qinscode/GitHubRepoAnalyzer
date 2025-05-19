import { Alert, Fade } from "@mui/material";

interface ErrorNotificationProps {
  error: string | null;
  onClose: () => void;
}

const ErrorNotification = ({ error, onClose }: ErrorNotificationProps) => {
  if (!error) return null;
  
  return (
    <Fade in={!!error} timeout={{ enter: 300, exit: 200 }}>
      <Alert
        className="mb-5 rounded-lg custom-alert error"
        severity="error"
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          ".MuiAlert-icon": {
            color: "white",
          },
          ".MuiAlert-message": {
            color: "white",
            fontWeight: "500",
          },
        }}
        onClose={onClose}
      >
        {error}
      </Alert>
    </Fade>
  );
};

export default ErrorNotification; 