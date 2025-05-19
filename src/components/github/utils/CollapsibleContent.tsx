import React, { useState, type FC, type ReactElement, useEffect } from "react";
import { Button, Typography, alpha } from "@mui/material";
import { MoreHoriz as MoreIcon } from "@mui/icons-material";
import { useCollapseStore } from "@/hooks/useCollapseStore";

interface CollapsibleContentProps {
	text: string;
	maxChars?: number;
	color: string;
}

/**
 * A reusable component for displaying collapsible text content
 * Used in tables for descriptions that may be lengthy
 */
const CollapsibleContent: FC<CollapsibleContentProps> = ({
	text,
	maxChars = 150,
	color,
}): ReactElement => {
	const [expanded, setExpanded] = useState(false);
	const { isAllExpanded } = useCollapseStore();
	const shouldCollapse = text.length > maxChars;

	// Update local expanded state when global state changes
	useEffect(() => {
		if (shouldCollapse) {
			setExpanded(isAllExpanded);
		}
	}, [isAllExpanded, shouldCollapse]);

	const toggleExpanded = (): void => {
		setExpanded(!expanded);
	};

	// If text is shorter than threshold, just display it
	if (!shouldCollapse) {
		return (
			<Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
				{text}
			</Typography>
		);
	}

	return (
		<>
			<Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
				{expanded ? text : `${text.substring(0, maxChars)}...`}
			</Typography>
			<Button
				size="small"
				startIcon={<MoreIcon />}
				sx={{
					mt: 1,
					color: color,
					fontSize: "0.75rem",
					"&:hover": {
						backgroundColor: alpha(color, 0.08),
					},
				}}
				onClick={toggleExpanded}
			>
				{expanded ? "Show less" : "Show more"}
			</Button>
		</>
	);
};

export default CollapsibleContent;
