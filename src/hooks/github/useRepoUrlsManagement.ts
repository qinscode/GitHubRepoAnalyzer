import { useState, useEffect, useCallback, useRef } from "react";
import type { TokenMessage } from "@/types";

// Debounce timeout in milliseconds
const DEBOUNCE_DELAY = 800;

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
	
	// Debounce timer reference
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Load saved URLs from localStorage on component mount
	useEffect(() => {
		const savedUrls = localStorage.getItem("githubRepoUrls");
		if (savedUrls) {
			setRepoUrls(savedUrls);
			setHasSavedUrls(true);
		}
	}, []);

	// Debounced save function
	const debouncedSave = useCallback((urlsToSave: string) => {
		// Clear any existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Set new timer
		debounceTimerRef.current = setTimeout(() => {
			// Always save the value, even if it's empty
			localStorage.setItem("githubRepoUrls", urlsToSave);
			setHasSavedUrls(!!urlsToSave.trim());
			debounceTimerRef.current = null;
		}, DEBOUNCE_DELAY);
	}, []);

	// Effect for auto-saving with debounce
	useEffect(() => {
		if (autoSave) {
			// Always call debouncedSave, even if repoUrls is empty
			debouncedSave(repoUrls);
		}
	}, [repoUrls, autoSave, debouncedSave]);

	// Cleanup the debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

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
			// Always save immediately when enabling auto-save, even if empty
			localStorage.setItem("githubRepoUrls", repoUrls);
			setHasSavedUrls(!!repoUrls.trim());
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
