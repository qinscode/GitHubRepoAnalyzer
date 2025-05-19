import { useState, useMemo } from "react";
import { Box, Typography, Select, MenuItem, FormControl, Alert, Tooltip } from "@mui/material";
import { EmojiEvents as BonusIcon, Warning as WarningIcon } from "@mui/icons-material";
import type { RepoData } from "../../types/types.ts";
import AnalysisTabLayout from "../components/AnalysisTabLayout";
import { bonusMarksTheme } from "../components/AnalysisThemes";
import DataTable, { type Column } from "../../utils/DataTable";

interface BonusMarksTabProps {
  data: RepoData;
}

interface BonusMark {
  id: string;
  user: string;
  mark: number;
  studentId: string | null;
}

function BonusMarksTab({ data }: BonusMarksTabProps): JSX.Element {
  // Get all unique contributors from commits, issues, and PRs
  const contributors = useMemo(() => {
    const uniqueContributors = new Set<string>();
    
    // Add contributors from commits
    Object.keys(data.commits || {}).forEach(contributor => uniqueContributors.add(contributor));
    // Add contributors from issues
    Object.keys(data.issues || {}).forEach(contributor => uniqueContributors.add(contributor));
    // Add contributors from PRs
    Object.keys(data.prs || {}).forEach(contributor => uniqueContributors.add(contributor));
    
    return Array.from(uniqueContributors);
  }, [data]);

  // State to store bonus marks and student IDs for each contributor
  const [bonusMarks, setBonusMarks] = useState<Record<string, BonusMark>>(
    Object.fromEntries(contributors.map(user => [user, { 
      id: user, 
      user, 
      mark: 0,
      studentId: null 
    }]))
  );

  // Calculate total bonus marks
  const totalBonusMarks = useMemo(() => 
    Object.values(bonusMarks).reduce((sum, { mark }) => sum + mark, 0),
    [bonusMarks]
  );

  // Handle bonus mark change
  const handleMarkChange = (user: string, value: number): void => {
    const currentMark = bonusMarks[user]?.mark ?? 0;
    const newTotal = totalBonusMarks - currentMark + value;
    if (newTotal <= 4) {
      setBonusMarks(prev => ({
        ...prev,
        [user]: { 
          ...prev[user], 
          mark: value 
        } as BonusMark
      }));
    }
  };

  // Handle student ID change
  const handleStudentIdChange = (user: string, value: string): void => {
    setBonusMarks(prev => ({
      ...prev,
      [user]: { 
        ...prev[user], 
        studentId: value || null 
      } as BonusMark
    }));
  };

  // Transform data for the table
  const tableData = useMemo(() => 
    contributors.map(user => ({
      id: user,
      user,
      mark: bonusMarks[user]?.mark ?? 1,
      studentId: bonusMarks[user]?.studentId ?? null
    })), [contributors, bonusMarks]);

  // Define table columns
  const columns: Array<Column> = [
    {
      id: "user",
      label: "Contributor",
      width: "30%",
      format: (value: string): JSX.Element => (
        <Typography sx={{ fontWeight: 500, color: "rgba(55, 65, 81, 0.9)" }}>
          {value}
        </Typography>
      )
    },
    {
      id: "studentId",
      label: "Student ID",
      width: "35%",
      format: (value: unknown): JSX.Element => {
        const studentId = value as string | null;
        const currentRow = tableData.find(row => row.studentId === studentId);
        if (!currentRow) return <></>;
        
        return (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={studentId ?? ""}
              onChange={(e) => handleStudentIdChange(currentRow.user, e.target.value)}
              displayEmpty
              sx={{
                color: bonusMarksTheme.main,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: bonusMarksTheme.light
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: bonusMarksTheme.main
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: bonusMarksTheme.main
                }
              }}
            >
              <MenuItem value="">
                <em>Select Student</em>
              </MenuItem>
              {["Student1", "Student2", "Student3", "Student4"].map((id) => (
                <MenuItem 
                  key={id} 
                  value={id}
                  disabled={Object.values(bonusMarks).some(
                    mark => mark.studentId === id && mark.user !== currentRow.user
                  )}
                >
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    },
    {
      id: "mark",
      label: "Bonus Mark",
      width: "35%",
      format: (value: unknown): JSX.Element => {
        const mark = value as number;
        const currentRow = tableData.find(row => row.mark === mark);
        if (!currentRow) return <></>;
        
        const newTotal = totalBonusMarks - mark + (mark === 0 ? 0 : 1);
        const isDisabled = newTotal > 4 && mark < 4;
        
        return (
          <Tooltip 
            title={isDisabled ? "Total bonus marks cannot exceed 4" : ""}
            placement="top"
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={mark}
                onChange={(e) => handleMarkChange(currentRow.user, e.target.value as number)}
                disabled={isDisabled}
                sx={{
                  color: bonusMarksTheme.main,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: bonusMarksTheme.light
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: bonusMarksTheme.main
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: bonusMarksTheme.main
                  },
                  ...(isDisabled && {
                    opacity: 0.7,
                    cursor: "not-allowed"
                  })
                }}
              >
                {[0, 1, 2, 3, 4].map((m) => (
                  <MenuItem 
                    key={m} 
                    value={m}
                    disabled={totalBonusMarks - mark + m > 4}
                  >
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <AnalysisTabLayout
      creatorCount={contributors.length}
      creatorLabel="Total"
      description="Assign bonus marks to contributors based on their performance and contribution quality."
      headerTitle="Bonus Marks Assignment"
      theme={bonusMarksTheme}
      title="Bonus Marks Analysis"
      totalCount={contributors.length}
      statsIcon={
        <BonusIcon sx={{ color: bonusMarksTheme.main, fontSize: "1.1rem" }} />
      }
    >
      <Box sx={{ position: "relative", overflow: "auto" }}>
        {totalBonusMarks > 4 && (
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ mb: 2 }}
          >
            Total bonus marks cannot exceed 4. Current total: {totalBonusMarks}
          </Alert>
        )}
        <DataTable
          columns={columns}
          data={tableData}
          emptyMessage="No contributors available for this repository."
          getRowKey={(row): string => row.id}
          lightColor={bonusMarksTheme.light}
          lighterColor={bonusMarksTheme.lighter}
          primaryColor={bonusMarksTheme.main}
        />
      </Box>
    </AnalysisTabLayout>
  );
}

export default BonusMarksTab; 