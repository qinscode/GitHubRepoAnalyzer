import { useMemo, useEffect, useRef } from "react";
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
	LinearProgress,
} from "@mui/material";
import { RepoData } from "@/services/github/types";
import { ContributorStats } from "@/types/github";
import { useStudentStore } from "@/store/useStudentStore";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SummaryTabProps {
	data: RepoData;
}

interface ColorMap {
	main: string;
	light: string;
	lighter: string;
	gradient: string;
}

interface ContributionTableProps {
	title: string;
	data: Array<ContributorStats>;
	color: "primary" | "secondary" | "info";
}

const ContributionTable: React.FC<ContributionTableProps> = ({
	title,
	data,
	color,
}) => {
	const colorMap: Record<"primary" | "secondary" | "info", ColorMap> = {
		primary: {
			main: "#3B82F6",
			light: "rgba(59, 130, 246, 0.1)",
			lighter: "rgba(59, 130, 246, 0.05)",
			gradient: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
		},
		secondary: {
			main: "#8B5CF6",
			light: "rgba(139, 92, 246, 0.1)",
			lighter: "rgba(139, 92, 246, 0.05)",
			gradient: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
		},
		info: {
			main: "#0EA5E9",
			light: "rgba(14, 165, 233, 0.1)",
			lighter: "rgba(14, 165, 233, 0.05)",
			gradient: "linear-gradient(90deg, #0EA5E9 0%, #38BDF8 100%)",
		},
	};

	const bgHoverClass =
		color === "primary"
			? "hover:bg-blue-50/50"
			: color === "secondary"
				? "hover:bg-purple-50/50"
				: "hover:bg-cyan-50/50";

	const selectedColor = colorMap[color];

	return (
		<>
			<Typography
				className="font-medium mb-3"
				sx={{
					fontSize: "1.1rem",
					display: "inline-block",
					position: "relative",
					color: selectedColor.main,
					paddingLeft: "16px",
					"&::before": {
						content: '""',
						position: "absolute",
						left: 0,
						top: "50%",
						transform: "translateY(-50%)",
						width: "4px",
						height: "18px",
						borderRadius: "2px",
						background: selectedColor.gradient,
					},
				}}
			>
				{title}
			</Typography>
			<TableContainer
				className="mb-8 rounded-xl overflow-hidden"
				component={Paper}
				elevation={2}
				sx={{
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
					background: "rgba(255, 255, 255, 0.8)",
					backdropFilter: "blur(8px)",
					border: "1px solid rgba(255, 255, 255, 0.7)",
					transition: "all 0.2s ease",
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
					},
				}}
			>
				<Table size="small">
					<TableHead
						sx={{
							background: `linear-gradient(to right, ${selectedColor.lighter}, rgba(248, 250, 252, 0.8))`,
						}}
					>
						<TableRow>
							<TableCell
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								Contributor
							</TableCell>
							<TableCell
								align="right"
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								{title.split(" ")[0]}
							</TableCell>
							<TableCell
								align="right"
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								Percentage
							</TableCell>
							<TableCell
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
									width: "40%",
								}}
							>
								Distribution
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(({ user, count, percentage }, index) => (
							<TableRow
								key={user}
								className={`${bgHoverClass}`}
								sx={{
									transition: "all 0.2s ease",
									animation: `fadeIn 0.4s ease-out forwards ${index * 0.05}s`,
									opacity: 0,
									"@keyframes fadeIn": {
										"0%": { opacity: 0, transform: "translateY(5px)" },
										"100%": { opacity: 1, transform: "translateY(0)" },
									},
									"&:last-child td, &:last-child th": {
										borderBottom: 0,
									},
								}}
							>
								<TableCell
									component="th"
									scope="row"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
									}}
								>
									<Box className="flex items-center">
										<Avatar
											className={`w-7 h-7 mr-2 text-[0.8rem]`}
											sx={{
												background: selectedColor.gradient,
												fontSize: "0.8rem",
												boxShadow: `0 2px 5px ${selectedColor.main}40`,
											}}
										>
											{user.charAt(0).toUpperCase()}
										</Avatar>
										<Typography
											sx={{
												fontWeight: 500,
												fontSize: "0.875rem",
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											{user}
										</Typography>
									</Box>
								</TableCell>
								<TableCell
									align="right"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
										fontWeight: 600,
										color: selectedColor.main,
									}}
								>
									{count}
								</TableCell>
								<TableCell
									align="right"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
										fontWeight: 500,
									}}
								>
									{percentage}%
								</TableCell>
								<TableCell
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
									}}
								>
									<LinearProgress
										className="h-2.5 rounded-full"
										color={color}
										value={Number(percentage)}
										variant="determinate"
										sx={{
											backgroundColor: selectedColor.lighter,
											"& .MuiLinearProgress-bar": {
												background: selectedColor.gradient,
												borderRadius: "4px",
											},
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

interface StudentCardProps {
	student: string;
	isSelected: boolean;
	onSelect: () => void;
	id: string;
}

const StudentCard = ({
	student,
	isSelected,
	onSelect,
	id,
}: StudentCardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
		opacity: isDragging ? 0.8 : 1,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			{...attributes}
			sx={{
				width: { xs: "calc(50% - 8px)", sm: "calc(25% - 12px)" },
				cursor: "grab",
			}}
		>
			<Box
				className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
					isSelected
						? "bg-blue-500 text-white shadow-lg"
						: "bg-white hover:bg-blue-50"
				}`}
				sx={{
					border: "1px solid",
					borderColor: isSelected ? "transparent" : "rgba(0,0,0,0.1)",
					boxShadow: isSelected
						? "0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)"
						: "0 1px 3px rgba(0,0,0,0.05)",
				}}
				onClick={onSelect}
				{...listeners}
			>
				<Box className="flex items-center">
					<Avatar
						className={`w-10 h-10 mr-3 text-[1rem]`}
						sx={{
							background: isSelected
								? "rgba(255,255,255,0.2)"
								: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
							color: isSelected ? "white" : "white",
							fontWeight: 500,
							boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
						}}
					>
						{student.charAt(0).toUpperCase()}
					</Avatar>
					<Typography
						sx={{
							fontWeight: 500,
							fontSize: "1rem",
						}}
					>
						{student}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	const {
		selectedStudent,
		setSelectedStudent,
		studentOrder,
		setStudentOrder,
		reorderStudents,
	} = useStudentStore();

	// Use a ref to track if we've already initialized the student order
	const initializedRef = useRef(false);

	// Set up DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handle drag end event
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const activeIndex = studentOrder.findIndex(
				(student) => `student-${student}` === active.id
			);
			const overIndex = studentOrder.findIndex(
				(student) => `student-${student}` === over.id
			);

			if (activeIndex !== -1 && overIndex !== -1) {
				reorderStudents(activeIndex, overIndex);
			}
		}
	};

	// Update student order with actual contributors only once on initial load
	useEffect(() => {
		// Skip if we've already initialized
		if (initializedRef.current) return;

		const actualContributors = Array.from(
			new Set([
				...Object.keys(data.commits),
				...Object.keys(data.issues),
				...Object.keys(data.prs),
			])
		);

		// If we have actual contributors, update the generic student names
		if (actualContributors.length > 0) {
			const updatedOrder = [...studentOrder];
			for (
				let index = 0;
				index < Math.min(actualContributors.length, 4);
				index++
			) {
				updatedOrder[index] =
					actualContributors[index] || `Student ${index + 1}`;
			}
			setStudentOrder(updatedOrder);
			// Mark as initialized
			initializedRef.current = true;
		}
	}, [data, studentOrder, setStudentOrder]); // Include all dependencies but prevent infinite loop with ref

	// Calculate statistics data
	const { commitsByUser, issuesByUser, prsByUser } = useMemo(() => {
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

		// Helper function to sort by student order
		const sortByStudentOrder = (a: ContributorStats, b: ContributorStats) => {
			// If a student is selected, prioritize them
			if (selectedStudent) {
				if (a.user === selectedStudent) return -1;
				if (b.user === selectedStudent) return 1;
			}

			// Get indices from student order
			const aIndex = studentOrder.indexOf(a.user);
			const bIndex = studentOrder.indexOf(b.user);

			// If both users are in the student order
			if (aIndex !== -1 && bIndex !== -1) {
				return aIndex - bIndex; // Sort by student order
			}

			// If only one is in the student order, prioritize that one
			if (aIndex !== -1) return -1;
			if (bIndex !== -1) return 1;

			// For users not in the student order, sort by contribution count
			return b.count - a.count;
		};

		// Process all users to ensure they're included in the results
		const processContributions = (
			dataObject: Record<string, Array<any>>,
			totalCount: number
		): Array<ContributorStats> => {
			// First, create stats for all users in the data
			const stats = Object.entries(dataObject).map(([user, items]) => ({
				user,
				count: items.length,
				percentage: ((items.length / totalCount) * 100).toFixed(1),
			}));

			// Add entries with zero counts for students in studentOrder who don't have contributions
			studentOrder.forEach((student) => {
				if (!stats.some((stat) => stat.user === student)) {
					stats.push({
						user: student,
						count: 0,
						percentage: "0.0",
					});
				}
			});

			// Sort the combined results
			return stats.sort(sortByStudentOrder);
		};

		// Calculate contribution percentage for each user
		const commitsByUser = processContributions(data.commits, totalCommits);
		const issuesByUser = processContributions(data.issues, totalIssues);
		const prsByUser = processContributions(data.prs, totalPRs);

		return {
			totalCommits,
			totalIssues,
			totalPRs,
			uniqueContributors,
			commitsByUser,
			issuesByUser,
			prsByUser,
		};
	}, [data, selectedStudent, studentOrder]);

	return (
		<Box className="flex flex-col gap-8">
			<Box className="mb-6">
				<Typography className="mb-3" sx={{ fontWeight: 500 }} variant="h6">
					Select Student (Drag to Reorder)
				</Typography>
				<DndContext
					collisionDetection={closestCenter}
					sensors={sensors}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={studentOrder.map((student) => `student-${student}`)}
						strategy={horizontalListSortingStrategy}
					>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
							{studentOrder.map((student) => (
								<StudentCard
									key={`student-${student}`}
									id={`student-${student}`}
									isSelected={selectedStudent === student}
									student={student}
									onSelect={() => {
										setSelectedStudent(
											student === selectedStudent ? null : student
										);
									}}
								/>
							))}
						</Box>
					</SortableContext>
				</DndContext>
				{selectedStudent && (
					<Box className="mt-3 text-right">
						<Typography
							className="inline-block cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
							sx={{ fontWeight: 500 }}
							onClick={() => {
								setSelectedStudent(null);
							}}
						>
							Clear Selection
						</Typography>
					</Box>
				)}
			</Box>
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
};

export default SummaryTab;
