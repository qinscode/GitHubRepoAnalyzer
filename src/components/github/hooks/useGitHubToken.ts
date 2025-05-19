import { useState, useEffect } from "react";

export interface TokenMessage {
	message: string;
	severity: "success" | "error" | "info";
}

export const useGitHubToken = (): {
	token: string;
	tokenMessage: TokenMessage | null;
	hasSavedToken: boolean;
	hasPresetToken: boolean;
	handleTokenChange: (newToken: string) => void;
	saveToken: () => void;
	deleteToken: () => void;
	handleTokenMessageClose: () => void;
} => {
	const [token, setToken] = useState<string>("");
	const [tokenMessage, setTokenMessage] = useState<TokenMessage | null>(null);

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
		handleTokenChange,
		saveToken,
		deleteToken,
		handleTokenMessageClose,
	};
};
