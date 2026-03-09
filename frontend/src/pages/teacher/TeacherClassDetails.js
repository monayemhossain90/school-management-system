import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import styled, { keyframes } from 'styled-components';

const TeacherClassDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser.teachSclass?._id
  const subjectID = currentUser.teachSubject?._id

  useEffect(() => {
    dispatch(getClassStudents(classID));
  }, [dispatch, classID])

  if (error) {
    console.log(error)
  }

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  })

  const StudentsButtonHaver = ({ row }) => {
    const options = ['Take Attendance', 'Provide Marks'];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
    }
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    return (
      <ButtonContainer>
        <BlueButton
          variant="contained"
          onClick={() =>
            navigate("/Teacher/class/student/" + row.id)
          }
        >
          View
        </BlueButton>
        <React.Fragment>
          <StyledButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
            <ActionButton onClick={handleClick}>{options[selectedIndex]}</ActionButton>
            <DropdownButton
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </DropdownButton>
          </StyledButtonGroup>
          <Popper
            sx={{
              zIndex: 9999,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <StyledPaper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <StyledMenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                          sx={{ color: 'white' }}
                        >
                          {option}
                        </StyledMenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </StyledPaper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      </ButtonContainer>
    );
  };

  return (
    <PageWrapper>
      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <LoadingText>Loading class details...</LoadingText>
        </LoadingWrapper>
      ) : (
        <>
          <PageHeader>
            <HeaderIcon>👨‍🎓</HeaderIcon>
            <HeaderText>
              <PageTitle>Class Students</PageTitle>
              <PageSubtitle>
                {currentUser.teachSclass?.sclassName} • {sclassStudents?.length || 0} students
              </PageSubtitle>
            </HeaderText>
          </PageHeader>

          {getresponse ? (
            <EmptyState>
              <EmptyIcon>📚</EmptyIcon>
              <EmptyTitle>No Students Found</EmptyTitle>
              <EmptyText>There are no students enrolled in this class yet</EmptyText>
            </EmptyState>
          ) : (
            <TableWrapper>
              {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
              }
            </TableWrapper>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default TeacherClassDetails;

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
  border: 4px solid rgba(245, 158, 11, 0.2);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

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
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
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

const TableWrapper = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: visible;
  padding-bottom: 80px;
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

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  && {
    .MuiButtonGroup-grouped {
      border-color: rgba(245, 158, 11, 0.3);
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    color: #1a1a2e;
    font-weight: 600;
    text-transform: none;
    padding: 6px 16px;
    
    &:hover {
      background: linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%);
    }
  }
`;

const DropdownButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
    color: #1a1a2e;
    min-width: 36px;
    
    &:hover {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    }
  }
`;

const StyledPaper = styled(Paper)`
  && {
    background: rgba(26, 26, 46, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    margin-top: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    padding: 12px 20px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    
    &:hover {
      background: rgba(245, 158, 11, 0.15);
    }
    
    &.Mui-selected {
      background: rgba(245, 158, 11, 0.2);
      
      &:hover {
        background: rgba(245, 158, 11, 0.25);
      }
    }
  }
`;