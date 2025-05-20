import { ContributorStat, ChartDataPoint, MATERIAL_COLORS, DASH_PATTERNS } from '../components/chart-types';

/**
 * Formats a Unix timestamp (seconds) to a date string
 */
export const formatWeekDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
};

/**
 * Prepares chart data from contributor stats
 */
export const prepareChartData = (
  limitedContributorStats: ContributorStat[],
  maxWeeks = 16
): ChartDataPoint[] => {
  if (limitedContributorStats.length === 0) {
    return [];
  }

  // Get all timestamps from all contributors
  const allTimestamps = new Set<number>();
  limitedContributorStats.forEach((contributor) => {
    contributor.weeks.forEach((week) => {
      allTimestamps.add(week.w);
    });
  });

  // Sort timestamps chronologically
  const sortedTimestamps = Array.from(allTimestamps).sort();

  // Get the most recent weeks with activity
  const recentTimestamps = sortedTimestamps.slice(-maxWeeks);

  // Create a map of contributors data
  const contributorsData: Record<string, Record<number, number>> = {};
  const additionsData: Record<string, Record<number, number>> = {};
  const deletionsData: Record<string, Record<number, number>> = {};

  // Initialize data structure for each contributor
  limitedContributorStats.forEach((contributor) => {
    const login = contributor.author.login;

    contributorsData[login] = {};
    additionsData[login] = {};
    deletionsData[login] = {};

    // Initialize all timestamps with 0 commits
    recentTimestamps.forEach((timestamp) => {
      contributorsData[login]![timestamp] = 0;
      additionsData[login]![timestamp] = 0;
      deletionsData[login]![timestamp] = 0;
    });

    // Fill in actual commit counts
    contributor.weeks.forEach((week) => {
      if (recentTimestamps.includes(week.w)) {
        contributorsData[login]![week.w] = week.c;
        additionsData[login]![week.w] = week.a;
        deletionsData[login]![week.w] = week.d;
      }
    });
  });

  // Format data for the chart
  return recentTimestamps.map((timestamp) => {
    const dataPoint: ChartDataPoint = {
      name: formatWeekDate(timestamp),
      timestamp: timestamp,
    };

    // Add commit count for each contributor
    Object.entries(contributorsData).forEach(([user, data]) => {
      dataPoint[user] = data[timestamp] || 0;
      dataPoint[`${user}_additions`] = additionsData[user]?.[timestamp] || 0;
      dataPoint[`${user}_deletions`] = deletionsData[user]?.[timestamp] || 0;
    });

    return dataPoint;
  });
};

/**
 * Generate contributor colors
 */
export const generateContributorColors = (
  contributors: ContributorStat[],
  primaryColor: string
): Record<string, string> => {
  if (contributors.length === 0) return {};

  const colors: Record<string, string> = {};

  contributors.forEach((contributor, index) => {
    const login = contributor.author.login;
    if (index < MATERIAL_COLORS.length) {
      colors[login] = MATERIAL_COLORS[index] || primaryColor;
    } else {
      // Fall back to the original color generation logic
      const hue = (index * 137.5) % 360; // Golden angle approximation for better distribution
      colors[login] = `hsl(${hue}, 70%, 60%)`;
    }
  });

  return colors;
};

/**
 * Generate contributor dash patterns
 */
export const generateContributorDashPatterns = (
  contributors: ContributorStat[]
): Record<string, string> => {
  if (contributors.length === 0) return {};

  const patterns: Record<string, string> = {};

  contributors.forEach((contributor, index) => {
    const login = contributor.author.login;
    patterns[login] = DASH_PATTERNS[index % DASH_PATTERNS.length] || "";
  });

  return patterns;
};

/**
 * Calculate the maximum Y axis value based on commit counts
 */
export const calculateYAxisMax = (
  chartData: ChartDataPoint[],
  contributors: ContributorStat[],
  hiddenContributors: Set<string>
): number => {
  const maxCommitCount = Math.max(
    ...chartData.flatMap((point) => {
      const commitCounts: Array<number> = [];

      contributors
        .filter((c) => !hiddenContributors.has(c.author.login))
        .forEach((c) => {
          const login = c.author.login;
          const value = point[login];
          if (typeof value === "number") {
            commitCounts.push(value);
          } else {
            commitCounts.push(0);
          }
        });

      return commitCounts;
    })
  );

  // Add a 20% buffer to the max commit count
  return Math.ceil(maxCommitCount * 1.2);
}; 