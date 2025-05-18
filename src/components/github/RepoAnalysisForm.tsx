import { useState, useEffect, useRef } from "react";
import {
	Box,
	TextField,
	Button,
	Alert,
	CircularProgress,
	Typography,
	InputAdornment,
	Card,
	CardContent,
	Fade,
	Snackbar,
	Grow,
	Zoom,
	Switch,
	FormControlLabel,
	LinearProgress,
	Stack,
	Chip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ViewListIcon from "@mui/icons-material/ViewList";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import StopIcon from "@mui/icons-material/Stop";
import type { FunctionComponent } from "../../common/types";
import RepoResults from "./RepoResults";
import BatchResults from "./BatchResults";
import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../services/githubGraphQLService";
import "./FormStyles.css";

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

type RepoStatus = "pending" | "processing" | "completed" | "error";

interface RepoListItem {
	id: string;
	url: string;
	status: RepoStatus;
	result?: RepoResult;
	error?: string;
}

// 在组件外部声明类型
declare global {
	interface Window {
		_abortController?: AbortController;
	}
}

// 在组件外部定义一个全局变量来跟踪进行中的分析
let globalAnalysisInProgress = false;
let globalForceStop = false;

const RepoAnalysisForm = (): React.ReactElement => {
	// Common state
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [isInterrupted, setIsInterrupted] = useState<boolean>(false);
	
	// useRef for tracking interrupt state in async functions
	const interruptRef = useRef<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Mode switch
	const [batchMode, setBatchMode] = useState<boolean>(false);

	// Filtering options
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(false);

	// Single repo state
	const [repoUrl, setRepoUrl] = useState<string>("");
	const [repoData, setRepoData] = useState<RepoData | null>(null);

	// Batch repos state
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [results, setResults] = useState<Array<RepoResult>>([]);
	const [repoItems, setRepoItems] = useState<Array<RepoListItem>>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);

	// 添加一个定时器引用，用于跟踪和清除定时器
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 组件级的中断标志
	const analysisInProgress = useRef<boolean>(false);
	const forceStopRef = useRef<boolean>(false);

	// Get the preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	const handleSingleRepoSubmit = async (
		event: React.FormEvent
	): Promise<void> => {
		event.preventDefault();

		if (!repoUrl.trim()) {
			setError("Please enter a GitHub repository URL or owner/repo format");
			return;
		}

		if (!token.trim()) {
			setError("Please enter a GitHub token");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Use GraphQL service to fetch repository data with filtering option
			const data = await fetchRepositoryData(repoUrl, token, {
				hideMergeCommits,
			});
			setRepoData(data);
			setSuccess(true);
		} catch (error_) {
			setError(`Repository analysis failed: ${(error_ as Error).message}`);
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const handleBatchRepoSubmit = async (
		event: React.FormEvent
	): Promise<void> => {
		event.preventDefault();
		
		// 已经在进行分析时，不再启动新的分析
		if (analysisInProgress.current || globalAnalysisInProgress) {
			console.log("分析已在进行中，忽略新请求");
			return;
		}
		
		// 验证输入
		if (!repoUrls.trim()) {
			setError("Please enter GitHub repository URLs");
			return;
		}
		
		if (!token.trim()) {
			setError("Please enter a GitHub token");
			return;
		}
		
		// 解析仓库URL
		const urlList = repoUrls
			.trim()
			.split("\n")
			.filter((url) => url.trim() !== "");
		
		if (urlList.length === 0) {
			setError("Please enter at least one valid GitHub repository URL");
			return;
		}
		
		// 重置状态
		setLoading(true);
		setError(null);
		setResults([]);
		setCurrentIndex(-1);
		setProgress(0);
		setIsInterrupted(false);
		interruptRef.current = false;
		forceStopRef.current = false;
		globalForceStop = false;
		analysisInProgress.current = true;
		globalAnalysisInProgress = true;
		
		// 创建新的AbortController
		const controller = new AbortController();
		const signal = controller.signal;
		abortControllerRef.current = controller;
		
		// 启动检查中断的轮询
		if (timeoutRef.current) {
			clearInterval(timeoutRef.current);
		}
		
		// 更频繁地检查中断状态(每50ms)，确保更快响应
		timeoutRef.current = setInterval(() => {
			// 如果检测到中断信号，自动中止所有请求
			if (forceStopRef.current || globalForceStop) {
				if (abortControllerRef.current) {
					abortControllerRef.current.abort();
				}
				if (timeoutRef.current) {
					clearInterval(timeoutRef.current);
					timeoutRef.current = null;
				}
				console.log("轮询检测到中断信号");
			}
		}, 50);
		
		try {
			// 验证URL并创建待分析项目列表
			const items: Array<RepoListItem> = [];
			const invalidUrls: Array<string> = [];
			
			// 验证URL
			for (const url of urlList) {
				const trimmedUrl = url.trim();
				const repoInfo = parseRepoUrl(trimmedUrl);
				
				if (!repoInfo) {
					invalidUrls.push(`Invalid repository URL format: ${trimmedUrl}`);
					continue;
				}
				
				// 检查重复
				if (items.some(
					(repo) => repo.url.toLowerCase() === trimmedUrl.toLowerCase()
				)) {
					invalidUrls.push(`Duplicate repository URL: ${trimmedUrl}`);
					continue;
				}
				
				items.push({
					id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
					url: trimmedUrl,
					status: "pending",
				});
			}
			
			if (items.length === 0) {
				setError("No valid repository URLs found. Please check your input.");
				setLoading(false);
				analysisInProgress.current = false;
				globalAnalysisInProgress = false;
				return;
			}
			
			if (invalidUrls.length > 0) {
				setError(
					`Some URLs were invalid and will be skipped:\n${invalidUrls.join("\n")}`
				);
			}
			
			setRepoItems(items);
			
			// 处理每个仓库
			const analysisResults: Array<RepoResult> = [];
			
			for (let index = 0; index < items.length; index++) {
				// 立即检查中断状态
				if (checkForInterruption()) {
					console.log("检测到中断，停止分析");
					
					// 标记剩余项目为已跳过
					setRepoItems((previousItems) => {
						return previousItems.map((item, itemIndex) =>
							itemIndex > index ? { ...item, status: "error", error: "Skipped due to interruption" } : item
						);
					});
					
					setError("Analysis was interrupted by user");
					
					// 显示已完成的结果
					if (analysisResults.length > 0) {
						setResults([...analysisResults]);
						setSuccess(true);
					}
					
					// 更新进度
					const progressPercent = Math.round((index / items.length) * 100);
					setProgress(progressPercent);
					
					break;
				}
				
				// 更新索引和进度
				setCurrentIndex(index);
				setProgress(Math.round((index / items.length) * 100));
				
				// 更新状态为处理中
				setRepoItems((previousItems) => {
					return previousItems.map((item, index_) =>
						index_ === index ? { ...item, status: "processing" } : item
					);
				});
				
				try {
					// 再次检查中断状态
					if (checkForInterruption()) {
						break;
					}
					
					// 获取当前项目
					const currentItem = items[index];
					if (!currentItem) continue;
					
					const currentUrl = currentItem.url;
					
					// 封装一个带超时的fetch，确保即使网络请求卡住也能响应中断
					const fetchWithTimeout = async (): Promise<any> => {
						const timeoutPromise = new Promise((_, reject) => {
							const timeoutId = setTimeout(() => {
								if (checkForInterruption()) {
									clearTimeout(timeoutId);
									reject(new Error("Operation was aborted by user"));
								}
							}, 100);
						});
						
						try {
							// 竞争Promise：谁先完成就用谁的结果
							return await Promise.race([
								fetchRepositoryData(currentUrl, token, {
									hideMergeCommits,
									signal: signal
								}),
								timeoutPromise
							]);
						} catch (error) {
							if (checkForInterruption() || 
								(error instanceof Error && (
									error.name === 'AbortError' || 
									error.message.includes('aborted') ||
									error.message.includes('interrupted')
								))) {
								console.log("Fetch operation was aborted");
								throw new Error("Operation was aborted by user");
							}
							throw error;
						}
					};
					
					// 执行带超时的fetch
					const repoData = await fetchWithTimeout();
					
					// 处理结果前再次检查中断状态
					if (checkForInterruption()) {
						console.log("API请求成功但检测到中断");
						break;
					}
					
					// 计算统计信息
					const totalCommits = Object.values(repoData.commits).reduce(
						(sum, commits) => sum + commits.length,
						0
					);
					const totalIssues = Object.values(repoData.issues).reduce(
						(sum, issues) => sum + issues.length,
						0
					);
					const totalPRs = Object.values(repoData.prs).reduce(
						(sum, prs) => sum + prs.length,
						0
					);
					const contributors = new Set([
						...Object.keys(repoData.commits),
						...Object.keys(repoData.issues),
						...Object.keys(repoData.prs),
					]).size;
					
					// 获取仓库名称
					const repoInfo = parseRepoUrl(currentUrl);
					const repoName = repoInfo
						? repoInfo.repo
						: currentUrl.split("/").pop() || currentUrl;
					
					// 创建结果对象
					const result: RepoResult = {
						repoUrl: currentUrl,
						repoName,
						commits: totalCommits,
						issues: totalIssues,
						prs: totalPRs,
						contributors,
						data: repoData,
					};
					
					// 更新结果
					analysisResults.push(result);
					
					// 更新状态为已完成
					setRepoItems((previousItems) => {
						return previousItems.map((item, index_) =>
							index_ === index ? { ...item, status: "completed", result } : item
						);
					});
					
					// 更新结果
					setResults([...analysisResults]);
					
					// 最后一次检查中断状态
					if (checkForInterruption()) {
						console.log("统计完成但检测到中断");
						break;
					}
					
					// 添加短暂延迟以使进度可见
					await new Promise<void>((resolve) => {
						const delayId = setTimeout(() => {
							clearTimeout(delayId);
							resolve();
						}, 300);
						
						// 即使在延迟中也检查中断状态
						const checkId = setInterval(() => {
							if (checkForInterruption()) {
								clearTimeout(delayId);
								clearInterval(checkId);
								resolve();
							}
						}, 50);
					});
					
				} catch (error) {
					// 检查是否由于中断而失败
					if (checkForInterruption() || 
						(error instanceof Error && (
							error.name === 'AbortError' || 
							error.message.includes('aborted') ||
							error.message.includes('interrupted')
						))) {
						console.log("由于中断而跳过处理");
						break;
					}
					
					// 处理其他错误
					const currentItem = items[index];
					if (currentItem) {
						console.error(`Error analyzing ${currentItem.url}:`, error);
					}
					
					// 更新状态为错误
					setRepoItems((previousItems) => {
						return previousItems.map((item, index_) =>
							index_ === index
								? {
										...item,
										status: "error",
										error: `Failed to analyze: ${(error as Error).message}`,
									}
								: item
						);
					});
				}
			}
			
			// 设置最终进度
			if (!checkForInterruption()) {
				setProgress(100);
				
				if (analysisResults.length === 0) {
					setError(
						"Failed to analyze any repositories. Please check your input or token."
					);
				} else {
					setSuccess(true);
				}
			} else {
				// 显示部分结果
				if (analysisResults.length > 0) {
					setSuccess(true);
				}
			}
		} catch (error) {
			console.error("批处理分析过程中发生错误:", error);
			
			if (checkForInterruption()) {
				// 保留并显示已完成的结果
				const completedRepos = repoItems.filter(item => 
					item.status === "completed"
				).length;
				
				setError(`Analysis interrupted. Completed ${completedRepos} of ${repoItems.length} repositories.`);
				
				// 显示部分结果
				if (results.length > 0) {
					setSuccess(true);
				}
			} else {
				setError(`Batch analysis failed: ${(error as Error).message}`);
			}
		} finally {
			// 清理工作
			if (timeoutRef.current) {
				clearInterval(timeoutRef.current);
				timeoutRef.current = null;
			}
			
			// 解除loading状态
			setLoading(false);
			analysisInProgress.current = false;
			globalAnalysisInProgress = false;
			
			// 更新中断后的进度
			if (checkForInterruption() && currentIndex >= 0) {
				// 计算实际进度
				const completedCount = repoItems.filter(item => 
					item.status === "completed" || item.status === "error"
				).length;
				const progressPercent = Math.round((completedCount / repoItems.length) * 100);
				setProgress(progressPercent);
			}
		}
	};

	const handleCloseSnackbar = (): void => {
		setSuccess(false);
	};

	const handleInterruptAnalysis = (): void => {
		console.log("立即强制中断分析...");
		// 设置组件级和全局中断标志
		setIsInterrupted(true);
		interruptRef.current = true;
		forceStopRef.current = true;
		globalForceStop = true;
		
		// 立即中止所有网络请求
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			console.log("已中止所有挂起的请求");
		}
		
		// 清除所有定时器
		if (timeoutRef.current) {
			clearInterval(timeoutRef.current);
			timeoutRef.current = null;
		}
		
		// 确保显示中断前的结果
		if (results.length > 0) {
			setSuccess(true);
		}
		
		// 立即将loading状态设为false
		setLoading(false);
		analysisInProgress.current = false;
		globalAnalysisInProgress = false;
		
		// 设置超时以确保UI更新
		setTimeout(() => {
			console.log("重置中断状态...");
			setIsInterrupted(false);
		}, 2000);
	};

	const extractRepoName = (): string => {
		if (!repoUrl) return "";

		const repoInfo = parseRepoUrl(repoUrl);
		if (repoInfo) {
			return `${repoInfo.owner}/${repoInfo.repo}`;
		}

		return repoUrl;
	};

	const getStatusColor = (status: RepoStatus): any => {
		switch (status) {
			case "pending":
				return "default";
			case "processing":
				return "primary";
			case "completed":
				return "success";
			case "error":
				return "error";
			default:
				return "default";
		}
	};

	const getStatusIcon = (status: RepoStatus): JSX.Element | null => {
		switch (status) {
			case "pending":
				return <HourglassTopIcon fontSize="small" />;
			case "processing":
				return <CircularProgress size={16} />;
			case "completed":
				return <CheckCircleIcon fontSize="small" />;
			case "error":
				return <ErrorIcon fontSize="small" />;
			default:
				return null;
		}
	};

	// Clear the displayed results when switching modes
	useEffect(() => {
		setRepoData(null);
		setResults([]);
		setRepoItems([]);
		setProgress(0);
		setCurrentIndex(-1);
		setError(null);
		setIsInterrupted(false);
		interruptRef.current = false;
	}, [batchMode]);

	// 在表单提交前重置interrupted状态
	const resetInterruptState = (): void => {
		setIsInterrupted(false);
		interruptRef.current = false;
	};

	// 在组件卸载时清除所有定时器
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// 确保在组件卸载时重置全局变量
	useEffect(() => {
		return () => {
			globalAnalysisInProgress = false;
			globalForceStop = false;
		};
	}, []);

	// 辅助函数：检查中断状态
	const checkForInterruption = (): boolean => {
		return interruptRef.current || forceStopRef.current || globalForceStop || 
			(abortControllerRef.current && abortControllerRef.current.signal.aborted);
	};

	return (
		<Box className="form-container">
			<Fade in timeout={500}>
				<Box className="mb-6 px-4 py-2 bg-gray-50 rounded-lg shadow-sm">
					<FormControlLabel
						control={
							<Switch
								checked={batchMode}
								color="primary"
								disabled={loading}
								onChange={(event_) => {
									setBatchMode(event_.target.checked);
								}}
							/>
						}
						label={
							<Box className="flex items-center">
								<CompareArrowsIcon
									sx={{
										mr: 1,
										color: batchMode ? "#4F46E5" : "#3B82F6",
										transition: "color 0.3s ease",
									}}
								/>
								<Typography sx={{ fontWeight: 500 }}>
									{batchMode
										? "Batch Mode (Multiple Repositories)"
										: "Single Repository Mode"}
								</Typography>
							</Box>
						}
					/>
				</Box>
			</Fade>

			<Grow in timeout={800}>
				<Card className="form-card">
					<CardContent className="p-6">
						{!batchMode ? (
							// Single Repository Form
							<form onSubmit={handleSingleRepoSubmit}>
								<Typography className="form-title">
									Repository Analysis
								</Typography>

								<Box className="mb-5 relative">
									<Typography className="form-subtitle">
										GitHub Repository URL
									</Typography>
									<TextField
										fullWidth
										className="enhanced-input"
										placeholder="Enter repository URL (e.g., https://github.com/owner/repo)"
										value={repoUrl}
										variant="outlined"
										InputProps={{
											className: "rounded-md bg-white",
											startAdornment: (
												<InputAdornment position="start">
													<div className="input-icon-container">
														<GitHubIcon
															color="primary"
															sx={{ opacity: 0.8, fontSize: "1.2rem" }}
														/>
													</div>
												</InputAdornment>
											),
										}}
										onChange={(event_): void => {
											setRepoUrl(event_.target.value);
										}}
									/>
									<Typography className="text-xs text-gray-500 mt-2 ml-1">
										Enter URL in format https://github.com/owner/repo or simply
										owner/repo
									</Typography>
								</Box>

								<Box className="mb-5">
									<Typography className="form-subtitle">
										GitHub Personal Access Token
									</Typography>
									<TextField
										fullWidth
										className="enhanced-input"
										disabled={false}
										placeholder="Enter your GitHub token"
										type="password"
										value={token}
										variant="outlined"
										InputProps={{
											className: "rounded-md bg-white",
											startAdornment: (
												<InputAdornment position="start">
													<div className="input-icon-container">
														<KeyIcon
															color="primary"
															sx={{ opacity: 0.8, fontSize: "1.2rem" }}
														/>
													</div>
												</InputAdornment>
											),
										}}
										onChange={(event_): void => {
											setToken(event_.target.value);
										}}
									/>
									<Typography className="text-xs text-gray-500 mt-2 ml-1">
										{hasPresetToken
											? "Preset token from environment variables is loaded, but you can modify it"
											: "Required for API access (needs repo scope permissions)"}
									</Typography>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "center",
										mt: 2,
										mb: 0.5,
										p: 1.5,
										bgcolor: "rgba(59, 130, 246, 0.05)",
										borderRadius: "8px",
										border: "1px solid rgba(59, 130, 246, 0.1)",
									}}
								>
									<Typography
										variant="body2"
										sx={{
											fontWeight: 500,
											fontSize: "0.85rem",
											color: "text.secondary",
											display: "flex",
											alignItems: "center",
										}}
									>
										<PlaylistAddCheckIcon
											sx={{
												mr: 1,
												color: "primary.main",
												fontSize: "1.1rem",
											}}
										/>
										Analysis Options
									</Typography>
									<Box sx={{ ml: "auto" }}>
										<FormControlLabel
											sx={{ mr: 0 }}
											control={
												<Switch
													checked={hideMergeCommits}
													color="primary"
													size="small"
													onChange={(event_) => {
														setHideMergeCommits(event_.target.checked);
													}}
												/>
											}
											label={
												<Typography
													sx={{ fontSize: "0.85rem" }}
													variant="body2"
												>
													Filter Merge Commits
												</Typography>
											}
										/>
									</Box>
								</Box>

								{error && (
									<Fade in={!!error} timeout={{ enter: 300, exit: 200 }}>
										<Alert
											className="mb-5 rounded-lg custom-alert error"
											severity="error"
											sx={{
												borderRadius: "12px",
												boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
												".MuiAlert-icon": {
													color: "white",
												},
												".MuiAlert-message": {
													color: "white",
													fontWeight: "500",
												},
											}}
										>
											{error}
										</Alert>
									</Fade>
								)}

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
										{loading ? "Analyzing..." : "Analyze Repository"}
									</Button>
								</Box>
							</form>
						) : (
							// Batch Repositories Form
							<form onSubmit={(event_) => {
								resetInterruptState();
								void handleBatchRepoSubmit(event_);
							}}>
								<Typography className="form-title">Batch Analysis</Typography>

								<Box className="mb-5 relative">
									<Typography className="form-subtitle">
										GitHub Repository URLs
									</Typography>
									<TextField
										fullWidth
										multiline
										className="enhanced-input"
										placeholder="Enter GitHub repository URLs (one per line)"
										rows={4}
										value={repoUrls}
										variant="outlined"
										InputProps={{
											className: "rounded-md bg-white",
											startAdornment: (
												<InputAdornment position="start">
													<div className="input-icon-container">
														<ViewListIcon
															color="primary"
															sx={{ opacity: 0.8, fontSize: "1.2rem" }}
														/>
													</div>
												</InputAdornment>
											),
										}}
										onChange={(event_): void => {
											setRepoUrls(event_.target.value);
										}}
									/>
									<Typography className="text-xs text-gray-500 mt-2 ml-1">
										Enter one repository URL per line (e.g.,
										https://github.com/owner/repo)
									</Typography>
								</Box>

								<Box className="mb-5">
									<Typography className="form-subtitle">
										GitHub Personal Access Token
									</Typography>
									<TextField
										fullWidth
										className="enhanced-input"
										disabled={false}
										placeholder="Enter your GitHub token"
										type="password"
										value={token}
										variant="outlined"
										InputProps={{
											className: "rounded-md bg-white",
											startAdornment: (
												<InputAdornment position="start">
													<div className="input-icon-container">
														<KeyIcon
															color="primary"
															sx={{ opacity: 0.8, fontSize: "1.2rem" }}
														/>
													</div>
												</InputAdornment>
											),
										}}
										onChange={(event_): void => {
											setToken(event_.target.value);
										}}
									/>
									<Typography className="text-xs text-gray-500 mt-2 ml-1">
										{hasPresetToken
											? "Preset token from environment variables is loaded, but you can modify it"
											: "Required for API access (needs repo scope permissions)"}
									</Typography>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "center",
										mt: 2,
										mb: 0.5,
										p: 1.5,
										bgcolor: "rgba(59, 130, 246, 0.05)",
										borderRadius: "8px",
										border: "1px solid rgba(59, 130, 246, 0.1)",
									}}
								>
									<Typography
										variant="body2"
										sx={{
											fontWeight: 500,
											fontSize: "0.85rem",
											color: "text.secondary",
											display: "flex",
											alignItems: "center",
										}}
									>
										<PlaylistAddCheckIcon
											sx={{
												mr: 1,
												color: "primary.main",
												fontSize: "1.1rem",
											}}
										/>
										Analysis Options
									</Typography>
									<Box sx={{ ml: "auto" }}>
										<FormControlLabel
											sx={{ mr: 0 }}
											control={
												<Switch
													checked={hideMergeCommits}
													color="primary"
													size="small"
													onChange={(event_) => {
														setHideMergeCommits(event_.target.checked);
													}}
												/>
											}
											label={
												<Typography
													sx={{ fontSize: "0.85rem" }}
													variant="body2"
												>
													Filter Merge Commits
												</Typography>
											}
										/>
									</Box>
								</Box>

								{error && (
									<Fade in={!!error} timeout={{ enter: 300, exit: 200 }}>
										<Alert
											className="mb-5 rounded-lg custom-alert error"
											severity="error"
											sx={{
												borderRadius: "12px",
												boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
												".MuiAlert-icon": {
													color: "white",
												},
												".MuiAlert-message": {
													color: "white",
													fontWeight: "500",
												},
											}}
										>
											{error}
										</Alert>
									</Fade>
								)}

								<Box className="flex justify-end mt-8">
									<Button
										className="submit-button"
										color={loading ? "error" : "primary"}
										disabled={loading && isInterrupted}
										type={loading ? "button" : "submit"}
										variant="contained"
										startIcon={
											loading ? (
												isInterrupted ? (
													<CircularProgress size={20} sx={{ color: "white" }} />
												) : (
													<StopIcon sx={{ fontSize: "1.2rem" }} />
												)
											) : (
												<PlaylistAddCheckIcon sx={{ fontSize: "1.2rem" }} />
											)
										}
										sx={{
											'&.MuiButton-containedError': {
												background: 'linear-gradient(45deg, #ef4444, #b91c1c)',
												'&:hover': {
													background: 'linear-gradient(45deg, #dc2626, #991b1b)',
												},
											},
										}}
										onClick={loading ? handleInterruptAnalysis : undefined}
									>
										{loading 
											? (isInterrupted ? "Stopping..." : "Stop Analysis") 
											: "Analyze Repositories"}
									</Button>
								</Box>
							</form>
						)}
					</CardContent>
				</Card>
			</Grow>

			{/* Single Repository Results */}
			{!batchMode && repoData && (
				<Zoom
					in={!!repoData}
					style={{ transitionDelay: "100ms" }}
					timeout={500}
				>
					<Box sx={{ mt: 4 }}>
						<RepoResults data={repoData} />
					</Box>
				</Zoom>
			)}

			{/* Batch Progress Section - 在loading状态或中断后都显示进度 */}
			{batchMode && (loading || isInterrupted) && repoItems.length > 0 && (
				<Zoom
					in={(loading || isInterrupted) && repoItems.length > 0}
					style={{ transitionDelay: "100ms" }}
					timeout={500}
				>
					<Box className="mt-8">
						<Card className="form-card">
							<CardContent className="p-5">
								<Box className="flex justify-between items-center mb-3">
									<Typography className="font-semibold text-gray-700">
										Analysis Progress
										{isInterrupted && !loading && (
											<Chip 
												color="warning" 
												label="Interrupted" 
												size="small" 
												sx={{ ml: 2, fontWeight: 500 }} 
											/>
										)}
									</Typography>
									<Typography className="text-sm text-gray-600">
										{`${Math.min(currentIndex + 1, repoItems.length)} of ${repoItems.length} repositories (${progress}%)`}
									</Typography>
								</Box>

								<LinearProgress
									value={progress}
									variant="determinate"
									sx={{
										height: 8,
										borderRadius: 4,
										mb: 3,
										backgroundColor: "rgba(59, 130, 246, 0.1)",
										"& .MuiLinearProgress-bar": {
											background: "linear-gradient(45deg, #2563eb, #4f46e5)",
											borderRadius: 4,
										},
									}}
								/>

								<Stack maxHeight="200px" spacing={1} sx={{ overflowY: "auto" }}>
									{repoItems.map((repo, index) => (
										<Box
											key={repo.id}
											className={`p-2 rounded-md flex items-center justify-between ${
												index === currentIndex && repo.status === "processing"
													? "bg-blue-50"
													: repo.status === "completed"
														? "bg-green-50"
														: repo.status === "error"
															? "bg-red-50"
															: ""
											}`}
										>
											<Box className="flex items-center">
												<Box
													sx={{
														width: 24,
														mr: 1.5,
														display: "flex",
														justifyContent: "center",
													}}
												>
													{getStatusIcon(repo.status)}
												</Box>
												<Typography
													noWrap
													className="text-sm text-gray-700 font-medium"
													sx={{ maxWidth: 250 }}
												>
													{repo.url.replace("https://github.com/", "")}
												</Typography>
											</Box>
											<Chip
												className="min-w-[90px]"
												color={getStatusColor(repo.status)}
												size="small"
												sx={{ fontWeight: 500 }}
												variant="outlined"
												label={
													repo.status.charAt(0).toUpperCase() +
													repo.status.slice(1)
												}
											/>
										</Box>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Box>
				</Zoom>
			)}

			{/* Batch Results Section - 确保即使在中断后也能显示结果 */}
			{batchMode && results.length > 0 && (
				<Zoom in={results.length > 0} timeout={500}>
					<Box className="mt-8">
						<Typography className="form-title mb-4">
							Repository Analysis Results
							{isInterrupted && (
								<Chip 
									color="warning" 
									label="Interrupted" 
									size="small" 
									sx={{ ml: 2, fontWeight: 500 }} 
								/>
							)}
						</Typography>
						<BatchResults results={results} />
					</Box>
				</Zoom>
			)}

			{/* Success Notifications */}
			<Snackbar
				TransitionComponent={Zoom}
				autoHideDuration={5000}
				open={success}
				onClose={handleCloseSnackbar}
			>
				<Alert
					className="custom-alert success"
					severity="success"
					sx={{
						width: "100%",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						color: "white",
						".MuiAlert-icon": {
							color: "white",
						},
					}}
					onClose={handleCloseSnackbar}
				>
					{!batchMode
						? `Repository ${extractRepoName()} analyzed successfully!`
						: isInterrupted 
							? `Analysis interrupted. Completed ${results.length} of ${repoItems.length} repositories.`
							: `All ${repoItems.length} repositories analyzed successfully!`}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default RepoAnalysisForm;