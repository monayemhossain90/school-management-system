import * as React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StudentSideBar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', altPath: '/Student/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { path: '/Student/subjects', icon: <AssignmentIcon />, label: 'Subjects' },
        { path: '/Student/attendance', icon: <ClassOutlinedIcon />, label: 'Attendance' },
        { path: '/Student/complain', icon: <AnnouncementOutlinedIcon />, label: 'Complain' },
    ];

    const userItems = [
        { path: '/Student/profile', icon: <AccountCircleOutlinedIcon />, label: 'Profile' },
        { path: '/logout', icon: <ExitToAppIcon />, label: 'Logout' },
    ];

    const isActive = (item) => {
        if (item.altPath && (location.pathname === item.path || location.pathname === item.altPath)) {
            return true;
        }
        return location.pathname.startsWith(item.path) && item.path !== '/';
    };

    return (
        <NavContainer>
            <NavSection>
                <SectionLabel>Main Menu</SectionLabel>
                {menuItems.map((item) => (
                    <StyledListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path === '/' ? '/Student/dashboard' : item.path}
                        $isActive={isActive(item) || (item.path === '/' && location.pathname === '/')}
                    >
                        <IconWrapper $isActive={isActive(item) || (item.path === '/' && location.pathname === '/')}>
                            {item.icon}
                        </IconWrapper>
                        <StyledListItemText primary={item.label} />
                        {(isActive(item) || (item.path === '/' && location.pathname === '/')) && <ActiveIndicator />}
                    </StyledListItemButton>
                ))}
            </NavSection>

            <Divider />

            <NavSection>
                <SectionLabel>Account</SectionLabel>
                {userItems.map((item) => (
                    <StyledListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path}
                        $isActive={location.pathname.startsWith(item.path)}
                        $isLogout={item.path === '/logout'}
                    >
                        <IconWrapper
                            $isActive={location.pathname.startsWith(item.path)}
                            $isLogout={item.path === '/logout'}
                        >
                            {item.icon}
                        </IconWrapper>
                        <StyledListItemText primary={item.label} />
                        {location.pathname.startsWith(item.path) && <ActiveIndicator />}
                    </StyledListItemButton>
                ))}
            </NavSection>
        </NavContainer>
    );
};

export default StudentSideBar;

// Styled Components - Using green accent for students
const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  height: 100%;
`;

const NavSection = styled.div`
  padding: 8px 0;
`;

const SectionLabel = styled(ListSubheader)`
  && {
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 8px 20px;
    line-height: 1.5;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
  margin: 8px 16px;
`;

const StyledListItemButton = styled(ListItemButton)`
  && {
    margin: 4px 8px;
    padding: 12px 16px;
    border-radius: 12px;
    position: relative;
    transition: all 0.25s ease;
    background: ${props => props.$isActive
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%)'
        : 'transparent'};
    border: 1px solid ${props => props.$isActive ? 'rgba(16, 185, 129, 0.3)' : 'transparent'};
    
    &:hover {
      background: ${props => props.$isActive
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)'
        : 'rgba(255, 255, 255, 0.05)'};
      border-color: ${props => props.$isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
    }

    ${props => props.$isLogout && `
      &:hover {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
      }
    `}
  }
`;

const IconWrapper = styled(ListItemIcon)`
  && {
    min-width: 40px;
    color: ${props => {
        if (props.$isLogout) return 'rgba(239, 68, 68, 0.8)';
        return props.$isActive ? '#34d399' : 'rgba(255, 255, 255, 0.5)';
    }};
    transition: all 0.25s ease;
    
    svg {
      font-size: 1.35rem;
    }
  }
`;

const StyledListItemText = styled(ListItemText)`
  && {
    .MuiTypography-root {
      font-weight: 500;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.85);
    }
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  right: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
`;