import { useMemo } from "react";
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
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import type { RepoData } from "./types";

interface PullRequestsTabProps {
  data: RepoData;
}

function UserPullRequests({ 
  user, 
  prs 
}: { 
  user: string; 
  prs: Array<{ title: string }> 
}): JSX.Element {
  return (
    <Accordion
      key={user}
      defaultExpanded={prs.length <= 5}
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
            color="info"
            label={`${prs.length} PRs`}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="10%">#</TableCell>
                <TableCell>Pull Request Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prs.map((pr, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {pr.title}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

function PullRequestsTab({ data }: PullRequestsTabProps): JSX.Element {
  const prsByUser = useMemo(() => {
    return Object.entries(data.prs);
  }, [data.prs]);

  return (
    <Box>
      <Typography gutterBottom variant="h6">
        Pull Requests by User
      </Typography>
      {prsByUser.map(([user, prs]) => (
        <UserPullRequests key={user} prs={prs} user={user} />
      ))}
    </Box>
  );
}

export default PullRequestsTab; 