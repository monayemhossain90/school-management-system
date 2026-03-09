import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Paper, Table, TableBody, TableHead } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import styled, { keyframes } from 'styled-components';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <ContentWrapper>
                <PageHeader>
                    <HeaderIcon>📊</HeaderIcon>
                    <HeaderText>
                        <PageTitle>Subject Marks</PageTitle>
                        <PageSubtitle>Your academic performance across subjects</PageSubtitle>
                    </HeaderText>
                </PageHeader>

                <TableWrapper>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks Obtained</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>
                                            <MarksBadge $marks={result.marksObtained}>
                                                {result.marksObtained}
                                            </MarksBadge>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableWrapper>
            </ContentWrapper>
        );
    };

    const renderChartSection = () => {
        return (
            <ContentWrapper>
                <PageHeader>
                    <HeaderIcon>📈</HeaderIcon>
                    <HeaderText>
                        <PageTitle>Marks Overview</PageTitle>
                        <PageSubtitle>Visual representation of your marks</PageSubtitle>
                    </HeaderText>
                </PageHeader>
                <ChartWrapper>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </ChartWrapper>
            </ContentWrapper>
        );
    };

    const renderClassDetailsSection = () => {
        return (
            <ContentWrapper>
                <PageHeader>
                    <HeaderIcon>📚</HeaderIcon>
                    <HeaderText>
                        <PageTitle>Class Details</PageTitle>
                        <PageSubtitle>You are currently in Class {sclassDetails && sclassDetails.sclassName}</PageSubtitle>
                    </HeaderText>
                </PageHeader>

                <SubjectsGrid>
                    {subjectsList &&
                        subjectsList.map((subject, index) => (
                            <SubjectCard key={index} $delay={index * 0.1}>
                                <SubjectIcon>📘</SubjectIcon>
                                <SubjectName>{subject.subName}</SubjectName>
                                <SubjectCode>{subject.subCode}</SubjectCode>
                            </SubjectCard>
                        ))}
                </SubjectsGrid>
            </ContentWrapper>
        );
    };

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading subjects...</LoadingText>
                </LoadingWrapper>
            ) : (
                <>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <StyledBottomNav elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels
                                    sx={{
                                        background: 'rgba(26, 26, 46, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        '& .MuiBottomNavigationAction-root': {
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            '&.Mui-selected': {
                                                color: '#10b981',
                                            }
                                        }
                                    }}>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </StyledBottomNav>
                        </>
                    ) : (
                        renderClassDetailsSection()
                    )}
                </>
            )}
        </PageWrapper>
    );
};

export default StudentSubjects;

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
  padding-bottom: 80px;
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
  border: 4px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
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
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
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

const ChartWrapper = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
`;

const MarksBadge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background: ${props => {
        const marks = props.$marks;
        if (marks >= 80) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)';
        if (marks >= 60) return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)';
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.2) 100%)';
    }};
  border: 1px solid ${props => {
        const marks = props.$marks;
        if (marks >= 80) return 'rgba(16, 185, 129, 0.3)';
        if (marks >= 60) return 'rgba(245, 158, 11, 0.3)';
        return 'rgba(239, 68, 68, 0.3)';
    }};
  border-radius: 20px;
  color: ${props => {
        const marks = props.$marks;
        if (marks >= 80) return '#34d399';
        if (marks >= 60) return '#fbbf24';
        return '#f87171';
    }};
  font-weight: 700;
  font-size: 0.9rem;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const SubjectCard = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const SubjectIcon = styled.span`
  font-size: 2rem;
  display: block;
  margin-bottom: 12px;
`;

const SubjectName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SubjectCode = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
`;

const StyledBottomNav = styled(Paper)`
  && {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;