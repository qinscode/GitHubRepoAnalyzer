import { useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
} from "recharts";
import { ContributorStat, ChartDataPoint } from "./chart-types";
import ChartTooltipContent, { ChartTooltipLabel } from "./ChartTooltipContent";

interface CommitLineChartProps {
  chartData: ChartDataPoint[];
  contributorStats: ContributorStat[];
  contributorColors: Record<string, string>;
  contributorDashPatterns: Record<string, string>;
  hiddenContributors: Set<string>;
  highlightedContributor: string | null;
  yAxisMax: number;
  onLegendClick: (dataKey: string) => void;
  onLineMouseEnter: (dataKey: string) => void;
  onLineMouseLeave: () => void;
}

/**
 * Component to render the contributor commits line chart
 */
const CommitLineChart = ({
  chartData,
  contributorStats,
  contributorColors,
  contributorDashPatterns,
  hiddenContributors,
  highlightedContributor,
  yAxisMax,
  onLegendClick,
  onLineMouseEnter,
  onLineMouseLeave,
}: CommitLineChartProps) => {
  // Handle tooltip content formatting
  const tooltipFormatter = useCallback(
    (value: number, _name: string, entry: any) => {
      const dataKey = entry.dataKey as string;
      // Check if this is a regular contributor line
      if (
        !dataKey.includes("_additions") &&
        !dataKey.includes("_deletions")
      ) {
        const additions = entry.payload[`${dataKey}_additions`] || 0;
        const deletions = entry.payload[`${dataKey}_deletions`] || 0;
        return [
          <ChartTooltipContent
            key={`tooltip-${dataKey}`}
            value={value}
            dataKey={dataKey}
            color={contributorColors[dataKey] || "#333"}
            additions={additions}
            deletions={deletions}
          />,
          <ChartTooltipLabel 
            key={`tooltip-label-${dataKey}`}
            dataKey={dataKey} 
            color={contributorColors[dataKey] || "#333"} 
          />,
        ];
      }
      return ["", ""];
    },
    [contributorColors]
  );

  // Format legend items
  const legendFormatter = useCallback(
    (value: string, _entry: any) => {
      const isHidden = hiddenContributors.has(value);
      return (
        <span
          style={{
            color: isHidden
              ? "rgba(55, 65, 81, 0.4)"
              : "rgba(55, 65, 81, 0.8)",
            textDecoration: isHidden ? "line-through" : "none",
            cursor: "pointer",
            fontWeight: highlightedContributor === value ? "bold" : "normal",
          }}
        >
          {value}
        </span>
      );
    },
    [hiddenContributors, highlightedContributor]
  );

  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart
        data={chartData}
        margin={{ bottom: 20, left: 0, right: 20, top: 15 }}
        onMouseLeave={onLineMouseLeave}
      >
        <defs>
          {contributorStats.map((contributor) => (
            <linearGradient
              key={`gradient-${contributor.author.login}`}
              id={`colorGradient-${contributor.author.login}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={contributorColors[contributor.author.login]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={contributorColors[contributor.author.login]}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid opacity={0.08} strokeDasharray="3 3" />

        <XAxis
          angle={-45}
          dataKey="name"
          height={50}
          textAnchor="end"
          tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
          tickMargin={8}
        />

        <YAxis
          allowDecimals={false}
          domain={[0, yAxisMax]}
          tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
          label={{
            angle: -90,
            position: "insideLeft",
            style: {
              fill: "rgba(55, 65, 81, 0.8)",
              fontSize: 12,
              textAnchor: "middle",
            },
            value: "Commits",
          }}
        />

        <Tooltip
          animationDuration={300}
          labelFormatter={(label: string) => `Week of ${label}`}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            padding: "10px 14px",
            backdropFilter: "blur(6px)",
          }}
          formatter={tooltipFormatter}
        />

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "15px" }}
          formatter={legendFormatter}
          onClick={(data) => {
            if (data.dataKey) {
              onLegendClick(data.dataKey as string);
            }
          }}
        />

        {/* Add hidden lines for all contributors to keep them in the legend */}
        {contributorStats.map((contributor) => {
          const login = contributor.author.login;
          if (hiddenContributors.has(login)) {
            return (
              <Line
                key={`hidden-${login}`}
                dataKey={login}
                fill="transparent"
                legendType="none"
                name={login}
                stroke="transparent"
              />
            );
          }
          return null;
        })}

        {contributorStats.map((contributor) => {
          const login = contributor.author.login;
          const color = contributorColors[login] || "#333";
          const dashPattern = contributorDashPatterns[login];
          const isHighlighted = highlightedContributor === login;
          const isHidden = hiddenContributors.has(login);

          if (isHidden) return null;

          return (
            <Line
              key={login}
              connectNulls
              animationDuration={1000}
              dataKey={login}
              name={login}
              stroke={color}
              strokeDasharray={dashPattern}
              strokeWidth={isHighlighted ? 3 : 1.5}
              type="monotone"
              activeDot={{
                r: 6,
                stroke: color,
                strokeWidth: 2,
                fill: "white",
              }}
              dot={{
                r: isHighlighted ? 4 : 3,
                fill: color,
                strokeWidth: 0,
              }}
              strokeOpacity={
                highlightedContributor && !isHighlighted ? 0.3 : 1
              }
              onMouseLeave={onLineMouseLeave}
              onMouseEnter={() => {
                onLineMouseEnter(login);
              }}
            />
          );
        })}

        {contributorStats.map((contributor) => {
          const login = contributor.author.login;
          const isHidden = hiddenContributors.has(login);

          if (isHidden) return null;

          return (
            <Customized
              key={`area-${login}`}
              component={(props: any) => {
                // Don't render the area if this contributor is not highlighted
                if (
                  highlightedContributor &&
                  highlightedContributor !== login
                ) {
                  return null;
                }

                // Get the points for this contributor's line
                const { points } = props;
                if (!points || points.length === 0) return null;

                // Create an area path under the line
                const firstPoint = points[0];
                const lastPoint = points[points.length - 1];

                const d = [
                  // Start at the first point
                  `M ${firstPoint.x},${firstPoint.y}`,
                  // Add all line segments
                  ...points
                    .slice(1)
                    .map((point: any) => `L ${point.x},${point.y}`),
                  // Go down to the bottom
                  `L ${lastPoint.x},${props.yAxis.y}`,
                  // Go left to the left edge
                  `L ${firstPoint.x},${props.yAxis.y}`,
                  // Close the path
                  "Z",
                ].join(" ");

                return (
                  <path
                    d={d}
                    fill={`url(#colorGradient-${login})`}
                    opacity={0.1}
                    stroke="none"
                  />
                );
              }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommitLineChart; 