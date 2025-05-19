import { Box, Fade } from "@mui/material";
import React, { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
}

/**
 * Container with fade-in animation
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children }) => {
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