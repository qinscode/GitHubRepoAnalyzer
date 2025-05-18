import { useMemo } from "react";
import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Chip,
  Card,
  Fade,
  Grow,
  useTheme,
  alpha,
} from "@mui/material";
import { ChatBubble as CommentIcon, RateReview as ReviewIcon } from "@mui/icons-material";
import type { RepoData, TeamworkStats } from "./types";

interface TeamworkTabProps {
  data: RepoData;
}

// 定义主题色
const colors = {
  main: "#EC4899", // pink
  secondary: "#8B5CF6", // purple
  tertiary: "#F59E0B", // amber
  light: "rgba(236, 72, 153, 0.1)",
  lighter: "rgba(236, 72, 153, 0.05)",
  gradient: "linear-gradient(90deg, #EC4899 0%, #D946EF 100%)",
  gradientSecondary: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
};

function SectionTitle({ title }: { title: string }): JSX.Element {
  return (
    <Typography 
      sx={{ 
        fontSize: "1.15rem",
        fontWeight: 600,
        color: "#BE185D",
        mb: 2,
        mt: 1,
        position: "relative",
        paddingLeft: "16px",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "4px",
          height: "18px",
          borderRadius: "2px",
          background: colors.gradient,
        }
      }}
    >
      {title}
    </Typography>
  );
}

function TeamworkTable({ 
  title, 
  data, 
  valueLabel,
  index
}: { 
  title: string; 
  data: Array<[string, number]>; 
  valueLabel: string; 
  index: number;
}): JSX.Element {
  const isIssuesTable = title.includes("Issues");
  const lightColor = isIssuesTable ? colors.light : "rgba(139, 92, 246, 0.1)";
  const lighterColor = isIssuesTable ? colors.lighter : "rgba(139, 92, 246, 0.05)";

  return (
    <Grow in={true} timeout={700 + index * 100}>
      <Box sx={{ 
        flex: "1 1 400px", 
        minWidth: 0,
        animation: `fadeIn 0.5s ease-out forwards ${index * 0.15}s`,
        opacity: 0,
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }}>
        <Card 
          elevation={2}
          sx={{ 
            overflow: "hidden",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderLeft: isIssuesTable ? `1px solid rgba(236, 72, 153, 0.2)` : `1px solid rgba(139, 92, 246, 0.2)`,
            borderTop: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: isIssuesTable 
                ? "0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.05)" 
                : "0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.05)"
            }
          }}
        >
          <Box 
            sx={{ 
              padding: "16px 20px", 
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              background: `linear-gradient(to right, ${lighterColor}, rgba(249, 250, 251, 0.6))`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isIssuesTable ? (
              <CommentIcon sx={{ fontSize: "1.2rem", color: "#BE185D", marginRight: 1.5 }} />
            ) : (
              <ReviewIcon sx={{ fontSize: "1.2rem", color: "#5B21B6", marginRight: 1.5 }} />
            )}
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: isIssuesTable ? "#BE185D" : "#5B21B6",
              }}
            >
              {title}
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ 
                background: `linear-gradient(to right, ${lighterColor}, rgba(248, 250, 252, 0.8))`
              }}>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      borderBottom: `2px solid ${lightColor}`,
                      py: 1.5,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      borderBottom: `2px solid ${lightColor}`,
                      py: 1.5,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    {valueLabel}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(([user, count], userIndex) => (
                  <TableRow
                    key={user}
                    sx={{ 
                      transition: "all 0.2s ease",
                      animation: `rowFadeIn 0.4s ease-out forwards ${userIndex * 0.05 + 0.2}s`,
                      opacity: 0,
                      "@keyframes rowFadeIn": {
                        "0%": { opacity: 0, transform: "translateY(5px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" }
                      },
                      "&:nth-of-type(odd)": {
                        backgroundColor: isIssuesTable ? alpha("#EC4899", 0.02) : alpha("#8B5CF6", 0.02),
                      },
                      "&:hover": {
                        backgroundColor: isIssuesTable ? alpha("#EC4899", 0.05) : alpha("#8B5CF6", 0.05),
                      },
                      "&:last-child td, &:last-child th": { 
                        borderBottom: 0 
                      }
                    }}
                  >
                    <TableCell sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            mr: 1.5,
                            background: isIssuesTable ? colors.gradient : colors.gradientSecondary,
                            fontSize: "0.9rem",
                            boxShadow: isIssuesTable 
                              ? `0 2px 5px ${alpha("#EC4899", 0.4)}`
                              : `0 2px 5px ${alpha("#8B5CF6", 0.4)}`,
                          }}
                        >
                          {user.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            color: "rgba(55, 65, 81, 0.9)",
                          }}
                        >
                          {user}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <Chip
                        sx={{
                          background: count > 5
                            ? isIssuesTable ? colors.gradient : colors.gradientSecondary
                            : count > 2
                              ? `linear-gradient(90deg, ${alpha(isIssuesTable ? "#EC4899" : "#8B5CF6", 0.7)} 0%, ${alpha(isIssuesTable ? "#D946EF" : "#A78BFA", 0.7)} 100%)`
                              : "rgba(0, 0, 0, 0.08)",
                          color: count > 2 ? "white" : "rgba(55, 65, 81, 0.9)",
                          fontWeight: 600,
                          minWidth: "36px",
                          boxShadow: count > 2 
                            ? isIssuesTable 
                              ? `0 2px 4px ${alpha("#EC4899", 0.2)}`
                              : `0 2px 4px ${alpha("#8B5CF6", 0.2)}`
                            : "none",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          }
                        }}
                        label={count}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Grow>
  );
}

function TeamworkInteractionsTable({ data }: { data: TeamworkStats[] }): JSX.Element {
  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ mt: 4 }}>
        <SectionTitle title="Teamwork Interactions by User" />
        
        <Card 
          elevation={2}
          sx={{ 
            overflow: "hidden",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.025)"
            }
          }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ 
                background: `linear-gradient(to right, ${colors.lighter}, rgba(248, 250, 252, 0.8))`
              }}>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      borderBottom: `2px solid ${colors.light}`,
                      py: 1.75,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    Contributor
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: `2px solid ${colors.light}`,
                      py: 1.75,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    Issues Commented
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: `2px solid ${colors.light}`,
                      py: 1.75,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    PRs Reviewed
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: `2px solid ${colors.light}`,
                      py: 1.75,
                      fontWeight: 600,
                      color: "rgba(55, 65, 81, 0.9)",
                    }}
                  >
                    Total Interactions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((stats, index) => (
                  <TableRow 
                    key={stats.user}
                    sx={{ 
                      transition: "all 0.2s ease",
                      animation: `rowFadeIn 0.5s ease-out forwards ${index * 0.05 + 0.2}s`,
                      opacity: 0,
                      "@keyframes rowFadeIn": {
                        "0%": { opacity: 0, transform: "translateY(5px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" }
                      },
                      "&:nth-of-type(odd)": {
                        backgroundColor: alpha(colors.main, 0.02),
                      },
                      "&:hover": {
                        backgroundColor: alpha(colors.main, 0.05),
                      },
                      "&:last-child td, &:last-child th": { 
                        borderBottom: 0 
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.5
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1.5,
                            fontSize: "0.85rem",
                            background: colors.gradient,
                            boxShadow: `0 2px 5px ${alpha(colors.main, 0.4)}`,
                          }}
                        >
                          {stats.user.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            color: "rgba(55, 65, 81, 0.9)",
                          }}
                        >
                          {stats.user}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.5,
                      fontWeight: 500,
                      color: stats.issueComments > 0 ? "#BE185D" : "inherit",
                    }}>
                      {stats.issueComments}
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.5,
                      fontWeight: 500,
                      color: stats.prReviews > 0 ? "#5B21B6" : "inherit",
                    }}>
                      {stats.prReviews}
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.5
                    }}>
                      <Chip
                        sx={{
                          background: stats.total > 10
                            ? colors.gradient
                            : stats.total > 5
                              ? `linear-gradient(90deg, ${alpha(colors.main, 0.7)} 0%, ${alpha("#D946EF", 0.7)} 100%)`
                              : "rgba(0, 0, 0, 0.08)",
                          color: stats.total > 5 ? "white" : "rgba(55, 65, 81, 0.9)",
                          fontWeight: 600,
                          minWidth: "36px",
                          boxShadow: stats.total > 5 ? `0 2px 4px ${alpha(colors.main, 0.2)}` : "none",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          }
                        }}
                        label={stats.total}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Fade>
  );
}

function TeamworkTab({ data }: TeamworkTabProps): JSX.Element {
  const { issueCommentsByUser, prReviewsByUser, teamworkStats } = useMemo(() => {
    // Sort issue comments by value
    const issueCommentsByUser = Object.entries(data.teamwork.issueComments)
      .sort(([, a], [, b]) => b - a);
    
    // Sort PR reviews by value
    const prReviewsByUser = Object.entries(data.teamwork.prReviews)
      .sort(([, a], [, b]) => b - a);
    
    // Merge both data types and calculate total interactions
    const teamworkStats = Array.from(
      new Set([
        ...Object.keys(data.teamwork.issueComments),
        ...Object.keys(data.teamwork.prReviews),
      ])
    )
      .map((user) => {
        const issueComments = data.teamwork.issueComments[user] || 0;
        const prReviews = data.teamwork.prReviews[user] || 0;
        const total = issueComments + prReviews;
        
        return { user, issueComments, prReviews, total };
      })
      .sort((a, b) => b.total - a.total);
    
    return { issueCommentsByUser, prReviewsByUser, teamworkStats };
  }, [data.teamwork]);

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
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0) 70%)',
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
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0) 70%)',
        borderRadius: '50%',
        zIndex: -1,
        animation: 'pulse 12s infinite alternate-reverse ease-in-out',
      },
      '@keyframes pulse': {
        '0%': { opacity: 0.5, transform: 'scale(1)' },
        '100%': { opacity: 0.7, transform: 'scale(1.1)' },
      },
    }}>
      <Grow in={true} timeout={500}>
        <Typography 
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#BE185D',
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
          Teamwork Analysis
        </Typography>
      </Grow>
      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <TeamworkTable 
          title="Issues Commented On" 
          data={issueCommentsByUser} 
          valueLabel="Comments on Others' Issues"
          index={0}
        />
        
        <TeamworkTable 
          title="Pull Requests Reviewed" 
          data={prReviewsByUser} 
          valueLabel="Reviews on Others' PRs"
          index={1}
        />
      </Box>

      <TeamworkInteractionsTable data={teamworkStats} />
    </Box>
  );
}

export default TeamworkTab; 