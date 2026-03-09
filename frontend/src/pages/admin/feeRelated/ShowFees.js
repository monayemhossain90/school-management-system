import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { IconButton, Chip } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllFees } from '../../../redux/feeRelated/feeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import styled, { keyframes } from 'styled-components';

const ShowFees = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { feesList, loading, error, response } = useSelector((state) => state.fee);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllFees(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllFees(currentUser._id));
            });
    };

    const feeColumns = [
        { id: 'studentName', label: 'Student', minWidth: 150 },
        { id: 'feeType', label: 'Fee Type', minWidth: 120 },
        { id: 'amount', label: 'Amount', minWidth: 100 },
        { id: 'paidAmount', label: 'Paid', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
        { id: 'dueDate', label: 'Due Date', minWidth: 120 },
    ];

    const feeRows = feesList && feesList.length > 0 && feesList.map((fee) => {
        const date = new Date(fee.dueDate);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "N/A";
        return {
            studentName: fee.student?.name || 'Unknown',
            feeType: fee.feeType,
            amount: `₹${fee.amount}`,
            paidAmount: `₹${fee.paidAmount || 0}`,
            status: fee.status,
            dueDate: dateString,
            id: fee._id,
        };
    });

    const FeeButtonHaver = ({ row }) => {
        return (
            <ActionButtons>
                <IconButton onClick={() => navigate(`/Admin/fees/fee/${row.id}`)} sx={{ color: '#6366f1' }}>
                    <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => deleteHandler(row.id, "Fee")} sx={{ color: '#ef4444' }}>
                    <DeleteIcon />
                </IconButton>
            </ActionButtons>
        );
    };

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Fee',
            action: () => navigate("/Admin/fees/add")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Fees',
            action: () => deleteHandler(currentUser._id, "Fees")
        }
    ];

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading fee records...</LoadingText>
                </LoadingWrapper>
            ) : (
                <>
                    {response ? (
                        <EmptyState>
                            <EmptyIcon>💰</EmptyIcon>
                            <EmptyTitle>No Fee Records Yet</EmptyTitle>
                            <EmptyText>Add fee records to track student payments and collections</EmptyText>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/fees/add")}>
                                Add Fee Record
                            </GreenButton>
                        </EmptyState>
                    ) : (
                        <ContentWrapper>
                            <PageHeader>
                                <HeaderIcon>💰</HeaderIcon>
                                <HeaderText>
                                    <PageTitle>Fees Management</PageTitle>
                                    <PageSubtitle>{feesList?.length || 0} fee records</PageSubtitle>
                                </HeaderText>
                            </PageHeader>

                            <TableWrapper>
                                {Array.isArray(feesList) && feesList.length > 0 &&
                                    <TableTemplate buttonHaver={FeeButtonHaver} columns={feeColumns} rows={feeRows} />
                                }
                            </TableWrapper>
                            <SpeedDialTemplate actions={actions} />
                        </ContentWrapper>
                    )}
                </>
            )}
        </PageWrapper>
    );
};

export default ShowFees;

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
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const ContentWrapper = styled.div``;

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
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%);
  border: 1px solid rgba(236, 72, 153, 0.3);
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
