import { FormControl, Select, MenuItem, alpha } from "@mui/material";
import { BonusMarkSelectProps } from "./types";

const BonusMarkSelect = ({
  mark,
  user,
  totalBonusMarks,
  onMarkChange,
  menuProps,
  selectStyles,
}: BonusMarkSelectProps) => {
  // Calculate what the new total would be if this mark was changed
  const calculateNewTotal = (newMark: number) => {
    return totalBonusMarks - mark + newMark;
  };

  // Check if a mark value would exceed the total limit
  const wouldExceedLimit = (newMark: number) => {
    return calculateNewTotal(newMark) > 4;
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        MenuProps={menuProps}
        value={mark}
        sx={{
          ...selectStyles,
          ...(wouldExceedLimit(4) && {
            opacity: 0.7,
            cursor: "not-allowed",
            backgroundColor: alpha("#FFFFFF", 0.5),
          }),
        }}
        onChange={(event_) => {
          const newMark = Number(event_.target.value);
          if (!wouldExceedLimit(newMark)) {
            onMarkChange(user, newMark);
          }
        }}
      >
        {[0, 1, 2, 3, 4].map((m) => (
          <MenuItem key={m} disabled={wouldExceedLimit(m)} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BonusMarkSelect; 