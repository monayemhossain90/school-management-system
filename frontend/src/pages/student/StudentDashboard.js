import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import styled from 'styled-components';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <DashboardWrapper>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <StyledToolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '24px',
                                ...(open && { display: 'none' }),
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <TitleSection>
                            <DashboardTitle variant="h6" noWrap>
                                Student Dashboard
                            </DashboardTitle>
                            <TitleBadge $color="#10b981">Learning Portal</TitleBadge>
                        </TitleSection>
                        <AccountMenu />
                    </StyledToolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <DrawerHeader>
                        <LogoSection>
                            <LogoIcon>📚</LogoIcon>
                            {open && <LogoText $color="#10b981">EduLearn</LogoText>}
                        </LogoSection>
                        <IconButton onClick={toggleDrawer} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </DrawerHeader>
                    <StyledDivider />
                    <List component="nav" sx={{ px: 1 }}>
                        <StudentSideBar />
                    </List>
                </Drawer>
                <MainContent component="main">
                    <Toolbar />
                    <ContentArea>
                        <Routes>
                            <Route path="/" element={<StudentHomePage />} />
                            <Route path='*' element={<Navigate to="/" />} />
                            <Route path="/Student/dashboard" element={<StudentHomePage />} />
                            <Route path="/Student/profile" element={<StudentProfile />} />

                            <Route path="/Student/subjects" element={<StudentSubjects />} />
                            <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                            <Route path="/Student/complain" element={<StudentComplain />} />

                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </ContentArea>
                </MainContent>
            </Box>
        </DashboardWrapper>
    );
};

export default StudentDashboard;

// Styled Components
const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
`;

const StyledToolbar = styled(Toolbar)`
  && {
    padding-right: 24px;
    display: flex;
    align-items: center;
  }
`;

const TitleSection = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DashboardTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 1.25rem;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
`;

const TitleBadge = styled.span`
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #34d399;
  font-weight: 500;
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  min-height: 64px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StyledDivider = styled(Divider)`
  && {
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
    margin: 0 16px;
  }
`;

const MainContent = styled(Box)`
  flex-grow: 1;
  min-height: 100vh;
  overflow: auto;
  background: linear-gradient(180deg, rgba(15, 15, 35, 0.5) 0%, rgba(26, 26, 46, 0.5) 100%);
`;

const ContentArea = styled.div`
  padding: 24px;
  min-height: calc(100vh - 64px);
  
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const styles = {
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
};