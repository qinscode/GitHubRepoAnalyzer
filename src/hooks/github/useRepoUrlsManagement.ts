import { useState, useEffect } from "react";
import type { TokenMessage } from "@/types";

export interface UseRepoUrlsManagementReturn {
	repoUrls: string;
	hasSavedUrls: boolean;
	handleRepoUrlsChange: (newUrls: string) => void;
	handleRepoUrlsSave: () => void;
	handleRepoUrlsDelete: () => void;
	setTokenMessage: (message: TokenMessage | null) => void;
}

export function useRepoUrlsManagement(
	setTokenMessage: (message: TokenMessage | null) => void
): UseRepoUrlsManagementReturn {
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [hasSavedUrls, setHasSavedUrls] = useState<boolean>(false);

	// Load saved URLs from localStorage on component mount
	useEffect(() => {
		const savedUrls = localStorage.getItem("githubRepoUrls");
		if (savedUrls) {
			setRepoUrls(savedUrls);
			setHasSavedUrls(true);
		}
	}, []);

	const handleRepoUrlsChange = (newUrls: string): void => {
		setRepoUrls(newUrls);
	};

	// Save URLs to localStorage
	const handleRepoUrlsSave = (): void => {
		if (repoUrls.trim()) {
			localStorage.setItem("githubRepoUrls", repoUrls);
			setHasSavedUrls(true);
			setTokenMessage({
				message: "Repository URLs saved to browser storage",
				severity: "success",
			});
		} else {
			setTokenMessage({
				message: "Please enter URLs to save",
				severity: "error",
			});
		}
	};

	// Delete URLs from localStorage
	const handleRepoUrlsDelete = (): void => {
		localStorage.removeItem("githubRepoUrls");
		setHasSavedUrls(false);
		setTokenMessage({
			message: "Repository URLs removed from browser storage",
			severity: "success",
		});
	};

	return {
		repoUrls,
		hasSavedUrls,
		handleRepoUrlsChange,
		handleRepoUrlsSave,
		handleRepoUrlsDelete,
		setTokenMessage,
	};
}
