// Theme configurations for different analysis tabs

export type ThemeConfig = {
  main: string;
  light: string;
  lighter: string;
  gradient: string;
  textColor: string;
};

export const issuesTheme: ThemeConfig = {
  main: "#8B5CF6", // purple
  light: "rgba(139, 92, 246, 0.1)",
  lighter: "rgba(139, 92, 246, 0.05)",
  gradient: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
  textColor: "#5B21B6"
};

export const pullRequestsTheme: ThemeConfig = {
  main: "#F59E0B", // amber
  light: "rgba(245, 158, 11, 0.1)",
  lighter: "rgba(245, 158, 11, 0.05)",
  gradient: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
  textColor: "#B45309"
};

export const commitsTheme: ThemeConfig = {
  main: "#10B981", // green
  light: "rgba(16, 185, 129, 0.1)",
  lighter: "rgba(16, 185, 129, 0.05)",
  gradient: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
  textColor: "#065F46"
};

export const bonusMarksTheme: ThemeConfig = {
  main: "#06B6D4", // cyan
  light: "rgba(6, 182, 212, 0.1)",
  lighter: "rgba(6, 182, 212, 0.05)",
  gradient: "linear-gradient(90deg, #06B6D4 0%, #22D3EE 100%)",
  textColor: "#0E7490"
}; 