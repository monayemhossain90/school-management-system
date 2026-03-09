import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton, Button, ButtonGroup, Popper, Grow, ClickAwayListener, MenuList, MenuItem
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import * as React from 'react';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const ShowStudents = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
        setMessage("Successfully deleted.")
        setShowPopup(true)
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName.sclassName,
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
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
            navigate("/Admin/students/student/attendance/" + row.id)
        }
        const handleMarks = () => {
            navigate("/Admin/students/student/marks/" + row.id)
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
                <IconButton onClick={() => deleteHandler(row.id, "Student")} sx={{ color: '#ef4444' }}>
                    <PersonRemoveIcon />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}>
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
                            zIndex: 1,
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
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
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

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading students...</LoadingText>
                </LoadingWrapper>
            ) : (
                <>
                    {response ? (
                        <EmptyState>
                            <EmptyIcon>👨‍🎓</EmptyIcon>
                            <EmptyTitle>No Students Yet</EmptyTitle>
                            <EmptyText>Add students to your school to start managing their academic journey</EmptyText>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </EmptyState>
                    ) : (
                        <ContentWrapper>
                            <PageHeader>
                                <HeaderIcon>👨‍🎓</HeaderIcon>
                                <HeaderText>
                                    <PageTitle>Students Management</PageTitle>
                                    <PageSubtitle>{studentsList?.length || 0} students enrolled</PageSubtitle>
                                </HeaderText>
                            </PageHeader>

                            <TableWrapper>
                                {Array.isArray(studentsList) && studentsList.length > 0 &&
                                    <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                                }
                            </TableWrapper>
                            <SpeedDialTemplate actions={actions} />
                        </ContentWrapper>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default ShowStudents;

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
  border: 4px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const ContentWrapper = styled.div``;

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
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
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
  overflow: hidden;
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
  margin-bottom: 24px;
  max-width: 400px;
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
      border-color: rgba(99, 102, 241, 0.3);
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    font-weight: 600;
    text-transform: none;
    padding: 6px 16px;
    
    &:hover {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
    }
  }
`;

const DropdownButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    min-width: 36px;
    
    &:hover {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
      background: rgba(99, 102, 241, 0.15);
    }
    
    &.Mui-selected {
      background: rgba(99, 102, 241, 0.2);
      
      &:hover {
        background: rgba(99, 102, 241, 0.25);
      }
    }
  }
`;