import { useState, useEffect } from "react";
import type { TokenMessage } from "@/types";

const STORAGE_KEY = "appAccessKey";

export interface UseAccessKeyManagementReturn {
	accessKey: string;
	accessKeyMessage: TokenMessage | null;
	hasSavedAccessKey: boolean;
	isAccessKeyRequired: boolean;
	handleAccessKeyChange: (value: string) => void;
	saveAccessKey: () => void;
	deleteAccessKey: () => void;
	handleAccessKeyMessageClose: () => void;
	validateAccessKey: () => boolean;
}

export function useAccessKeyManagement(): UseAccessKeyManagementReturn {
	const expectedAccessKey = import.meta.env.VITE_APP_ACCESS_KEY ?? "";
	const isAccessKeyRequired = expectedAccessKey.length > 0;

	const [accessKey, setAccessKey] = useState<string>("");
	const [accessKeyMessage, setAccessKeyMessage] =
		useState<TokenMessage | null>(null);
	const [hasSavedAccessKey, setHasSavedAccessKey] = useState<boolean>(false);

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			setAccessKey(saved);
			setHasSavedAccessKey(true);
		}
	}, []);

	const saveAccessKey = (): void => {
		const trimmed = accessKey.trim();
		if (!trimmed) {
			setAccessKeyMessage({
				message: "Please enter an access key to save",
				severity: "error",
			});
			return;
		}

		localStorage.setItem(STORAGE_KEY, trimmed);
		setHasSavedAccessKey(true);
		setAccessKeyMessage({
			message: "Access key saved to browser storage",
			severity: "success",
		});
	};

	const deleteAccessKey = (): void => {
		localStorage.removeItem(STORAGE_KEY);
		setHasSavedAccessKey(false);
		setAccessKey("");
		setAccessKeyMessage({
			message: "Access key removed from browser storage",
			severity: "success",
		});
	};

	const handleAccessKeyChange = (value: string): void => {
		setAccessKey(value);
	};

	const handleAccessKeyMessageClose = (): void => {
		setAccessKeyMessage(null);
	};

	const validateAccessKey = (): boolean => {
		if (!isAccessKeyRequired) return true;

		if (accessKey.trim() === expectedAccessKey) return true;

		setAccessKeyMessage({
			message: accessKey.trim()
				? "Invalid access key"
				: "Please enter the access key",
			severity: "error",
		});
		return false;
	};

	return {
		accessKey,
		accessKeyMessage,
		hasSavedAccessKey,
		isAccessKeyRequired,
		handleAccessKeyChange,
		saveAccessKey,
		deleteAccessKey,
		handleAccessKeyMessageClose,
		validateAccessKey,
	};
}
