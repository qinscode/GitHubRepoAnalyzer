import { Box, Link } from "@mui/material";
import DataTable, { type Column } from "../../utils/DataTable";
import CollapsibleContent from "../../utils/CollapsibleContent";
import type { ThemeConfig } from "./AnalysisThemes";
import LinkIcon from "@mui/icons-material/Link";

interface TabDataTableProps<T> {
	data: Array<T>;
	itemType: "issue" | "pullRequest" | "commit";
	theme: ThemeConfig;
	maxChars?: number;
	emptyMessage?: string;
}

/**
 * Reusable component for rendering data tables across different tabs
 */
const TabDataTable = <
	T extends {
		title?: string;
		message?: string;
		body?: string;
		date?: string;
		id?: string;
		url?: string;
	},
>({
	data,
	itemType,
	theme,
	maxChars = 150,
	emptyMessage,
}: TabDataTableProps<T>) => {
	// Format data for table presentation
	const tableData = data.map((item, index) => ({
		number: index + 1,
		title: item.title || item.message || "",
		description: item.body || "",
		date: item.date || "18/05/2025 14:30",
		id: item.id || `item-${index}`,
		url: item.url || "",
	}));

	// Define columns based on item type
	const getColumns = (): Array<Column> => {
		const baseColumns: Array<Column> = [
			{ id: "number", label: "#", width: "5%" },
			{
				id: "title",
				label:
					itemType === "commit"
						? "Commit Message"
						: itemType === "pullRequest"
							? "Pull Request Title"
							: "Issue Title",
				width: itemType === "commit" ? "50%" : "25%",
			},
		];

		// Only add description column for PRs and issues (not for commits which use title for message)
		if (itemType !== "commit") {
			baseColumns.push({
				id: "description",
				label: "Description",
				format: (value: string) =>
					value ? (
						<CollapsibleContent
							color={theme.main}
							maxChars={maxChars}
							text={value}
						/>
					) : (
						<span
							style={{
								color: "#666",
								fontStyle: "italic",
								fontSize: "0.85rem",
							}}
						>
							No description provided
						</span>
					),
			});
		}

		// Add date column
		baseColumns.push({ id: "date", label: "Date", width: "15%" });

		// Add URL column
		baseColumns.push({
			id: "url",
			label: "Link",
			width: "14%",
			format: (value: string) =>
				value ? (
					<Link
						href={value}
						rel="noopener noreferrer"
						target="_blank"
						sx={{
							display: "flex",
							alignItems: "center",
							color: theme.main,
							"&:hover": {
								textDecoration: "none",
								opacity: 0.8,
							},
						}}
					>
						<LinkIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
						Open
					</Link>
				) : (
					<span
						style={{ color: "#666", fontStyle: "italic", fontSize: "0.85rem" }}
					>
						No link
					</span>
				),
		});

		return baseColumns;
	};

	return (
		<Box sx={{ position: "relative", overflow: "auto" }}>
			<DataTable
				columns={getColumns()}
				data={tableData}
				emptyMessage={emptyMessage || `No ${itemType}s available`}
				getRowKey={(row): string => row.id as string}
				lightColor={theme.light}
				lighterColor={theme.lighter}
				primaryColor={theme.main}
			/>
		</Box>
	);
};

export default TabDataTable;
