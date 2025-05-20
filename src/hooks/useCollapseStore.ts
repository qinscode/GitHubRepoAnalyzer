import { create } from "zustand";

interface CollapseState {
	isAllExpanded: boolean;
	toggleAll: () => void;
	setExpanded: (expanded: boolean) => void;
}

// Load initial state from localStorage or use default value
const getInitialState = (): boolean => {
	try {
		const savedState = localStorage.getItem("isAllExpanded");
		return savedState !== null ? (JSON.parse(savedState) as boolean) : false;
	} catch (error) {
		console.error("Failed to load expand state from localStorage:", error);
		return false;
	}
};

// Save state to localStorage
const saveState = (state: boolean): void => {
	try {
		localStorage.setItem("isAllExpanded", JSON.stringify(state));
	} catch (error) {
		console.error("Failed to save expand state to localStorage:", error);
	}
};

export const useCollapseStore = create<CollapseState>((set) => ({
	isAllExpanded: getInitialState(),
	toggleAll: () => {
		set((state) => {
			const newState = !state.isAllExpanded;
			saveState(newState);
			return { isAllExpanded: newState };
		});
	},
	setExpanded: (expanded: boolean) => {
		saveState(expanded);
		set({ isAllExpanded: expanded });
	},
}));
