import { create } from "zustand";

interface CollapseState {
	isAllExpanded: boolean;
	toggleAll: () => void;
	setExpanded: (expanded: boolean) => void;
}

export const useCollapseStore = create<CollapseState>((set) => ({
	isAllExpanded: false,
	toggleAll: () => {
		set((state) => ({ isAllExpanded: !state.isAllExpanded }));
	},
	setExpanded: (expanded: boolean) => {
		set({ isAllExpanded: expanded });
	},
}));
