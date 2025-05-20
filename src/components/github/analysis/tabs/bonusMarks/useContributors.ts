import { useMemo } from "react";
import { RepoData } from "@/services/github";

export const useContributors = (
	data: RepoData,
	studentOrder: Array<string>
) => {
	// Get all unique contributors from commits, issues, and PRs
	return useMemo(() => {
		const uniqueContributors = new Set<string>();

		// Add contributors from commits
		Object.keys(data.commits || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);
		// Add contributors from issues
		Object.keys(data.issues || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);
		// Add contributors from PRs
		Object.keys(data.prs || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);

		// Convert to array and sort by student order
		return Array.from(uniqueContributors).sort((a, b) => {
			const indexA = studentOrder.indexOf(a);
			const indexB = studentOrder.indexOf(b);

			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}

			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// For users not in the student order, sort alphabetically
			return a.localeCompare(b);
		});
	}, [data, studentOrder]);
};
