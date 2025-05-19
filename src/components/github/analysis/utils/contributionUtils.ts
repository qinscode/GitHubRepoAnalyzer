import { ContributorStats } from "@/types/github";
import { RepoData } from "@/services/github/types";

/**
 * Sorts contributors based on student order
 */
export const sortByStudentOrder = (
	a: ContributorStats,
	b: ContributorStats,
	studentOrder: Array<string>
): number => {
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

/**
 * Processes contribution data to include all students and sort by order
 */
export const processContributions = (
	dataObject: Record<string, Array<any>>,
	totalCount: number,
	studentOrder: Array<string>
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
	return stats.sort((a, b) => sortByStudentOrder(a, b, studentOrder));
};

/**
 * Calculates contribution statistics from repo data
 */
export const calculateContributionStats = (
	data: RepoData,
	studentOrder: Array<string>
) => {
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
	const commitsByUser = processContributions(
		data.commits,
		totalCommits,
		studentOrder
	);
	const issuesByUser = processContributions(
		data.issues,
		totalIssues,
		studentOrder
	);
	const prsByUser = processContributions(data.prs, totalPRs, studentOrder);

	return {
		totalCommits,
		totalIssues,
		totalPRs,
		uniqueContributors,
		commitsByUser,
		issuesByUser,
		prsByUser,
	};
};
