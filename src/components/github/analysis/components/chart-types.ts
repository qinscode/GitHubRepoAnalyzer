// Define chart-related types for GitHub analysis components

export interface ContributorStat {
	author: {
		login: string;
		id: number;
		type: string;
	};
	total: number;
	weeks: Array<{
		w: number; // Unix timestamp for start of week
		a: number; // Additions
		d: number; // Deletions
		c: number; // Commits
	}>;
}

export interface ChartDataPoint extends Record<string, number | string> {
	name: string;
	timestamp: number;
}

export const MATERIAL_COLORS = [
	"#3f51b5", // indigo
	"#f44336", // red
	"#009688", // teal
	"#ff9800", // orange
	"#9c27b0", // purple
	"#2196f3", // blue
	"#ff5722", // deep orange
	"#4caf50", // green
	"#673ab7", // deep purple
	"#03a9f4", // light blue
	"#e91e63", // pink
	"#8bc34a", // light green
];

// Line dash patterns for additional visual distinction
export const DASH_PATTERNS = ["", "5 5", "3 3", "5 2 2 2", "8 3 2 3"]; 