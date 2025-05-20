import { useState, useEffect, useRef } from "react";
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

	// 使用ref跟踪分析按钮点击次数，用于生成唯一key
	const analysisCountRef = useRef(0);

	// 每次提交表单时增加计数
	useEffect(() => {
		if (loading) {
			analysisCountRef.current += 1;
		}
	}, [loading]);

	return (
		<Box className="form-container">
			<Grow in timeout={800}>
				<Card className="transparent-bg">
					<CardContent className="p-6">
						<form onSubmit={handleRepoSubmit}>
							<Typography className="form-title" sx={{ cursor: "default" }}>
								Repository Analysis
							</Typography>

							{/* Repository URLs Input */}
							<RepoUrlsInput
								autoSave={autoSave}
								hasSavedUrls={hasSavedUrls}
								repoUrls={repoUrls}
								onAutoSaveChange={handleAutoSaveChange}
								onRepoUrlsChange={handleRepoUrlsChange}
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
						<Typography className="form-title mb-4" sx={{ cursor: "default" }}>
							Repository Analysis Results
						</Typography>
						{/* 为BatchResults添加key，强制在新分析时重新渲染，确保上下文隔离 */}
						<BatchResults
							key={`batch-results-${analysisCountRef.current}`}
							results={results}
						/>
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
