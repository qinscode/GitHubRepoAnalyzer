import type { ReactNode } from "react";
import {
  Box,
  Typography,
  Fade,
} from "@mui/material";
import type { ThemeConfig } from './AnalysisThemes';

interface AnalysisTabLayoutProps {
  title: string;
  description: string;
  headerTitle: string;
  statsIcon: ReactNode;
  totalCount: number;
  creatorCount: number;
  creatorLabel: string;
  children: ReactNode;
  theme: ThemeConfig;
}

/**
 * Reusable layout component for analysis tabs
 */
const AnalysisTabLayout = ({
  title,
  description,
  headerTitle,
  statsIcon,
  totalCount,
  creatorCount,
  creatorLabel,
  children,
  theme,
}: AnalysisTabLayoutProps): JSX.Element => {
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
        <Box
          className="shine-effect"
          sx={{
            p: 2,
            mb: 4,
            borderRadius: "14px",
            background:
              `linear-gradient(135deg, ${theme.light}, ${theme.lighter.replace('0.05', '0.04')})`,
            border: `1px solid ${theme.light.replace('0.1', '0.15')}`,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                `radial-gradient(circle, ${theme.light} 0%, ${theme.light.replace('0.1', '0')} 70%)`,
              zIndex: 0,
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.textColor,
              mb: 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(107, 114, 128, 0.9)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: theme.textColor,
              mb: 2.5,
              position: "relative",
              paddingLeft: "16px",
              display: "inline-block",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "translateX(2px)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "18px",
                borderRadius: "2px",
                background: theme.gradient,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -5,
                left: 16,
                width: "40%",
                height: "2px",
                background: theme.gradient,
                transition: "width 0.3s ease",
              },
              "&:hover::after": {
                width: "80%",
              },
            }}
          >
            {headerTitle}
          </Typography>
        </Box>

        {children}

        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: "12px",
            border: `1px dashed ${theme.light.replace('0.1', '0.3')}`,
            backgroundColor: theme.lighter.replace('0.05', '0.03'),
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {statsIcon}
            <Typography
              sx={{ color: theme.textColor, fontWeight: 500 }}
              variant="body2"
            >
              Total {title.split(' ')[0]}: {totalCount}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              ml: 3.5,
              mt: 0.5,
              color: "text.secondary",
              opacity: 0.8,
            }}
          >
            {creatorCount > 0 ? `${creatorLabel} ${creatorCount} ${creatorCount === 1 ? 'user' : 'users'}` : 'No data available'}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default AnalysisTabLayout; 