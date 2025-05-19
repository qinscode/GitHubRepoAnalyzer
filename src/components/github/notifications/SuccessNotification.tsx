import { Snackbar, Alert, Zoom } from "@mui/material";

interface SuccessNotificationProps {
  open: boolean;
  onClose: () => void;
}

const SuccessNotification = ({ open, onClose }: SuccessNotificationProps) => {
  return (
    <Snackbar
      TransitionComponent={Zoom}
      autoHideDuration={5000}
      open={open}
      onClose={onClose}
    >
      <Alert
        className="custom-alert success"
        severity="success"
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
        Repositories analyzed successfully!
      </Alert>
    </Snackbar>
  );
};

export default SuccessNotification; 