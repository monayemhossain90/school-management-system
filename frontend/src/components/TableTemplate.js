/**
 * TableTemplate Component
 * 
 * A reusable, paginated data table component with action buttons.
 * Features modern dark theme styling with glassmorphic effects.
 * 
 * Key Features:
 * - Dynamic column rendering from props
 * - Pagination with selectable rows per page (5, 10, 25, 100)
 * - Custom action buttons via ButtonHaver render prop
 * - Number formatting support via column.format function
 * - Sticky header for better scrolling experience
 * - Dark theme styled pagination controls
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.buttonHaver - Render prop component for action buttons
 * @param {Array} props.columns - Column configuration array with id, label, minWidth, align, format
 * @param {Array} props.rows - Data rows to display, each row should have an 'id' property
 * @returns {JSX.Element} The rendered table
 * 
 * @example
 * const columns = [
 *   { id: 'name', label: 'Name', minWidth: 170 },
 *   { id: 'age', label: 'Age', minWidth: 100, format: (val) => `${val} years` }
 * ];
 * const rows = [{ id: 1, name: 'John', age: 25 }];
 * <TableTemplate columns={columns} rows={rows} buttonHaver={MyActionButtons} />
 */

import React, { useState } from 'react';
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';
import styled from 'styled-components';

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows }) => {
  // Pagination state management
  const [page, setPage] = useState(0);           // Current page index (0-based)
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Number of rows per page

  return (
    <TableWrapper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          {/* Table Header - Renders column labels */}
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              {/* Actions column header */}
              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>

          {/* Table Body - Renders paginated data rows */}
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {/* Render each cell value, applying format if provided */}
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {
                            column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
                          }
                        </StyledTableCell>
                      );
                    })}
                    {/* Action buttons for this row */}
                    <StyledTableCell align="center">
                      <ButtonHaver row={row} />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <StyledPagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);  // Reset to first page when changing rows per page
        }}
      />
    </TableWrapper>
  )
}

export default TableTemplate;

/**
 * ============================================
 * STYLED COMPONENTS
 * ============================================
 */

/** Wrapper container for the table */
const TableWrapper = styled.div`
  background: transparent;
`;

const StyledPagination = styled(TablePagination)`
  && {
    color: rgba(255, 255, 255, 0.7);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(20, 20, 40, 0.3);
    
    .MuiTablePagination-selectLabel,
    .MuiTablePagination-displayedRows {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.875rem;
    }
    
    .MuiTablePagination-select {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 4px 24px 4px 8px;
      
      &:focus {
        background: rgba(255, 255, 255, 0.08);
      }
    }
    
    .MuiSelect-icon {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .MuiIconButton-root {
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
      
      &.Mui-disabled {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    
    .MuiTablePagination-actions {
      display: flex;
      gap: 4px;
    }
  }
`;