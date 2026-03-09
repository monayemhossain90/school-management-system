/**
 * Homepage Component
 * 
 * The main landing page of the School Management System.
 * Features a modern, animated design with:
 * - Animated gradient background with floating orbs
 * - Grid pattern overlay for depth
 * - Hero section with animated illustration
 * - Call-to-action buttons for login and registration
 * 
 * @component
 * @returns {JSX.Element} The rendered homepage
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
  return (
    <PageWrapper>
      {/* Animated background elements */}
      <BackgroundOrb className="orb-1" />
      <BackgroundOrb className="orb-2" />
      <BackgroundOrb className="orb-3" />
      <GridPattern />

      <ContentContainer>
        <Grid container spacing={4} alignItems="center">
          {/* Illustration Section */}
          <Grid item xs={12} md={6}>
            <IllustrationWrapper>
              <FloatingImage src={Students} alt="students" />
              <GlowEffect />
            </IllustrationWrapper>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={6}>
            <ContentCard>
              <Badge>🎓 Education Management</Badge>
              <MainTitle>
                Welcome to
                <GradientText> School Management </GradientText>
                System
              </MainTitle>
              <Description>
                Streamline school management, class organization, and add students and faculty.
                Seamlessly track attendance, assess performance, and provide feedback.
                Access records, view marks, and communicate effortlessly.
              </Description>
              <ButtonGroup>
                <StyledLink to="/choose">
                  <PrimaryButtonStyled variant="contained" fullWidth>
                    Get Started
                    <ArrowIcon>→</ArrowIcon>
                  </PrimaryButtonStyled>
                </StyledLink>
                <StyledLink to="/chooseasguest">
                  <SecondaryButton variant="outlined" fullWidth>
                    Explore as Guest
                  </SecondaryButton>
                </StyledLink>
              </ButtonGroup>
              <SignUpText>
                Don't have an account?{' '}
                <SignUpLink to="/Adminregister">
                  Sign up for free
                </SignUpLink>
              </SignUpText>
            </ContentCard>
          </Grid>
        </Grid>
      </ContentContainer>
    </PageWrapper>
  );
};

export default Homepage;

/**
 * ============================================
 * ANIMATION KEYFRAMES
 * ============================================
 * Reusable CSS animations for various UI effects
 */

/**
 * Float Animation - Creates a gentle floating effect for elements
 * Used on the main illustration to add visual interest
 */
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

/**
 * Pulse Animation - Creates a breathing/pulsing effect
 * Used on background orbs for ambient motion
 */
const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

/**
 * Slide Up Animation - Elements slide up and fade in
 * Used for entrance animations on content sections
 */
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/**
 * Gradient Move Animation - Animates gradient position
 * Creates a shimmering effect on gradient text
 */
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/**
 * ============================================
 * STYLED COMPONENTS
 * ============================================
 * All styled components for the Homepage layout
 */

/**
 * PageWrapper - Main container for the entire homepage
 * Sets up the dark gradient background and centers content
 */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 2rem;
`;

/**
 * GridPattern - Decorative grid overlay
 * Adds subtle depth and texture to the background
 */
const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

/**
 * BackgroundOrb - Animated floating gradient orbs
 * Creates ambient visual interest in the background
 * Three variations with different positions and colors
 */
const BackgroundOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: ${pulse} 8s ease-in-out infinite;
  pointer-events: none;
  
  &.orb-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    top: -200px;
    right: -100px;
    animation-delay: 0s;
  }
  
  &.orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    bottom: -150px;
    left: -100px;
    animation-delay: 2s;
  }
  
  &.orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
    top: 50%;
    left: 30%;
    animation-delay: 4s;
  }
`;

const ContentContainer = styled(Container)`
  position: relative;
  z-index: 10;
  max-width: 1400px !important;
`;

const IllustrationWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FloatingImage = styled.img`
  width: 100%;
  max-width: 500px;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(99, 102, 241, 0.3));
  position: relative;
  z-index: 2;
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
`;

const ContentCard = styled.div`
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  
  @media (max-width: 900px) {
    text-align: center;
    padding: 2rem 1rem;
  }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50px;
  color: #a5b4fc;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  background-size: 200% 200%;
  animation: ${gradientMove} 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 480px;
  
  @media (max-width: 900px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 320px;
  
  @media (max-width: 900px) {
    margin: 0 auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

const PrimaryButtonStyled = styled(LightPurpleButton)`
  && {
    padding: 16px 32px;
    font-size: 1rem;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  
  button:hover & {
    transform: translateX(4px);
  }
`;

const SecondaryButton = styled(Button)`
  && {
    padding: 14px 32px;
    font-size: 1rem;
    border-radius: 14px;
    color: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    text-transform: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(99, 102, 241, 0.5);
      background: rgba(99, 102, 241, 0.1);
      color: #ffffff;
    }
  }
`;

const SignUpText = styled.p`
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  
  @media (max-width: 900px) {
    text-align: center;
  }
`;

const SignUpLink = styled(Link)`
  color: #8b5cf6;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #a78bfa;
  }
`;
