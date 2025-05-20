import { Box } from "@mui/material";
import { EmojiEvents as BonusIcon } from "@mui/icons-material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import AnalysisTabLayout from "../../components/layout/AnalysisTabLayout.tsx";
import { useStudentStore } from "@/store/useStudentStore";
import { BonusMarksTabProps } from "./types";
import { useContributors } from "./useContributors";
import { useBonusMarks } from "./useBonusMarks";
import { menuProps, selectStyles } from "./styles";
import WarningAlert from "./WarningAlert";
import ContributorsTable from "./ContributorsTable";
import { useCallback, useEffect } from "react";

function BonusMarksTab({ data }: BonusMarksTabProps) {
  const { studentOrder, updateStudentOrder, setStudentOrder, reorderStudents } = useStudentStore();
  const contributors = useContributors(data, studentOrder);
  const { bonusMarks, totalBonusMarks, handleMarkChange } = useBonusMarks(contributors);

  // Initialize student order if empty
  useEffect(() => {
    if (studentOrder.length === 0 && contributors.length > 0) {
      setStudentOrder(contributors);
    } else if (contributors.length > 0) {
      // Make sure all contributors are in the student order
      const newContributors = contributors.filter(
        (contributor) => !studentOrder.includes(contributor)
      );
      
      if (newContributors.length > 0) {
        updateStudentOrder([...studentOrder, ...newContributors]);
      }
    }
  }, [contributors, studentOrder, setStudentOrder, updateStudentOrder]);

  // Handle reordering of contributors
  const handleReorder = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;

    // Find indices in studentOrder
    const oldIndex = studentOrder.indexOf(activeId);
    const newIndex = studentOrder.indexOf(overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Use the reorderStudents method to update the order
      reorderStudents(oldIndex, newIndex);
    } else if (oldIndex === -1 && newIndex !== -1) {
      // If activeId is not in the order, add it and then reorder
      const updatedOrder = [...studentOrder, activeId];
      updateStudentOrder(updatedOrder);
      
      // Reorder from the end to the target position
      const newOldIndex = updatedOrder.length - 1;
      reorderStudents(newOldIndex, newIndex);
    }
  }, [studentOrder, reorderStudents, updateStudentOrder]);

  return (
    <AnalysisTabLayout
      creatorCount={contributors.length}
      creatorLabel="Total"
      showMoreSwitch={false}
      theme={bonusMarksTheme}
      title="Bonus Marks Analysis"
      totalCount={contributors.length}
      statsIcon={
        <BonusIcon
          sx={{
            color: bonusMarksTheme.main,
            fontSize: "1.1rem",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
          }}
        />
      }
    >
      <Box sx={{ position: "relative", overflow: "auto" }}>
        <WarningAlert totalBonusMarks={totalBonusMarks} />
        <ContributorsTable
          contributors={contributors}
          bonusMarks={bonusMarks}
          totalBonusMarks={totalBonusMarks}
          handleMarkChange={handleMarkChange}
          studentOrder={studentOrder}
          menuProps={menuProps}
          selectStyles={selectStyles}
          onReorder={handleReorder}
        />
      </Box>
    </AnalysisTabLayout>
  );
}

export default BonusMarksTab; 