import { useState, useEffect, useMemo, useCallback, createContext } from "react";
import {
	Box,
	Paper,
	Fade,
	Grow,
	useTheme,
	useMediaQuery,
	Typography,
} from "@mui/material";
import type { RepoResultsProps } from "@/types/github";
import TabPanel from "./TabPanel";
import SummaryTab from "@components/github/analysis/tabs/SummaryTab";
import CommitsTab from "@components/github/analysis/tabs/CommitsTab";
import IssuesTab from "@components/github/analysis/tabs/IssuesTab";
import PullRequestsTab from "@components/github/analysis/tabs/PullRequestsTab";
import BonusMarksTab from "@components/github/analysis/tabs/BonusMarksTab";
import RepoTabBar from "./RepoTabBar";
import RepoResultsContainer from "./RepoResultsContainer";
import TeamworkTab from "@components/github/analysis/tabs/TeamworkTab.tsx";

// 创建独立的仓库数据上下文
export const RepoContext = createContext<{
	repoStudents: string[];
	setRepoStudents: (students: string[]) => void;
	reorderRepoStudents: (fromIndex: number, toIndex: number) => void;
}>({
	repoStudents: [],
	setRepoStudents: () => {},
	reorderRepoStudents: () => {},
});

function RepoResults({ data }: RepoResultsProps) {
	const [tabValue, setTabValue] = useState(0);
	const [tabTransition, setTabTransition] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	
	// 为每个仓库创建独立的学生顺序状态
	const [repoStudents, setRepoStudents] = useState<string[]>([]);

	// 重新排序学生的函数
	const reorderRepoStudents = useCallback((fromIndex: number, toIndex: number) => {
		setRepoStudents(prevOrder => {
			// 验证索引有效性
			if (
				fromIndex < 0 || 
				toIndex < 0 || 
				fromIndex >= prevOrder.length || 
				toIndex >= prevOrder.length
			) {
				return prevOrder;
			}
			
			// 创建新数组并重新排序
			const newOrder = [...prevOrder];
			const removed = newOrder.splice(fromIndex, 1)[0];
			if (removed !== undefined) {
				newOrder.splice(toIndex, 0, removed);
			}
			
			return newOrder;
		});
	}, []);

	// 为仓库上下文提供值
	const repoContextValue = useMemo(() => ({
		repoStudents,
		setRepoStudents,
		reorderRepoStudents
	}), [repoStudents, reorderRepoStudents]);

	// Calculate total counts for each category
	const counts = useMemo(() => {
		return {
			commits: Object.values(data.commits).reduce(
				(sum, array) => sum + array.length,
				0
			),
			issues: Object.values(data.issues).reduce(
				(sum, array) => sum + array.length,
				0
			),
			prs: Object.values(data.prs).reduce(
				(sum, array) => sum + array.length,
				0
			),
		};
	}, [data]);

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number
	): void => {
		setTabTransition(false);
		setTimeout(() => {
			setTabValue(newValue);
			setTabTransition(true);
		}, 150);
	};

	const handleKeyNavigation = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowRight") {
				// Move to next tab (with circular navigation)
				const nextTab = tabValue < 5 ? tabValue + 1 : 0;
				setTabTransition(false);
				setTimeout(() => {
					setTabValue(nextTab);
					setTabTransition(true);
				}, 150);
			} else if (event.key === "ArrowLeft") {
				// Move to previous tab (with circular navigation)
				const previousTab = tabValue > 0 ? tabValue - 1 : 5;
				setTabTransition(false);
				setTimeout(() => {
					setTabValue(previousTab);
					setTabTransition(true);
				}, 150);
			}
		},
		[tabValue]
	);

	// 组件初始化时设置过渡状态
	useEffect(() => {
		setTabTransition(true);
		
		// 组件卸载时清理
		return () => {
			setRepoStudents([]);
		};
	}, []);

	// 组件挂载时添加键盘事件监听器
	useEffect(() => {
		window.addEventListener("keydown", handleKeyNavigation);
		
		// 组件卸载时移除事件监听器
		return () => {
			window.removeEventListener("keydown", handleKeyNavigation);
		};
	}, [handleKeyNavigation]);
	
	// 确保data变更时重置学生列表，防止数据混合
	useEffect(() => {
		// 每当数据源变化时，重置学生列表
		setRepoStudents([]);
	}, [data]);

	return (
		<RepoContext.Provider value={repoContextValue}>
			<RepoResultsContainer>
				<Grow in timeout={800}>
					<Paper
						elevation={2}
						sx={{
							mb: 6,
							borderRadius: "16px",
							overflow: "hidden",
							background:
								"linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
							backdropFilter: "blur(8px)",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
							borderTop: "1px solid rgba(255, 255, 255, 0.5)",
							boxShadow:
								"0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
							"&:hover": {
								transform: "translateY(-2px)",
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
							},
							position: "relative",
						}}
					>
						<RepoTabBar
							counts={counts}
							handleTabChange={handleTabChange}
							isMobile={isMobile}
							tabValue={tabValue}
						/>
					</Paper>
				</Grow>
				<Typography
					color="grey.600"
					variant="caption"
					sx={{
						display: "block",
						textAlign: "left",
						fontSize: "0.75rem",
						fontStyle: "italic",
					}}
				>
					Tips: Use left and right arrow keys to navigate between tabs
				</Typography>
				<Fade in={tabTransition} timeout={400}>
					<Box
						sx={{
							position: "relative",
							minHeight: "300px",
						}}
					>
						<TabPanel index={0} value={tabValue}>
							<SummaryTab data={data} />
						</TabPanel>

						<TabPanel index={1} value={tabValue}>
							<CommitsTab data={data} />
						</TabPanel>

						<TabPanel index={2} value={tabValue}>
							<IssuesTab data={data} />
						</TabPanel>

						<TabPanel index={3} value={tabValue}>
							<PullRequestsTab data={data} />
						</TabPanel>

						<TabPanel index={4} value={tabValue}>
							<TeamworkTab data={data} />
						</TabPanel>

						<TabPanel index={5} value={tabValue}>
							<BonusMarksTab data={data} />
						</TabPanel>
					</Box>
				</Fade>
			</RepoResultsContainer>
		</RepoContext.Provider>
	);
}

export default RepoResults;
