import { useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Typography,
	Card,
	CardContent,
	Grow,
	Zoom,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BatchResults from "@/components/github/results/BatchResults.tsx";
import "@/styles/FormStyles.css";

// Custom hooks
import {
	useTokenManagement,
	useRepoUrlsManagement,
	useRepoAnalysis,
} from "@/hooks";

// Components
import RepoUrlsInput from "@/components/github/forms/RepoUrlsInput";
import GitHubTokenInput from "@/components/github/forms/GitHubTokenInput";
import AnalysisOptions from "@/components/github/forms/AnalysisOptions";
import ErrorNotification from "@/components/github/notifications/ErrorNotification";
import SuccessNotification from "@/components/github/notifications/SuccessNotification";
import TokenNotification from "@/components/github/notifications/TokenNotification";
import ProgressTracker from "@/components/github/progress/ProgressTracker";

const RepoAnalysisForm = () => {
	// Token management
	const {
		token,
		tokenMessage,
		hasSavedToken,
		hasPresetToken,
		handleTokenChange,
		saveToken,
		deleteToken,
		handleTokenMessageClose,
	} = useTokenManagement();

	// URL management
	const [localTokenMessage, setLocalTokenMessage] = useState(tokenMessage);
	const {
		repoUrls,
		hasSavedUrls,
		autoSave,
		handleRepoUrlsChange,
		handleAutoSaveChange,
	} = useRepoUrlsManagement(setLocalTokenMessage);

	// Repository analysis
	const {
		loading,
		error,
		success,
		repoItems,
		results,
		currentIndex,
		progress,
		hideMergeCommits,
		setHideMergeCommits,
		handleRepoSubmit,
		handleCloseSnackbar,
		handleErrorClose,
	} = useRepoAnalysis(repoUrls, token);

	// Combine token messages from both hooks
	const combinedTokenMessage = tokenMessage || localTokenMessage;

	return (
		<Box className="form-container">
			<Grow in timeout={800}>
				<Card className="form-card">
					<CardContent className="p-6">
						<form onSubmit={handleRepoSubmit}>
							<Typography className="form-title">
								Repository Analysis
							</Typography>

							{/* Repository URLs Input */}
							<RepoUrlsInput
								hasSavedUrls={hasSavedUrls}
								repoUrls={repoUrls}
								onRepoUrlsChange={handleRepoUrlsChange}
								autoSave={autoSave}
								onAutoSaveChange={handleAutoSaveChange}
							/>

							{/* GitHub Token Input */}
							<GitHubTokenInput
								hasPresetToken={hasPresetToken}
								hasSavedToken={hasSavedToken}
								token={token}
								onTokenChange={handleTokenChange}
								onTokenDelete={deleteToken}
								onTokenSave={saveToken}
							/>

							{/* Analysis Options */}
							<AnalysisOptions
								hideMergeCommits={hideMergeCommits}
								onHideMergeCommitsChange={setHideMergeCommits}
							/>

							{/* Error Notification */}
							<ErrorNotification error={error} onClose={handleErrorClose} />

							<Box className="flex justify-end mt-8">
								<Button
									className="submit-button"
									color="primary"
									disabled={loading}
									type="submit"
									variant="contained"
									startIcon={
										loading ? (
											<div className="process-indicator">
												<CircularProgress size={20} sx={{ color: "white" }} />
											</div>
										) : (
											<SearchIcon sx={{ fontSize: "1.2rem" }} />
										)
									}
								>
									{loading ? "Analyzing..." : "Analyze Repositories"}
								</Button>
							</Box>
						</form>
					</CardContent>
				</Card>
			</Grow>
			{/* Progress Section */}
			<ProgressTracker
				currentIndex={currentIndex}
				loading={loading}
				progress={progress}
				repoItems={repoItems}
			/>
			{/* Results Section */}
			{results.length > 0 && (
				<Zoom in={results.length > 0} timeout={500}>
					<Box className="mt-8">
						<Typography className="form-title mb-4">
							Repository Analysis Results
						</Typography>
						<BatchResults results={results} />
					</Box>
				</Zoom>
			)}
			{/* Success Notification */}
			<SuccessNotification open={success} onClose={handleCloseSnackbar} />
			{/* Token Management Notification */}
			<TokenNotification
				tokenMessage={combinedTokenMessage}
				onClose={handleTokenMessageClose}
			/>
		</Box>
	);
};

export default RepoAnalysisForm;
