import React, { useState } from 'react';
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';
import styled from 'styled-components';

const TableViewTemplate = ({ columns, rows }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <TableWrapper>
            <StyledTableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column, index) => (
                                <StyledTableCell
                                    key={index}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column, index) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={index} align={column.align}>
                                                    {
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    }
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </StyledTableContainer>
            <StyledPagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />
        </TableWrapper>
    );
};

export default TableViewTemplate;

// Styled Components
const TableWrapper = styled.div`
  width: 100%;
`;

const StyledTableContainer = styled(TableContainer)`
  && {
    background: transparent;
    
    &::-webkit-scrollbar {
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  }
`;

const StyledPagination = styled(TablePagination)`
  && {
    color: rgba(255, 255, 255, 0.7);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    
    .MuiTablePagination-selectLabel,
    .MuiTablePagination-displayedRows {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .MuiTablePagination-select {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .MuiSelect-icon {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .MuiIconButton-root {
      color: rgba(255, 255, 255, 0.5);
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      
      &.Mui-disabled {
        color: rgba(255, 255, 255, 0.2);
      }
    }
  }
`;