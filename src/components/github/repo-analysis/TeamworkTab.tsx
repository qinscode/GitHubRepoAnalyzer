import { useMemo } from "react";
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
} from "@mui/material";
import type { RepoData, TeamworkStats } from "./types";

interface TeamworkTabProps {
  data: RepoData;
}

function TeamworkTable({ 
  title, 
  data, 
  valueLabel 
}: { 
  title: string; 
  data: Array<[string, number]>; 
  valueLabel: string; 
}): JSX.Element {
  return (
    <Box sx={{ flex: "1 1 400px", minWidth: 0 }}>
      <Typography gutterBottom variant="subtitle1">
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">{valueLabel}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(([user, count]) => (
              <TableRow
                key={user}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                    {user}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={count}
                    size="small"
                    color={
                      count > 5
                        ? "success"
                        : count > 2
                          ? "primary"
                          : "default"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function TeamworkInteractionsTable({ data }: { data: Array<TeamworkStats> }): JSX.Element {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography gutterBottom variant="subtitle1">
        Teamwork Interactions by User
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Contributor</TableCell>
              <TableCell>Issues Commented</TableCell>
              <TableCell>PRs Reviewed</TableCell>
              <TableCell>Total Interactions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ user, issueComments, prReviews, total }) => (
              <TableRow key={user}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        fontSize: "0.8rem",
                      }}
                    >
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                    {user}
                  </Box>
                </TableCell>
                <TableCell>{issueComments}</TableCell>
                <TableCell>{prReviews}</TableCell>
                <TableCell>
                  <Chip
                    label={total}
                    size="small"
                    color={
                      total > 10
                        ? "success"
                        : total > 5
                          ? "primary"
                          : "default"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function TeamworkTab({ data }: TeamworkTabProps): JSX.Element {
  const { issueCommentsByUser, prReviewsByUser, teamworkStats } = useMemo(() => {
    // 按值排序的 issue 评论
    const issueCommentsByUser = Object.entries(data.teamwork.issueComments)
      .sort(([, a], [, b]) => b - a);
    
    // 按值排序的 PR 评审
    const prReviewsByUser = Object.entries(data.teamwork.prReviews)
      .sort(([, a], [, b]) => b - a);
    
    // 合并两种数据，计算总互动
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
    <Box>
      <Typography gutterBottom variant="h6">
        Teamwork Analysis
      </Typography>
      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <TeamworkTable 
          data={issueCommentsByUser} 
          title="Issues Commented On" 
          valueLabel="Comments on Others' Issues" 
        />
        
        <TeamworkTable 
          data={prReviewsByUser} 
          title="Pull Requests Reviewed" 
          valueLabel="Reviews on Others' PRs" 
        />
      </Box>

      <TeamworkInteractionsTable data={teamworkStats} />
    </Box>
  );
}

export default TeamworkTab; 