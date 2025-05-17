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
	AccordionDetails
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

	const handleAccordionChange =
		(repoUrl: string): ((event: React.SyntheticEvent, isExpanded: boolean) => void) =>
			(_event: React.SyntheticEvent, isExpanded: boolean): void => {
				setExpandedRepo(isExpanded ? repoUrl : null);
			};

	return (
		<Box>
			{/* Summary Table */}
			<TableContainer className="mb-8 rounded-xl overflow-hidden shadow-md" component={Paper} variant="outlined">
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
							<TableRow key={result.repoUrl} className="hover:bg-blue-50/30 transition-colors duration-150">
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
										onClick={(): void => {
											setExpandedRepo(result.repoUrl === expandedRepo ? null : result.repoUrl);
										}}
									>
										{result.repoUrl === expandedRepo ? 'Hide Details' : 'View Details'}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Repository Details Accordion */}
			{results.map((result) => (
				<Accordion
					key={result.repoUrl}
					className="mb-4 rounded-xl overflow-hidden shadow-md"
					expanded={expandedRepo === result.repoUrl}
					onChange={handleAccordionChange(result.repoUrl)}
				>
					<AccordionSummary
						className="bg-gray-50"
						expandIcon={<ExpandMoreIcon />}
					>
						<Box className="flex items-center justify-between w-full">
							<Typography className="font-bold text-lg">
								{result.repoName}
								<Typography className="ml-2 text-sm text-gray-500" component="span">
									({result.repoUrl})
								</Typography>
							</Typography>
							<Box className="flex gap-3">
								<Chip
									color="primary"
									icon={<CommitIcon />}
									label={`${result.commits} Commits`}
									size="small"
								/>
								<Chip
									color="secondary"
									icon={<IssueIcon />}
									label={`${result.issues} Issues`}
									size="small"
								/>
								<Chip
									color="info"
									icon={<PRIcon />}
									label={`${result.prs} PRs`}
									size="small"
								/>
							</Box>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<RepoResults data={result.data} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
}

export default BatchResults;