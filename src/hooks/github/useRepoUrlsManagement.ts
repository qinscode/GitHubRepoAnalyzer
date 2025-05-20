import { useState, useEffect } from "react";
import type { TokenMessage } from "@/types";

export interface UseRepoUrlsManagementReturn {
	repoUrls: string;
	hasSavedUrls: boolean;
	autoSave: boolean;
	handleRepoUrlsChange: (newUrls: string) => void;
	handleAutoSaveChange: (autoSave: boolean) => void;
	setTokenMessage: (message: TokenMessage | null) => void;
}

export function useRepoUrlsManagement(
	setTokenMessage: (message: TokenMessage | null) => void
): UseRepoUrlsManagementReturn {
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [hasSavedUrls, setHasSavedUrls] = useState<boolean>(false);
	const [autoSave, setAutoSave] = useState<boolean>(() => {
		// Initialize autoSave from localStorage, default to true if not set
		const savedAutoSave = localStorage.getItem("githubAutoSave");
		return savedAutoSave === null ? true : savedAutoSave === "true";
	});

	// Load saved URLs from localStorage on component mount
	useEffect(() => {
		const savedUrls = localStorage.getItem("githubRepoUrls");
		if (savedUrls) {
			setRepoUrls(savedUrls);
			setHasSavedUrls(true);
		}
	}, []);

	// Effect for auto-saving
	useEffect(() => {
		if (autoSave && repoUrls.trim()) {
			localStorage.setItem("githubRepoUrls", repoUrls);
			setHasSavedUrls(!!repoUrls.trim());
		}
	}, [repoUrls, autoSave]);

	// Initialize autoSave preference in localStorage if not set
	useEffect(() => {
		if (localStorage.getItem("githubAutoSave") === null) {
			localStorage.setItem("githubAutoSave", "true");
		}
	}, []);

	const handleRepoUrlsChange = (newUrls: string): void => {
		setRepoUrls(newUrls);
		
		// If autoSave is off and there were saved URLs but now there are none, update hasSavedUrls
		if (!autoSave && hasSavedUrls && !newUrls.trim()) {
			setHasSavedUrls(false);
		}
	};

	// Handle autoSave toggle
	const handleAutoSaveChange = (newAutoSave: boolean): void => {
		setAutoSave(newAutoSave);
		localStorage.setItem("githubAutoSave", newAutoSave.toString());
		
		if (newAutoSave) {
			if (repoUrls.trim()) {
				localStorage.setItem("githubRepoUrls", repoUrls);
				setHasSavedUrls(true);
				setTokenMessage({
					message: "Auto-save enabled. Repository URLs saved to browser storage",
					severity: "success",
				});
			} else {
				setTokenMessage({
					message: "Auto-save enabled",
					severity: "success",
				});
			}
		} else {
			setTokenMessage({
				message: "Auto-save disabled",
				severity: "info",
			});
		}
	};

	return {
		repoUrls,
		hasSavedUrls,
		autoSave,
		handleRepoUrlsChange,
		handleAutoSaveChange,
		setTokenMessage,
	};
}
