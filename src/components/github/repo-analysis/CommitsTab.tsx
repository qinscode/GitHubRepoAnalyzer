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

interface CommitsTabProps {
  data: RepoData;
}

function UserCommits({ 
  user, 
  commits 
}: { 
  user: string; 
  commits: Array<{ message: string; id: string }> 
}): JSX.Element {
  return (
    <Accordion
      key={user}
      defaultExpanded={commits.length > 30}
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
            color="primary"
            label={`${commits.length} commits`}
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
                <TableCell>Commit Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commits.map((commit, index) => (
                <TableRow key={commit.id || index}>
                  <TableCell>{index}</TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {commit.message}
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

function CommitsTab({ data }: CommitsTabProps): JSX.Element {
  const commitsByUser = useMemo(() => {
    return Object.entries(data.commits);
  }, [data.commits]);

  return (
    <Box>
      <Typography gutterBottom variant="h6">
        Commit History by User
      </Typography>
      {commitsByUser.map(([user, commits]) => (
        <UserCommits key={user} commits={commits} user={user} />
      ))}
    </Box>
  );
}

export default CommitsTab; 