import { create } from "zustand";

interface StudentState {
  studentOrder: Array<string>;
  setStudentOrder: (students: Array<string>) => void;
  reorderStudents: (fromIndex: number, toIndex: number) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  studentOrder: [], // Start with empty array, will be populated with actual contributors
  setStudentOrder: (studentOrder) => { set({ studentOrder }); },
  reorderStudents: (fromIndex, toIndex) => 
    { set((state) => {
      // Return unchanged state if indices are invalid
      if (
        fromIndex < 0 || 
        toIndex < 0 || 
        fromIndex >= state.studentOrder.length || 
        toIndex >= state.studentOrder.length
      ) {
        return state;
      }
      
      // Create a new array and reorder
      const newOrder = [...state.studentOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed as string);
      
      return { studentOrder: newOrder };
    }); },
})); 