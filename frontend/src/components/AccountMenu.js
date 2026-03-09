/**
 * AccountMenu Component
 * 
 * A dropdown menu for user account actions displayed in the app header.
 * Features role-specific avatar colors and glassmorphic styling.
 * 
 * Key Features:
 * - Role-specific gradient avatar (Admin: purple, Student: green, Teacher: amber)
 * - User name and role display in menu header
 * - Profile, Settings, and Logout menu items
 * - Glassmorphic dropdown with smooth hover effects
 * - Responsive positioning with proper anchoring
 * 
 * @component
 * @returns {JSX.Element} The rendered account menu button and dropdown
 */

import React, { useState } from 'react';
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Settings, Logout, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const AccountMenu = () => {
  // Anchor element for menu positioning
  const [anchorEl, setAnchorEl] = useState(null);

  // Menu open state
  const open = Boolean(anchorEl);

  // Get current user data from Redux store
  const { currentRole, currentUser } = useSelector(state => state.user);

  /**
   * Opens the account menu dropdown
   * @param {Event} event - Click event from the avatar button
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the account menu dropdown
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Returns the gradient color based on user role
   * Used for avatar background to visually identify user type
   * 
   * @returns {string} CSS gradient string
   */
  const getAvatarGradient = () => {
    switch (currentRole) {
      case 'Admin': return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
      case 'Student': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'Teacher': return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      default: return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <StyledIconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledAvatar $gradient={getAvatarGradient()}>
              {String(currentUser.name).charAt(0).toUpperCase()}
            </StyledAvatar>
          </StyledIconButton>
        </Tooltip>
      </Box>
      <StyledMenu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuHeader>
          <HeaderAvatar $gradient={getAvatarGradient()}>
            {String(currentUser.name).charAt(0).toUpperCase()}
          </HeaderAvatar>
          <HeaderInfo>
            <HeaderName>{currentUser.name}</HeaderName>
            <HeaderRole>{currentRole}</HeaderRole>
          </HeaderInfo>
        </MenuHeader>

        <StyledDivider />

        <StyledMenuItem component={Link} to={`/${currentRole}/profile`}>
          <StyledListItemIcon>
            <Person fontSize="small" />
          </StyledListItemIcon>
          Profile
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClose}>
          <StyledListItemIcon>
            <Settings fontSize="small" />
          </StyledListItemIcon>
          Settings
        </StyledMenuItem>

        <StyledDivider />

        <StyledMenuItem component={Link} to="/logout" $isLogout>
          <StyledListItemIcon $isLogout>
            <Logout fontSize="small" />
          </StyledListItemIcon>
          Logout
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
};

export default AccountMenu;

// Styled Components
const StyledIconButton = styled(IconButton)`
  && {
    padding: 4px;
    margin-left: 12px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 36px;
    height: 36px;
    background: ${props => props.$gradient};
    font-weight: 700;
    font-size: 0.95rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StyledMenu = styled(Menu)`
  && {
    .MuiPaper-root {
      background: rgba(26, 26, 46, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      min-width: 240px;
      margin-top: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      overflow: visible;
      
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: -6px;
        right: 20px;
        width: 12px;
        height: 12px;
        background: rgba(26, 26, 46, 0.95);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        transform: rotate(45deg);
      }
    }
  }
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

const HeaderAvatar = styled(Avatar)`
  && {
    width: 44px;
    height: 44px;
    background: ${props => props.$gradient};
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const HeaderInfo = styled.div``;

const HeaderName = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
`;

const HeaderRole = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: capitalize;
`;

const StyledDivider = styled(Divider)`
  && {
    background: rgba(255, 255, 255, 0.08);
    margin: 8px 16px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    padding: 12px 16px;
    margin: 4px 8px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    text-decoration: none;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    
    ${props => props.$isLogout && `
      color: #f87171;
      
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    `}
  }
`;

const StyledListItemIcon = styled(ListItemIcon)`
  && {
    min-width: 36px;
    color: ${props => props.$isLogout ? '#f87171' : 'rgba(255, 255, 255, 0.6)'};
  }
`;