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
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import AddFee from './feeRelated/AddFee';
import ShowFees from './feeRelated/ShowFees';
import ViewFee from './feeRelated/ViewFee';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
import AccountMenu from '../../components/AccountMenu';
import styled from 'styled-components';

const AdminDashboard = () => {
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
                Admin Dashboard
              </DashboardTitle>
              <TitleBadge>Management Portal</TitleBadge>
            </TitleSection>
            <AccountMenu />
          </StyledToolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
          <DrawerHeader>
            <LogoSection>
              <LogoIcon>🎓</LogoIcon>
              {open && <LogoText>EduAdmin</LogoText>}
            </LogoSection>
            <IconButton onClick={toggleDrawer} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <StyledDivider />
          <List component="nav" sx={{ px: 1 }}>
            <SideBar />
          </List>
        </Drawer>
        <MainContent component="main">
          <Toolbar />
          <ContentArea>
            <Routes>
              <Route path="/" element={<AdminHomePage />} />
              <Route path='*' element={<Navigate to="/" />} />
              <Route path="/Admin/dashboard" element={<AdminHomePage />} />
              <Route path="/Admin/profile" element={<AdminProfile />} />
              <Route path="/Admin/complains" element={<SeeComplains />} />

              {/* Notice */}
              <Route path="/Admin/addnotice" element={<AddNotice />} />
              <Route path="/Admin/notices" element={<ShowNotices />} />

              {/* Subject */}
              <Route path="/Admin/subjects" element={<ShowSubjects />} />
              <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
              <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />

              <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
              <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

              <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
              <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

              {/* Class */}
              <Route path="/Admin/addclass" element={<AddClass />} />
              <Route path="/Admin/classes" element={<ShowClasses />} />
              <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
              <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

              {/* Student */}
              <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
              <Route path="/Admin/students" element={<ShowStudents />} />
              <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
              <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
              <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />

              {/* Fee */}
              <Route path="/Admin/fees" element={<ShowFees />} />
              <Route path="/Admin/fees/add" element={<AddFee />} />
              <Route path="/Admin/fees/fee/:id" element={<ViewFee />} />

              {/* Teacher */}
              <Route path="/Admin/teachers" element={<ShowTeachers />} />
              <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
              <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
              <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
              <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
              <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </Box>
    </DashboardWrapper>
  );
}

export default AdminDashboard;

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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #a5b4fc;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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