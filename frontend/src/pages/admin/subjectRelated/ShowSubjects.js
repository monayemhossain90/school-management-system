import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { IconButton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            })
        setMessage("Successfully deleted.")
        setShowPopup(true)
    }

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <ActionButtons>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")} sx={{ color: '#ef4444' }}>
                    <DeleteIcon />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                    View
                </BlueButton>
            </ActionButtons>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading subjects...</LoadingText>
                </LoadingWrapper>
            ) : (
                <>
                    {response ? (
                        <EmptyState>
                            <EmptyIcon>📚</EmptyIcon>
                            <EmptyTitle>No Subjects Yet</EmptyTitle>
                            <EmptyText>Add subjects to your school curriculum to get started</EmptyText>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                Add Subjects
                            </GreenButton>
                        </EmptyState>
                    ) : (
                        <ContentWrapper>
                            <PageHeader>
                                <HeaderIcon>📚</HeaderIcon>
                                <HeaderText>
                                    <PageTitle>Subjects Management</PageTitle>
                                    <PageSubtitle>{subjectsList?.length || 0} subjects in curriculum</PageSubtitle>
                                </HeaderText>
                            </PageHeader>

                            <TableWrapper>
                                {Array.isArray(subjectsList) && subjectsList.length > 0 &&
                                    <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                                }
                            </TableWrapper>
                            <SpeedDialTemplate actions={actions} />
                        </ContentWrapper>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default ShowSubjects;

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
  border: 4px solid rgba(14, 165, 233, 0.2);
  border-top-color: #0ea5e9;
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
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%);
  border: 1px solid rgba(14, 165, 233, 0.3);
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