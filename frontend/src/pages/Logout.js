/**
 * Logout Component
 * 
 * A confirmation page displayed when a user attempts to log out.
 * Features a modern, glassmorphic design with user information display.
 * 
 * Key Features:
 * - Displays current user's avatar and name
 * - Animated wave emoji for friendly UX
 * - Log Out button to confirm logout action
 * - Cancel button to return to previous page
 * - Dispatches authLogout action and redirects to home on logout
 * 
 * @component
 * @returns {JSX.Element} The rendered logout confirmation page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled, { keyframes } from 'styled-components';

const Logout = () => {
  // Get current user from Redux store for displaying user info
  const currentUser = useSelector(state => state.user.currentUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Handles the logout action
   * Dispatches authLogout to clear user session and navigates to home
   */
  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  /**
   * Handles cancel action
   * Navigates back to the previous page in history
   */
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <LogoutWrapper>
      <LogoutCard>
        {/* Animated wave icon for friendly UX */}
        <IconWrapper>
          <LogoutIcon>👋</LogoutIcon>
        </IconWrapper>

        {/* User avatar with first letter of name */}
        <UserAvatar>
          {String(currentUser?.name || 'U').charAt(0).toUpperCase()}
        </UserAvatar>

        <UserName>{currentUser?.name}</UserName>

        {/* Confirmation messages */}
        <LogoutMessage>Are you sure you want to log out?</LogoutMessage>
        <SubMessage>You'll need to sign in again to access your account.</SubMessage>

        {/* Action buttons */}
        <ButtonGroup>
          <LogoutButton onClick={handleLogout}>
            Log Out
          </LogoutButton>
          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </LogoutCard>
    </LogoutWrapper>
  );
};

export default Logout;

/**
 * ============================================
 * ANIMATION KEYFRAMES
 * ============================================
 */

/** Fade in animation with subtle scale effect for card entrance */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

/** Floating animation for the wave emoji */
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

/**
 * ============================================
 * STYLED COMPONENTS
 * ============================================
 */

/** Main wrapper that centers the logout card */
const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
`;

const LogoutCard = styled.div`
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease forwards;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const LogoutIcon = styled.span`
  font-size: 3rem;
  display: inline-block;
  animation: ${float} 3s ease-in-out infinite;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const LogoutMessage = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.5rem;
`;

const SubMessage = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;
