/**
 * ChooseUser Component
 * 
 * A role selection page that allows users to choose their login type.
 * Features animated 3D cards with role-specific icons and descriptions.
 * 
 * Key Features:
 * - Three role options: Admin, Student, Teacher
 * - Guest mode support - auto-login with demo credentials
 * - Role-specific gradient colors and icons
 * - 3D hover effects on role cards
 * - Redirect to appropriate dashboard on successful login
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.visitor - 'guest' for auto-login mode, undefined for normal login
 * @returns {JSX.Element} The rendered role selection page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Container,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Demo password for guest mode login
  const password = "zxc";

  // Extract user authentication state from Redux
  const { status, currentUser, currentRole } = useSelector(state => state.user);

  // Local state management
  const [loader, setLoader] = useState(false);      // Loading state during login
  const [showPopup, setShowPopup] = useState(false); // Error popup visibility
  const [message, setMessage] = useState("");        // Popup message
  const [hoveredCard, setHoveredCard] = useState(null); // Currently hovered card ID

  /**
   * Handles navigation/login when a role card is clicked
   * In guest mode: auto-logs in with demo credentials
   * In normal mode: navigates to the role-specific login page
   * 
   * @param {string} user - Role type ('Admin', 'Student', or 'Teacher')
   */
  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        // Guest mode: auto-login with admin demo credentials
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        // Guest mode: auto-login with student demo credentials
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        // Guest mode: auto-login with teacher demo credentials
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  /**
   * Effect to handle post-login navigation
   * Redirects to appropriate dashboard based on user role
   */
  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  const roles = [
    {
      id: 'Admin',
      icon: <AccountCircle />,
      title: 'Admin',
      description: 'Access the dashboard to manage app data, users, and system settings.',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      shadowColor: 'rgba(99, 102, 241, 0.4)',
    },
    {
      id: 'Student',
      icon: <School />,
      title: 'Student',
      description: 'Explore course materials, assignments, and track your academic progress.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.4)',
    },
    {
      id: 'Teacher',
      icon: <Group />,
      title: 'Teacher',
      description: 'Create courses, manage assignments, and monitor student performance.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      shadowColor: 'rgba(245, 158, 11, 0.4)',
    },
  ];

  return (
    <PageWrapper>
      {/* Background Elements */}
      <BackgroundOrb className="orb-1" />
      <BackgroundOrb className="orb-2" />
      <GridPattern />

      <ContentContainer maxWidth="lg">
        <Header>
          <HeaderBadge>Select Your Role</HeaderBadge>
          <HeaderTitle>Choose how you want to continue</HeaderTitle>
          <HeaderSubtitle>
            {visitor === "guest"
              ? "Experience our platform with a demo account"
              : "Login to access your personalized dashboard"}
          </HeaderSubtitle>
        </Header>

        <CardsGrid container spacing={3} justifyContent="center">
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <RoleCard
                onClick={() => navigateHandler(role.id)}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
                $isHovered={hoveredCard === role.id}
                $delay={index * 0.1}
                $gradient={role.gradient}
                $shadowColor={role.shadowColor}
              >
                <IconWrapper $gradient={role.gradient}>
                  {role.icon}
                </IconWrapper>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
                <CardArrow $isHovered={hoveredCard === role.id}>
                  Continue →
                </CardArrow>
                <CardGlow $gradient={role.gradient} $isHovered={hoveredCard === role.id} />
              </RoleCard>
            </Grid>
          ))}
        </CardsGrid>
      </ContentContainer>

      <StyledBackdrop open={loader}>
        <LoaderContent>
          <CircularProgress size={48} sx={{ color: '#8b5cf6' }} />
          <LoaderText>Signing you in...</LoaderText>
        </LoaderContent>
      </StyledBackdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default ChooseUser;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 3rem 1rem;
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at center, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const BackgroundOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: ${pulse} 10s ease-in-out infinite;
  pointer-events: none;
  
  &.orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    top: -300px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.3;
  }
  
  &.orb-2 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    bottom: -250px;
    right: -100px;
    opacity: 0.25;
    animation-delay: 3s;
  }
`;

const ContentContainer = styled(Container)`
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${slideUp} 0.6s ease forwards;
`;

const HeaderBadge = styled.div`
  display: inline-block;
  padding: 8px 20px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50px;
  color: #c4b5fd;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
`;

const HeaderTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  margin: 0 auto;
`;

const CardsGrid = styled(Grid)`
  max-width: 1000px;
  margin: 0 auto !important;
`;

const RoleCard = styled.div`
  position: relative;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 60px ${props => props.$shadowColor};
  }
`;

const CardGlow = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: ${props => props.$gradient};
  opacity: ${props => props.$isHovered ? 0.08 : 0};
  transition: opacity 0.4s ease;
  pointer-events: none;
  filter: blur(60px);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$gradient};
  box-shadow: 0 8px 24px ${props => props.$gradient ? 'rgba(0,0,0,0.3)' : 'transparent'};
  transition: all 0.3s ease;
  animation: ${float} 4s ease-in-out infinite;
  
  svg {
    font-size: 40px;
    color: white;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CardArrow = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #8b5cf6;
  transition: all 0.3s ease;
  opacity: ${props => props.$isHovered ? 1 : 0.7};
  transform: translateX(${props => props.$isHovered ? '4px' : '0'});
`;

const StyledBackdrop = styled(Backdrop)`
  && {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(10px);
    z-index: 9999;
  }
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoaderText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
`;