import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Commit as CommitIcon,
  BugReport as IssueIcon,
  MergeType as PRIcon,
  Group as TeamIcon,
} from "@mui/icons-material";
import type { RepoData, ContributorStats } from "./types";

interface SummaryTabProps {
  data: RepoData;
}

function StatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: JSX.Element; 
  value: number; 
  label: string; 
  color: string;
}): JSX.Element {
  return (
    <Box className="flex-1 basis-48 min-w-0">
      <Card className={`h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-${color}-500 bg-gradient-to-br from-white to-${color}-50`}>
        <CardContent className="text-center p-6">
          {icon}
          <Typography className="font-bold" variant="h4">
            {value}
          </Typography>
          <Typography className="mt-1" color="text.secondary" variant="body2">
            {label}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function ContributionTable({ 
  title, 
  data, 
  color 
}: { 
  title: string; 
  data: Array<ContributorStats>; 
  color: "primary" | "secondary" | "info"; 
}): JSX.Element {
  const bgHoverClass = color === "primary" 
    ? "hover:bg-blue-50/50" 
    : color === "secondary" 
      ? "hover:bg-purple-50/50" 
      : "hover:bg-cyan-50/50";
  
  const avatarBgClass = color === "primary" 
    ? "bg-blue-600" 
    : color === "secondary" 
      ? "bg-purple-600" 
      : "bg-cyan-600";

  return (
    <>
      <Typography className="font-medium mb-2 text-gray-700">
        {title}
      </Typography>
      <TableContainer
        className="mb-6 rounded-xl overflow-hidden shadow-sm"
        component={Paper}
        variant="outlined"
      >
        <Table size="small">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-medium">Contributor</TableCell>
              <TableCell align="right" className="font-medium">
                {title.split(" ")[0]}
              </TableCell>
              <TableCell align="right" className="font-medium">
                Percentage
              </TableCell>
              <TableCell className="font-medium">Distribution</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ user, count, percentage }) => (
              <TableRow
                key={user}
                className={`${bgHoverClass} transition-colors duration-150`}
              >
                <TableCell component="th" scope="row">
                  <Box className="flex items-center">
                    <Avatar className={`w-6 h-6 mr-2 text-[0.8rem] ${avatarBgClass}`}>
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                    {user}
                  </Box>
                </TableCell>
                <TableCell align="right">{count}</TableCell>
                <TableCell align="right">{percentage}%</TableCell>
                <TableCell>
                  <LinearProgress
                    className="h-2.5 rounded-full"
                    color={color}
                    value={Number(percentage)}
                    variant="determinate"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function SummaryTab({ data }: SummaryTabProps): JSX.Element {
  // Calculate statistics data
  const {
    totalCommits,
    totalIssues,
    totalPRs,
    uniqueContributors,
    commitsByUser,
    issuesByUser,
    prsByUser,
  } = useMemo(() => {
    const totalCommits = Object.values(data.commits).reduce(
      (sum, commits) => sum + commits.length,
      0
    );
    
    const totalIssues = Object.values(data.issues).reduce(
      (sum, issues) => sum + issues.length,
      0
    );
    
    const totalPRs = Object.values(data.prs).reduce(
      (sum, prs) => sum + prs.length,
      0
    );
    
    const uniqueContributors = new Set([
      ...Object.keys(data.commits),
      ...Object.keys(data.issues),
      ...Object.keys(data.prs),
      ...Object.keys(data.teamwork.issueComments),
      ...Object.keys(data.teamwork.prReviews),
    ]).size;

    // Calculate contribution percentage for each user
    const commitsByUser = Object.entries(data.commits)
      .map(([user, commits]) => ({
        user,
        count: commits.length,
        percentage: ((commits.length / totalCommits) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);

    const issuesByUser = Object.entries(data.issues)
      .map(([user, issues]) => ({
        user,
        count: issues.length,
        percentage: ((issues.length / totalIssues) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);

    const prsByUser = Object.entries(data.prs)
      .map(([user, prs]) => ({
        user,
        count: prs.length,
        percentage: ((prs.length / totalPRs) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCommits,
      totalIssues,
      totalPRs,
      uniqueContributors,
      commitsByUser,
      issuesByUser,
      prsByUser,
    };
  }, [data]);

  return (
    <Box className="flex flex-col gap-8">
      <Box className="flex flex-wrap gap-4">
        <StatCard 
          color="blue"
          icon={<CommitIcon className="text-5xl mb-3 text-blue-500" />}
          label="Total Commits"
          value={totalCommits}
        />
        <StatCard 
          color="purple"
          icon={<IssueIcon className="text-5xl mb-3 text-purple-500" />}
          label="Total Issues"
          value={totalIssues}
        />
        <StatCard 
          color="cyan"
          icon={<PRIcon className="text-5xl mb-3 text-cyan-500" />}
          label="Total PRs"
          value={totalPRs}
        />
        <StatCard 
          color="green"
          icon={<TeamIcon className="text-5xl mb-3 text-green-500" />}
          label="Contributors"
          value={uniqueContributors}
        />
      </Box>

      <Typography className="mt-6 font-bold text-xl text-gray-800">
        Contribution Distribution
      </Typography>

      <Box>
        <ContributionTable 
          color="primary" 
          data={commitsByUser} 
          title="Commits by Contributor" 
        />
        
        <ContributionTable 
          color="secondary" 
          data={issuesByUser} 
          title="Issues by Contributor" 
        />
        
        <ContributionTable 
          color="info" 
          data={prsByUser} 
          title="Pull Requests by Contributor" 
        />
      </Box>
    </Box>
  );
}

export default SummaryTab; 