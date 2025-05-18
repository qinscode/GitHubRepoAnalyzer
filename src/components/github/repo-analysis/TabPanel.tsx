import { Box, Fade } from "@mui/material";
import type { TabPanelProps } from "./types";

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`repo-tab-${index}`}
      hidden={value !== index}
      id={`repo-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box 
          className="py-6 relative z-10"
          sx={{
            animation: value === index ? 'fadeInUp 0.4s ease-out forwards' : 'none',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel; 