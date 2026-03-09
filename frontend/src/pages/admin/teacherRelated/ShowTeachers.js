import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, IconButton,
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (loading) {
        return (
            <LoadingWrapper>
                <LoadingSpinner />
                <LoadingText>Loading teachers...</LoadingText>
            </LoadingWrapper>
        );
    } else if (response) {
        return (
            <EmptyState>
                <EmptyIcon>👨‍🏫</EmptyIcon>
                <EmptyTitle>No Teachers Yet</EmptyTitle>
                <EmptyText>Add teachers to your school to manage classes and subjects</EmptyText>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
                    Add Teacher
                </GreenButton>
            </EmptyState>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllTeachers(currentUser._id));
        });
        setMessage("Successfully Deleted.")
        setShowPopup(true)

    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    return (
        <PageWrapper>
            <PageHeader>
                <HeaderIcon>👨‍🏫</HeaderIcon>
                <HeaderText>
                    <PageTitle>Teachers Management</PageTitle>
                    <PageSubtitle>{teachersList?.length || 0} teachers in your school</PageSubtitle>
                </HeaderText>
            </PageHeader>

            <TableWrapper>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
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
                                <StyledTableCell align="center">
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'teachSubject') {
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align}>
                                                            {value ? (
                                                                <SubjectBadge>{value}</SubjectBadge>
                                                            ) : (
                                                                <AddSubjectButton
                                                                    onClick={() => {
                                                                        navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                                                    }}>
                                                                    Add Subject
                                                                </AddSubjectButton>
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                }
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center">
                                                <ActionButtons>
                                                    <IconButton onClick={() => deleteHandler(row.id, "Teacher")} sx={{ color: '#ef4444' }}>
                                                        <PersonRemoveIcon />
                                                    </IconButton>
                                                    <BlueButton variant="contained"
                                                        onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}>
                                                        View
                                                    </BlueButton>
                                                </ActionButtons>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
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

            <SpeedDialTemplate actions={actions} />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default ShowTeachers;

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const PageWrapper = styled.div`
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(245, 158, 11, 0.2);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const HeaderIcon = styled.span`
  font-size: 2.5rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
`;

const HeaderText = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
`;

const TableWrapper = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const EmptyIcon = styled.span`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  margin-bottom: 24px;
  max-width: 400px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SubjectBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  color: #a5b4fc;
  font-size: 0.85rem;
  font-weight: 600;
`;

const AddSubjectButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  border: none;
  border-radius: 8px;
  color: #1a1a2e;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
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