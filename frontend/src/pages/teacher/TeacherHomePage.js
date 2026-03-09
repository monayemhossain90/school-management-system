import { Container, Grid } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled, { keyframes } from 'styled-components';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions;

    const stats = [
        {
            icon: Students,
            title: 'Class Students',
            value: numberOfStudents || 0,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            shadowColor: 'rgba(245, 158, 11, 0.3)',
        },
        {
            icon: Lessons,
            title: 'Total Lessons',
            value: numberOfSessions || 0,
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            shadowColor: 'rgba(99, 102, 241, 0.3)',
        },
        {
            icon: Tests,
            title: 'Tests Taken',
            value: 24,
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            shadowColor: 'rgba(16, 185, 129, 0.3)',
        },
        {
            icon: Time,
            title: 'Total Hours',
            value: 30,
            suffix: ' hrs',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            shadowColor: 'rgba(236, 72, 153, 0.3)',
        },
    ];

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
                        <Greeting>Good {getGreeting()}, {currentUser?.name}! 👨‍🏫</Greeting>
                        <SubGreeting>Here's your class overview for today.</SubGreeting>
                    </WelcomeText>
                </HeaderSection>

                {/* Stats Grid */}
                <StatsGrid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={stat.title}>
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
                                                suffix={stat.suffix || ''}
                                            />
                                        </StatValue>
                                    </StatInfo>
                                </CardContent>
                                <TrendIndicator>
                                    <TrendBadge $positive>Active</TrendBadge>
                                </TrendIndicator>
                            </StatCard>
                        </Grid>
                    ))}
                </StatsGrid>

                {/* Notices Section */}
                <NoticesSection>
                    <SeeNotice />
                </NoticesSection>
            </Container>
        </PageWrapper>
    );
};

export default TeacherHomePage;

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

const TrendIndicator = styled.div`
  padding: 0 24px 20px;
`;

const TrendBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$positive
        ? 'rgba(16, 185, 129, 0.15)'
        : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.$positive ? '#34d399' : '#f87171'};
  border: 1px solid ${props => props.$positive
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(239, 68, 68, 0.3)'};
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