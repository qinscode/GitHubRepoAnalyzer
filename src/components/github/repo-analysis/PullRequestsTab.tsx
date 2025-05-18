import { useMemo, useState } from "react";
import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Fade,
  Grow,
  alpha,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, MergeType as PRIcon } from "@mui/icons-material";
import type { RepoData } from "./types";

interface PullRequestsTabProps {
  data: RepoData;
}

// 定义主题色
const colors = {
  main: "#F59E0B", // amber
  light: "rgba(245, 158, 11, 0.1)",
  lighter: "rgba(245, 158, 11, 0.05)",
  gradient: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
};

function UserPullRequests({ 
  user, 
  prs,
  index
}: { 
  user: string; 
  prs: Array<{ title: string }>;
  index: number;
}): JSX.Element {
  const [expanded, setExpanded] = useState(prs.length <= 5);

  const handleChange = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Grow in timeout={800 + index * 150}>
      <Accordion
        expanded={expanded}
        sx={{ 
          mb: 2.5, 
          borderRadius: "12px !important",
          overflow: "hidden",
          boxShadow: expanded 
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
          backdropFilter: "blur(8px)",
          "&:before": {
            display: "none",
          },
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)",
          }
        }}
        onChange={handleChange}
      >
        <AccordionSummary 
          expandIcon={
            <ExpandMoreIcon 
              sx={{ 
                color: colors.main,
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }} 
            />
          }
          sx={{
            background: expanded 
              ? `linear-gradient(to right, ${colors.lighter}, rgba(249, 250, 251, 0.8))`
              : "transparent",
            borderLeft: `4px solid ${colors.main}`,
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  mr: 2,
                  background: colors.gradient,
                  fontSize: "0.9rem",
                  boxShadow: `0 2px 5px ${alpha(colors.main, 0.4)}`,
                }}
              >
                {user.charAt(0).toUpperCase()}
              </Avatar>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "rgba(55, 65, 81, 0.9)",
                }}
              >
                {user}
              </Typography>
            </Box>
            <Chip
              icon={<PRIcon style={{ fontSize: "0.9rem" }} />}
              label={`${prs.length} PRs`}
              size="small"
              sx={{ 
                ml: 2,
                background: colors.gradient,
                color: "white",
                fontWeight: 500,
                boxShadow: "0 2px 5px rgba(245, 158, 11, 0.2)",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Fade in={expanded} timeout={500}>
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{
                borderRadius: 0,
                "& .MuiTable-root": {
                  borderCollapse: "separate",
                  borderSpacing: "0",
                },
              }}
            >
              <Table size="small">
                <TableHead sx={{ 
                  background: `linear-gradient(to right, ${colors.lighter}, rgba(248, 250, 252, 0.8))`
                }}>
                  <TableRow>
                    <TableCell 
                      width="10%" 
                      sx={{ 
                        borderBottom: `2px solid ${colors.light}`,
                        py: 1.5,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "rgba(55, 65, 81, 0.9)",
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{ 
                        borderBottom: `2px solid ${colors.light}`,
                        py: 1.5,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "rgba(55, 65, 81, 0.9)",
                      }}
                    >
                      Pull Request Title
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prs.map((pr, prIndex) => (
                    <TableRow 
                      key={prIndex}
                      sx={{
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(245, 158, 11, 0.04)",
                        },
                        animation: `fadeIn 0.5s ease-out forwards ${prIndex * 0.03}s`,
                        opacity: 0,
                        "@keyframes fadeIn": {
                          "0%": { opacity: 0, transform: "translateY(5px)" },
                          "100%": { opacity: 1, transform: "translateY(0)" }
                        },
                        "&:nth-of-type(odd)": {
                          backgroundColor: alpha(colors.main, 0.02),
                        },
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: colors.main,
                          borderBottom: "1px solid rgba(0,0,0,0.04)",
                          py: 1.25,
                        }}
                      >
                        {prIndex + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          fontSize: "0.85rem",
                          borderBottom: "1px solid rgba(0,0,0,0.04)",
                          py: 1.25,
                        }}
                      >
                        {pr.title}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        </AccordionDetails>
      </Accordion>
    </Grow>
  );
}

function PullRequestsTab({ data }: PullRequestsTabProps): JSX.Element {
  const prsByUser = useMemo(() => {
    return Object.entries(data.prs);
  }, [data.prs]);

  return (
    <Box sx={{ 
      position: 'relative',
      pt: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        left: -150,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0) 70%)',
        borderRadius: '50%',
        zIndex: -1,
        animation: 'pulse 15s infinite alternate ease-in-out',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -50,
        right: -100,
        width: 250,
        height: 250,
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, rgba(245, 158, 11, 0) 70%)',
        borderRadius: '50%',
        zIndex: -1,
        animation: 'pulse 12s infinite alternate-reverse ease-in-out',
      },
      '@keyframes pulse': {
        '0%': { opacity: 0.5, transform: 'scale(1)' },
        '100%': { opacity: 0.7, transform: 'scale(1.1)' },
      },
    }}>
      <Grow in timeout={500}>
        <Typography 
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#92400E',
            mb: 3,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '60%',
              height: 3,
              borderRadius: '3px',
              background: colors.gradient,
            }
          }}
        >
          Pull Requests by User
        </Typography>
      </Grow>
      
      {prsByUser.map(([user, prs], index) => (
        <UserPullRequests 
          key={user} 
          index={index} 
          prs={prs} 
          user={user}
        />
      ))}
    </Box>
  );
}

export default PullRequestsTab; 