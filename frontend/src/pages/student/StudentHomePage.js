/**
 * StudentHomePage Component
 * 
 * The main dashboard page for students after login.
 * Displays personalized greeting, stats cards, attendance chart, and notices.
 * 
 * Key Features:
 * - Dynamic greeting based on time of day
 * - Stat cards showing subjects and assignments with CountUp animations
 * - Pie chart visualization of attendance percentage
 * - Notices section for school announcements
 * - Green accent theme for student role
 * 
 * @component
 * @returns {JSX.Element} The rendered student home page
 */

import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled, { keyframes } from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const StudentHomePage = () => {
  const dispatch = useDispatch();

  // Extract user and class data from Redux store
  const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);

  // Local state for attendance data
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  // Get the class ID from current user's enrolled class
  const classID = currentUser.sclassName._id;

  /**
   * Fetch user details and subject list on component mount
   * These are needed for attendance calculation and stats display
   */
  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, "Student"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
  }, [dispatch, currentUser._id, classID]);

  // Calculate total number of subjects for stats display
  const numberOfSubjects = subjectsList && subjectsList.length;

  /**
   * Update attendance data when user details are loaded
   */
  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  // Calculate attendance percentages for pie chart
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  // Data structure for the attendance pie chart
  const chartData = [
    { name: 'Present', value: overallAttendancePercentage },
    { name: 'Absent', value: overallAbsentPercentage }
  ];

  /**
   * Stats configuration for the dashboard cards
   * Each stat has an icon, title, value, and gradient colors
   */
  const stats = [
    {
      icon: Subject,
      title: 'Total Subjects',
      value: numberOfSubjects || 0,
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
    },
    {
      icon: Assignment,
      title: 'Total Assignments',
      value: 15,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      shadowColor: 'rgba(99, 102, 241, 0.3)',
    },
  ];

  /**
   * Returns a greeting based on the current time of day
   * @returns {string} 'Morning', 'Afternoon', or 'Evening'
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <PageWrapper>
      <Container maxWidth="xl">
        {/* Header */}
        <HeaderSection>
          <WelcomeText>
            <Greeting>Good {getGreeting()}, {currentUser?.name}! 📚</Greeting>
            <SubGreeting>Here's your learning progress today.</SubGreeting>
          </WelcomeText>
        </HeaderSection>

        {/* Stats Grid */}
        <StatsGrid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <StatCard $delay={index * 0.1}>
                <CardGradientBar $gradient={stat.gradient} />
                <CardContent>
                  <IconContainer $gradient={stat.gradient} $shadow={stat.shadowColor}>
                    <img src={stat.icon} alt={stat.title} />
                  </IconContainer>
                  <StatInfo>
                    <StatTitle>{stat.title}</StatTitle>
                    <StatValue>
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={2.5}
                      />
                    </StatValue>
                  </StatInfo>
                </CardContent>
              </StatCard>
            </Grid>
          ))}

          {/* Attendance Chart Card */}
          <Grid item xs={12} sm={6} md={4}>
            <ChartCard>
              <CardGradientBar $gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" />
              <ChartContainer>
                {response ? (
                  <EmptyState>
                    <EmptyIcon>📊</EmptyIcon>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>No Attendance Found</Typography>
                  </EmptyState>
                ) : (
                  <>
                    {loading ? (
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</Typography>
                    ) : (
                      <>
                        {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                          <>
                            <ChartTitle>Attendance Overview</ChartTitle>
                            <CustomPieChart data={chartData} />
                          </>
                        ) : (
                          <EmptyState>
                            <EmptyIcon>📊</EmptyIcon>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>No Attendance Found</Typography>
                          </EmptyState>
                        )}
                      </>
                    )}
                  </>
                )}
              </ChartContainer>
            </ChartCard>
          </Grid>
        </StatsGrid>

        {/* Notices Section */}
        <NoticesSection>
          <SeeNotice />
        </NoticesSection>
      </Container>
    </PageWrapper>
  );
};

export default StudentHomePage;

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

// Styled Components
const PageWrapper = styled.div`
  min-height: 100%;
  padding: 8px 0;
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.6s ease forwards;
`;

const WelcomeText = styled.div``;

const Greeting = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const SubGreeting = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const StatsGrid = styled(Grid)`
  && {
    margin-bottom: 32px;
  }
`;

const StatCard = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ChartCard = styled(StatCard)`
  animation-delay: 0.2s;
`;

const CardGradientBar = styled.div`
  height: 4px;
  background: ${props => props.$gradient};
`;

const CardContent = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$gradient};
  box-shadow: 0 8px 24px ${props => props.$shadow};
  flex-shrink: 0;
  
  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatTitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

const ChartContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: center;
  align-items: center;
`;

const ChartTitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
  font-weight: 500;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const EmptyIcon = styled.span`
  font-size: 2rem;
`;

const NoticesSection = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
`;