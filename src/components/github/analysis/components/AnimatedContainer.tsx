import { Box, Fade } from "@mui/material";
import type { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
}

/**
 * Container with fade-in animation
 */
const AnimatedContainer = ({ children }: AnimatedContainerProps): JSX.Element => {
  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: "relative",
          animation: "fadeIn 0.5s ease-out forwards",
          opacity: 0,
          "@keyframes fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};

export default AnimatedContainer; 