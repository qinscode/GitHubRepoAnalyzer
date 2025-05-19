import {
	Box,
	Stack,
	IconButton,
	Button,
	Tooltip,
	alpha,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	ContentCopy as CopyIcon,
	OpenInNew as OpenInNewIcon,
	Check as CheckIcon,
	KeyboardArrowDown as ExpandIcon,
	KeyboardArrowUp as CollapseIcon,
} from "@mui/icons-material";
import { RepoResult } from "@/types";
import { useRepoActions } from "@/hooks";

interface RepoActionsProps {
	result: RepoResult;
	expandedRepo: string | null;
	onToggleDetails: (repoUrl: string) => void;
}

export const RepoActions = ({
	result,
	expandedRepo,
	onToggleDetails,
}: RepoActionsProps) => {
	const theme = useTheme();
	const isMediumDown = useMediaQuery(theme.breakpoints.down("md"));
	const { copiedUrl, copyRepoUrl, openInGitHub } = useRepoActions();

	return (
		<Box
			sx={{
				width: { xs: "100%", sm: "30%" },
				display: "flex",
				justifyContent: { xs: "flex-start", sm: "flex-end" },
			}}
		>
			<Stack direction="row" spacing={1} sx={{ mt: { xs: 0, sm: 0 } }}>
				<Tooltip title={copiedUrl === result.repoUrl ? "Copied!" : "Copy URL"}>
					<IconButton
						aria-label="Copy repository URL"
						size="small"
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.1),
							color:
								copiedUrl === result.repoUrl
									? theme.palette.success.main
									: theme.palette.primary.main,
							width: 32,
							height: 32,
							"&:hover": {
								backgroundColor: alpha(theme.palette.primary.main, 0.15),
								transform: "translateY(-2px)",
							},
						}}
						onClick={() => {
							copyRepoUrl(result.repoUrl);
						}}
					>
						{copiedUrl === result.repoUrl ? (
							<CheckIcon fontSize="small" />
						) : (
							<CopyIcon fontSize="small" />
						)}
					</IconButton>
				</Tooltip>

				<Tooltip title="Open in GitHub">
					<IconButton
						aria-label="Open repository in GitHub"
						size="small"
						sx={{
							backgroundColor: alpha(theme.palette.grey[700], 0.08),
							color: theme.palette.grey[700],
							width: 32,
							height: 32,
							"&:hover": {
								backgroundColor: alpha(theme.palette.grey[700], 0.15),
								transform: "translateY(-2px)",
							},
						}}
						onClick={() => {
							openInGitHub(result.repoUrl);
						}}
					>
						<OpenInNewIcon fontSize="small" />
					</IconButton>
				</Tooltip>

				<Button
					color="primary"
					size="small"
					variant={expandedRepo === result.repoUrl ? "contained" : "outlined"}
					endIcon={
						expandedRepo === result.repoUrl ? <CollapseIcon /> : <ExpandIcon />
					}
					sx={{
						borderRadius: "8px",
						textTransform: "none",
						fontWeight: 600,
						fontSize: {
							xs: "0.8rem",
							sm: "0.82rem",
							md: "0.85rem",
						},
						minWidth: {
							xs: "80px",
							sm: "100px",
							md: "120px",
							lg: "130px",
						},
						height: 32,
						boxShadow: "none",
						padding: {
							xs: "6px 8px",
							sm: "6px 10px",
							md: "6px 12px",
						},
						letterSpacing: "0.01em",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						...(expandedRepo === result.repoUrl
							? {
									background: "linear-gradient(45deg, #3B82F6, #4F46E5)",
								}
							: {
									borderColor: alpha(theme.palette.primary.main, 0.5),
								}),
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow:
								expandedRepo === result.repoUrl
									? "0 4px 8px rgba(59, 130, 246, 0.25)"
									: "none",
							...(expandedRepo !== result.repoUrl
								? {
										borderColor: alpha(theme.palette.primary.main, 0.8),
										backgroundColor: alpha(theme.palette.primary.main, 0.04),
									}
								: {}),
						},
						"& .MuiButton-endIcon": {
							marginLeft: {
								xs: "4px",
								sm: "6px",
								md: "8px",
							},
						},
					}}
					onClick={() => {
						onToggleDetails(result.repoUrl);
					}}
				>
					{expandedRepo === result.repoUrl
						? isMediumDown
							? "Hide"
							: "Hide Details"
						: isMediumDown
							? "View"
							: "View Details"}
				</Button>
			</Stack>
		</Box>
	);
};
