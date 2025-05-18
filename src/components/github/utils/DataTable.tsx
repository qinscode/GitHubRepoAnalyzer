import type React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  alpha,
} from "@mui/material";

export interface Column {
  id: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  format?: (value: any) => React.ReactNode;
}

export interface DataTableProps {
  columns: Array<Column>;
  data: Array<any>;
  emptyMessage?: string;
  getRowKey?: (row: any, index: number) => string | number;
  lightColor: string;
  lighterColor: string;
  primaryColor: string;
}

/**
 * A reusable data table component for displaying repository data
 * Can be used for commits, issues, and pull requests
 */
const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  emptyMessage = "No data available",
  getRowKey = (_, index): number => index,
  lightColor,
  lighterColor,
  primaryColor,
}): JSX.Element => {
  if (!data.length) {
    return (
      <Typography 
        sx={{ 
          color: "text.secondary", 
          textAlign: "center", 
          p: 3 
        }}
      >
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 0,
        "& .MuiTable-root": {
          borderCollapse: "separate",
          borderSpacing: "0",
        },
      }}
    >
      <Table size="small">
        <TableHead
          sx={{
            background: `linear-gradient(to right, ${lighterColor}, rgba(248, 250, 252, 0.8))`,
          }}
        >
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                width={column.width}
                sx={{
                  borderBottom: `2px solid ${lightColor}`,
                  py: 1.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "rgba(55, 65, 81, 0.9)",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={getRowKey(row, rowIndex)}
              sx={{
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: `${alpha(primaryColor, 0.04)}`,
                },
                animation: `fadeIn 0.5s ease-out forwards ${rowIndex * 0.03}s`,
                opacity: 0,
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(5px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "&:nth-of-type(odd)": {
                  backgroundColor: `${alpha(primaryColor, 0.02)}`,
                },
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.25,
                      ...(column.id === 'number' ? {
                        fontWeight: 500,
                        color: primaryColor,
                      } : {
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }),
                    }}
                  >
                    {column.format ? column.format(value) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable; 