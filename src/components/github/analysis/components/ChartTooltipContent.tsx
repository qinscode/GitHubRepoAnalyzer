interface ChartTooltipContentProps {
	value: number;
	dataKey: string;
	color: string;
	additions: number;
	deletions: number;
}

/**
 * Custom tooltip content for commit chart
 */
const ChartTooltipContent = ({
	value,
	dataKey,
	additions,
	deletions,
}: ChartTooltipContentProps) => {
	return (
		<div style={{ padding: "2px 0", fontSize: "0.8rem" }}>
			<div style={{ fontWeight: "bold" }}>
				<span style={{ fontSize: "0.75rem" }}>{dataKey}</span>: {value} Commits
			</div>
			<div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
				+{additions} / -{deletions} lines
			</div>
		</div>
	);
};

/**
 * Custom label for tooltip item
 */
export const ChartTooltipLabel = ({
	dataKey,
	color,
}: {
	dataKey: string;
	color: string;
}) => {
	return (
		<span
			style={{
				color: color,
				fontWeight: "bold",
				display: "flex",
				alignItems: "center",
				fontSize: "0.75rem",
			}}
		>
			<span
				style={{
					display: "inline-block",
					width: "8px",
					height: "8px",
					borderRadius: "50%",
					backgroundColor: color,
					marginRight: "5px",
				}}
			/>
			{dataKey}
		</span>
	);
};

export default ChartTooltipContent;
