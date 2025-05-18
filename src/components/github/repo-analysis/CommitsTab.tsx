import React, { useMemo } from "react";
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
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Commit as CommitIcon } from "@mui/icons-material";
import type { RepoData } from "./types";

interface CommitsTabProps {
  data: RepoData;
}

function UserCommits({ 
  commits,
  index,
  user
}: { 
  commits: Array<{ message: string; id: string }>;
  index: number;
  user: string; 
}): JSX.Element {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (): void => {
    setExpanded(!expanded);
  };

  // 生成渐变颜色
  const colors = {
    main: "#10B981", // green
    light: "rgba(16, 185, 129, 0.1)",
    lighter: "rgba(16, 185, 129, 0.05)",
    gradient: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
  };

  return (
    <Grow in timeout={800 + index * 150}>
      <Accordion
        key={user}
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
            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)",
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
                  boxShadow: `0 2px 5px ${colors.main}40`,
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
              icon={<CommitIcon style={{ fontSize: "0.9rem" }} />}
              label={`${commits.length} commits`}
              size="small"
              sx={{ 
                ml: 2,
                background: colors.gradient,
                color: "white",
                fontWeight: 500,
                boxShadow: "0 2px 5px rgba(16, 185, 129, 0.2)",
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
                      Commit Message
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commits.map((commit, commitIndex) => (
                    <TableRow 
                      key={commit.id || commitIndex}
                      sx={{
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(16, 185, 129, 0.04)",
                        },
                        animation: `fadeIn 0.5s ease-out forwards ${commitIndex * 0.03}s`,
                        opacity: 0,
                        "@keyframes fadeIn": {
                          "0%": { opacity: 0, transform: "translateY(5px)" },
                          "100%": { opacity: 1, transform: "translateY(0)" }
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
                        {commitIndex + 1}
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
                        {commit.message}
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

function CommitsTab({ data }: CommitsTabProps): JSX.Element {
  const commitsByUser = useMemo(() => {
    return Object.entries(data.commits);
  }, [data.commits]);

  return (
    <Box>
      <Typography 
        gutterBottom 
        variant="h6"
        sx={{ 
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#0F766E",
          mb: 3,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 50,
            height: 3,
            borderRadius: "3px",
            background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
          }
        }}
      >
        Commit History by User
      </Typography>
      {commitsByUser.map(([user, commits], index) => (
        <UserCommits 
          key={user} 
          commits={commits}
          index={index} 
          user={user} 
        />
      ))}
    </Box>
  );
}

export default CommitsTab; 