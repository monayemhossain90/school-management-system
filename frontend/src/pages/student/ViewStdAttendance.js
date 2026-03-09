import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import styled, { keyframes } from 'styled-components';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <ContentWrapper>
                <PageHeader>
                    <HeaderIcon>📅</HeaderIcon>
                    <HeaderText>
                        <PageTitle>Attendance Record</PageTitle>
                        <PageSubtitle>Track your attendance across all subjects</PageSubtitle>
                    </HeaderText>
                </PageHeader>

                <OverallCard>
                    <OverallLabel>Overall Attendance</OverallLabel>
                    <OverallValue $percentage={overallAttendancePercentage}>
                        {overallAttendancePercentage.toFixed(1)}%
                    </OverallValue>
                </OverallCard>

                <TableWrapper>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>
                                            <PercentageBadge $percentage={subjectAttendancePercentage}>
                                                {subjectAttendancePercentage}%
                                            </PercentageBadge>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <DetailsButton onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                Details
                                            </DetailsButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <DetailTitle>Attendance Details</DetailTitle>
                                                    <DetailTable>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <StyledTableRow>
                                                                    <StyledTableCell>Date</StyledTableCell>
                                                                    <StyledTableCell align="right">Status</StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {allData.map((data, idx) => {
                                                                    const date = new Date(data.date);
                                                                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                    return (
                                                                        <StyledTableRow key={idx}>
                                                                            <StyledTableCell>{dateString}</StyledTableCell>
                                                                            <StyledTableCell align="right">
                                                                                <StatusBadge $status={data.status}>
                                                                                    {data.status}
                                                                                </StatusBadge>
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </DetailTable>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            );
                        })}
                    </Table>
                </TableWrapper>
            </ContentWrapper>
        );
    };

    const renderChartSection = () => {
        return (
            <ContentWrapper>
                <PageHeader>
                    <HeaderIcon>📊</HeaderIcon>
                    <HeaderText>
                        <PageTitle>Attendance Overview</PageTitle>
                        <PageSubtitle>Visual breakdown of your attendance</PageSubtitle>
                    </HeaderText>
                </PageHeader>
                <ChartWrapper>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </ChartWrapper>
            </ContentWrapper>
        );
    };

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading attendance...</LoadingText>
                </LoadingWrapper>
            ) : (
                <>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
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
                        <EmptyState>
                            <EmptyIcon>📅</EmptyIcon>
                            <EmptyTitle>No Attendance Records</EmptyTitle>
                            <EmptyText>You don't have any attendance records yet</EmptyText>
                        </EmptyState>
                    )}
                </>
            )}
        </PageWrapper>
    );
};

export default ViewStdAttendance;

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

const OverallCard = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const OverallLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const OverallValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => {
        const pct = props.$percentage;
        if (pct >= 75) return '#34d399';
        if (pct >= 50) return '#fbbf24';
        return '#f87171';
    }};
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

const PercentageBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: ${props => {
        const pct = props.$percentage;
        if (pct >= 75) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)';
        if (pct >= 50) return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)';
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.2) 100%)';
    }};
  border: 1px solid ${props => {
        const pct = props.$percentage;
        if (pct >= 75) return 'rgba(16, 185, 129, 0.3)';
        if (pct >= 50) return 'rgba(245, 158, 11, 0.3)';
        return 'rgba(239, 68, 68, 0.3)';
    }};
  border-radius: 20px;
  color: ${props => {
        const pct = props.$percentage;
        if (pct >= 75) return '#34d399';
        if (pct >= 50) return '#fbbf24';
        return '#f87171';
    }};
  font-weight: 700;
  font-size: 0.85rem;
`;

const DetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #a5b4fc;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
  }
`;

const DetailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
`;

const DetailTable = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${props => props.$status === 'Present'
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.2) 100%)'};
  border: 1px solid ${props => props.$status === 'Present' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 12px;
  color: ${props => props.$status === 'Present' ? '#34d399' : '#f87171'};
  font-size: 0.8rem;
  font-weight: 600;
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