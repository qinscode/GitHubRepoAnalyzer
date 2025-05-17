import { Box } from "@mui/material";
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
      {value === index && <Box className="py-6">{children}</Box>}
    </div>
  );
}

export default TabPanel; 