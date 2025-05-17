import React from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Chip,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Collapse
} from '@mui/material';
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
	ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import RepoResults from './RepoResults';

interface RepoData {
	commits: Record<string, Array<{ message: string; id: string }>>;
	issues: Record<string, Array<{ title: string; body: string }>>;
	prs: Record<string, Array<{ title: string }>>;
	teamwork: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}

interface RepoResult {
	repoUrl: string;
	repoName: string;
	commits: number;
	issues: number;
	prs: number;
	contributors: number;
	data: RepoData;
}

interface BatchResultsProps {
	results: Array<RepoResult>;
}

function BatchResults({ results }: BatchResultsProps): JSX.Element {
	const [expandedRepo, setExpandedRepo] = React.useState<string | null>(null);

	const handleToggleDetails = (repoUrl: string): void => {
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	return (
		<TableContainer className="rounded-xl overflow-hidden shadow-md" component={Paper} variant="outlined">
			<Table>
				<TableHead className="bg-gray-50">
					<TableRow>
						<TableCell className="font-medium">Repository Name</TableCell>
						<TableCell align="center" className="font-medium">Commits</TableCell>
						<TableCell align="center" className="font-medium">Issues</TableCell>
						<TableCell align="center" className="font-medium">PRs</TableCell>
						<TableCell align="center" className="font-medium">Contributors</TableCell>
						<TableCell align="right" className="font-medium">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{results.map((result) => (
						<React.Fragment key={result.repoUrl}>
							<TableRow className="hover:bg-blue-50/30 transition-colors duration-150">
								<TableCell component="th" scope="row">
									<Typography className="font-medium">{result.repoName}</Typography>
									<Typography className="block" color="text.secondary" variant="caption">
										{result.repoUrl}
									</Typography>
								</TableCell>
								<TableCell align="center">
									<Chip
										className="font-medium"
										color="primary"
										icon={<CommitIcon />}
										label={result.commits}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<Chip
										className="font-medium"
										color="secondary"
										icon={<IssueIcon />}
										label={result.issues}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<Chip
										className="font-medium"
										color="info"
										icon={<PRIcon />}
										label={result.prs}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<Chip
										className="font-medium"
										color="success"
										icon={<TeamIcon />}
										label={result.contributors}
										size="small"
									/>
								</TableCell>
								<TableCell align="right">
									<Button
										className="text-sm"
										size="small"
										variant="outlined"
										onClick={(): void => handleToggleDetails(result.repoUrl)}
									>
										{expandedRepo === result.repoUrl ? "Hide Details" : "View Details"}
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={6} className="p-0 border-b-0">
									<Collapse in={expandedRepo === result.repoUrl} timeout="auto" unmountOnExit>
										<Box className="p-4 bg-gray-50/50">
											<Typography className="font-bold text-lg mb-4">
												Details for {result.repoName}
											</Typography>
											<RepoResults data={result.data} />
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BatchResults;