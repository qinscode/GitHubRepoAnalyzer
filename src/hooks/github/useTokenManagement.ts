import { useState, useEffect } from "react";
import type { TokenMessage } from "@/types";
import { fetchRateLimitStatus } from "@/services/github/api";

export interface UseTokenManagementReturn {
	token: string;
	tokenMessage: TokenMessage | null;
	hasSavedToken: boolean;
	hasPresetToken: boolean;
	rateLimitRemaining: number | null;
	rateLimitResetAt: number | null;
	rateLimitLoading: boolean;
	handleTokenChange: (newToken: string) => void;
	saveToken: () => void;
	deleteToken: () => void;
	handleTokenMessageClose: () => void;
}

export function useTokenManagement(): UseTokenManagementReturn {
	const [token, setToken] = useState<string>("");
	const [tokenMessage, setTokenMessage] = useState<TokenMessage | null>(null);
	const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(
		null
	);
	const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
	const [rateLimitLoading, setRateLimitLoading] = useState<boolean>(false);

	// Get the GitHub token from localStorage first, then fallback to environment variables
	useEffect(() => {
		const savedToken = localStorage.getItem("githubToken");
		if (savedToken) {
			setToken(savedToken);
		} else {
			const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
			if (presetToken) {
				setToken(presetToken);
			}
		}
	}, []);

	useEffect(() => {
		let isCancelled = false;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const loadRateLimit = async (): Promise<void> => {
			if (!token.trim()) {
				setRateLimitRemaining(null);
				setRateLimitResetAt(null);
				setRateLimitLoading(false);
				return;
			}

			setRateLimitLoading(true);

			try {
				const { remaining, resetAt } = await fetchRateLimitStatus(token.trim());
				if (!isCancelled) {
					setRateLimitRemaining(remaining);
					setRateLimitResetAt(resetAt);
				}
			} catch {
				if (!isCancelled) {
					setRateLimitRemaining(null);
					setRateLimitResetAt(null);
				}
			} finally {
				if (!isCancelled) {
					setRateLimitLoading(false);
				}
			}
		};

		timeoutId = setTimeout(() => {
			void loadRateLimit();
		}, 400);

		return () => {
			isCancelled = true;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [token]);

	// Check if there's a saved token in localStorage
	const hasSavedToken = !!localStorage.getItem("githubToken");

	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	// Save token to localStorage
	const saveToken = (): void => {
		if (token.trim()) {
			localStorage.setItem("githubToken", token);
			setTokenMessage({
				message: "GitHub token saved to browser storage",
				severity: "success",
			});
		} else {
			setTokenMessage({
				message: "Please enter a token to save",
				severity: "error",
			});
		}
	};

	// Delete token from localStorage
	const deleteToken = (): void => {
		localStorage.removeItem("githubToken");
		setTokenMessage({
			message: "GitHub token removed from browser storage",
			severity: "success",
		});

		// Fallback to environment variable token if available
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		} else {
			setToken("");
		}
	};

	const handleTokenChange = (newToken: string): void => {
		setToken(newToken);
	};

	const handleTokenMessageClose = (): void => {
		setTokenMessage(null);
	};

	return {
		token,
		tokenMessage,
		hasSavedToken,
		hasPresetToken,
		rateLimitRemaining,
		rateLimitResetAt,
		rateLimitLoading,
		handleTokenChange,
		saveToken,
		deleteToken,
		handleTokenMessageClose,
	};
}
