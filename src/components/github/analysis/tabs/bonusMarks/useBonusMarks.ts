import { useState, useMemo } from "react";
import { BonusMark } from "./types";

export const useBonusMarks = (contributors: Array<string>) => {
	// State to store bonus marks for each contributor
	const [bonusMarks, setBonusMarks] = useState<Record<string, BonusMark>>(
		Object.fromEntries(
			contributors.map((user) => [
				user,
				{
					id: user,
					user,
					mark: 0,
				},
			])
		)
	);

	// Calculate total bonus marks
	const totalBonusMarks = useMemo(
		() => Object.values(bonusMarks).reduce((sum, { mark }) => sum + mark, 0),
		[bonusMarks]
	);

	// Handle bonus mark change
	const handleMarkChange = (user: string, value: number): void => {
		const currentMark = bonusMarks[user]?.mark ?? 0;
		const newTotal = totalBonusMarks - currentMark + value;

		// Only allow the change if the new total would be <= 4
		if (newTotal <= 4) {
			setBonusMarks((previous) => ({
				...previous,
				[user]: {
					...previous[user],
					mark: value,
				} as BonusMark,
			}));
		}
	};

	return { bonusMarks, totalBonusMarks, handleMarkChange };
};
