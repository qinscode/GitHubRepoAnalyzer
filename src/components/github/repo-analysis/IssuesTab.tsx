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
  Paper,
  Fade,
  Grow,
  alpha,
  Card,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, BugReport as IssueIcon } from "@mui/icons-material";
import type { RepoData } from "./types";

interface IssuesTabProps {
  data: RepoData;
}

// 定义主题色
const colors = {
  main: "#8B5CF6", // purple
  light: "rgba(139, 92, 246, 0.1)",
  lighter: "rgba(139, 92, 246, 0.05)",
  gradient: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
};

function UserIssues({ 
  user, 
  issues,
  index
}: { 
  user: string; 
  issues: Array<{ title: string; body: string }>;
  index: number;
}): JSX.Element {
  const [expanded, setExpanded] = useState(issues.length <= 5);

  const handleChange = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Grow in={true} timeout={800 + index * 150}>
      <Accordion
        expanded={expanded}
        onChange={handleChange}
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
            boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)",
          }
        }}
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
              icon={<IssueIcon style={{ fontSize: "0.9rem" }} />}
              label={`${issues.length} issues`}
              size="small"
              sx={{ 
                ml: 2,
                background: colors.gradient,
                color: "white",
                fontWeight: 500,
                boxShadow: "0 2px 5px rgba(139, 92, 246, 0.2)",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: expanded ? 3 : 0 }}>
          <Fade in={expanded} timeout={500}>
            <Box>
              {issues.map((issue, issueIndex) => (
                <Card
                  key={issueIndex}
                  elevation={1}
                  sx={{ 
                    p: 0, 
                    mb: 2.5, 
                    borderRadius: "8px",
                    overflow: "hidden",
                    animation: `fadeIn 0.5s ease-out forwards ${issueIndex * 0.05}s`,
                    opacity: 0,
                    "&:last-child": {
                      mb: 0,
                    },
                    "@keyframes fadeIn": {
                      "0%": { opacity: 0, transform: "translateY(10px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" }
                    },
                    transition: "all 0.2s ease",
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                    "&:hover": {
                      boxShadow: "0 4px 8px -2px rgba(139, 92, 246, 0.15)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  <Box 
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderBottom: issue.body ? "1px solid rgba(0,0,0,0.04)" : "none",
                      background: `linear-gradient(to right, ${colors.lighter}, rgba(249, 250, 251, 0.6))`,
                    }}
                  >
                    <Typography
                      sx={{ 
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        color: "rgba(55, 65, 81, 0.9)",
                        "& span": {
                          color: colors.main,
                          fontWeight: "700",
                          mr: 1,
                        }
                      }}
                    >
                      <span>{issueIndex + 1}.</span> {issue.title}
                    </Typography>
                  </Box>
                  
                  {issue.body && (
                    <Box sx={{ p: 2 }}>
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "monospace",
                          bgcolor: alpha("#F9FAFB", 0.8),
                          p: 2,
                          borderRadius: 1,
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                          overflowX: "auto",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          color: "rgba(55, 65, 81, 0.9)",
                        }}
                      >
                        {issue.body}
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          </Fade>
        </AccordionDetails>
      </Accordion>
    </Grow>
  );
}

function IssuesTab({ data }: IssuesTabProps): JSX.Element {
  const issuesByUser = useMemo(() => {
    return Object.entries(data.issues);
  }, [data.issues]);

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
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0) 70%)',
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
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, rgba(139, 92, 246, 0) 70%)',
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
            color: '#5B21B6',
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
          Issues by User
        </Typography>
      </Grow>
      
      {issuesByUser.map(([user, issues], index) => (
        <UserIssues 
          key={user} 
          issues={issues} 
          user={user}
          index={index}
        />
      ))}
    </Box>
  );
}

export default IssuesTab; 