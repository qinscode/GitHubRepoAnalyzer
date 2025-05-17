import { useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import type { RepoData } from "./types";

interface IssuesTabProps {
  data: RepoData;
}

function UserIssues({ 
  user, 
  issues 
}: { 
  user: string; 
  issues: Array<{ title: string; body: string }> 
}): JSX.Element {
  return (
    <Accordion
      key={user}
      defaultExpanded={issues.length <= 5}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
              {user.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1">{user}</Typography>
          </Box>
          <Chip
            color="secondary"
            label={`${issues.length} issues`}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {issues.map((issue, index) => (
          <Paper
            key={index}
            sx={{ p: 2, mb: 2, bgcolor: "background.default" }}
            variant="outlined"
          >
            <Typography
              gutterBottom
              sx={{ fontWeight: "bold" }}
              variant="subtitle1"
            >
              {index}. {issue.title}
            </Typography>
            {issue.body && (
              <Typography
                component="pre"
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  bgcolor: "background.paper",
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {issue.body}
              </Typography>
            )}
          </Paper>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

function IssuesTab({ data }: IssuesTabProps): JSX.Element {
  const issuesByUser = useMemo(() => {
    return Object.entries(data.issues);
  }, [data.issues]);

  return (
    <Box>
      <Typography gutterBottom variant="h6">
        Issues by User
      </Typography>
      {issuesByUser.map(([user, issues]) => (
        <UserIssues key={user} issues={issues} user={user} />
      ))}
    </Box>
  );
}

export default IssuesTab; 