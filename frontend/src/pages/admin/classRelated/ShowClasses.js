/**
 * ShowClasses Component
 * 
 * Admin page for managing school classes.
 * Displays a list of all classes with options to add subjects/students.
 * 
 * Key Features:
 * - Table view of all classes with pagination
 * - Delete class functionality with confirmation popup
 * - Quick action menu for adding subjects and students
 * - Speed dial for creating new classes
 * - Glassmorphic design with purple/indigo accents
 * 
 * @component
 * @returns {JSX.Element} The rendered classes management page
 */

import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled, { keyframes } from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  // Extract class data and loading states from Redux store
  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  // Admin ID for fetching school-specific classes
  const adminID = currentUser._id

  /**
   * Fetch all classes on component mount
   */
  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  // Error logging for debugging
  if (error) {
    console.log(error)
  }

  // State for delete confirmation popup
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Handles class deletion
   * Dispatches delete action and refreshes the class list
   * 
   * @param {string} deleteID - ID of the class to delete
   * @param {string} address - Type of entity being deleted ('Sclass')
   */
  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
      })
    setMessage("Successfully Deleted.")
    setShowPopup(true)
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
      id: sclass._id,
    };
  })

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <ButtonContainer>
        <IconButton onClick={() => deleteHandler(row.id, "Sclass")} sx={{ color: '#ef4444' }}>
          <DeleteIcon />
        </IconButton>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <AddButton
              onClick={handleClick}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <span>Add</span>
              <SpeedDialIcon />
            </AddButton>
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
          {actions.map((action, index) => (
            <StyledMenuItem key={index} onClick={action.action}>
              <ListItemIcon sx={{ color: '#a5b4fc' }}>
                {action.icon}
              </ListItemIcon>
              {action.name}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <PageWrapper>
      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <LoadingText>Loading classes...</LoadingText>
        </LoadingWrapper>
      ) : (
        <>
          {getresponse ? (
            <EmptyState>
              <EmptyIcon>🏫</EmptyIcon>
              <EmptyTitle>No Classes Yet</EmptyTitle>
              <EmptyText>Create your first class to get started with managing students and subjects</EmptyText>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
                Add Class
              </GreenButton>
            </EmptyState>
          ) : (
            <ContentWrapper>
              <PageHeader>
                <HeaderIcon>🏫</HeaderIcon>
                <HeaderText>
                  <PageTitle>Classes Management</PageTitle>
                  <PageSubtitle>{sclassesList?.length || 0} classes in your school</PageSubtitle>
                </HeaderText>
              </PageHeader>

              <TableWrapper>
                {Array.isArray(sclassesList) && sclassesList.length > 0 &&
                  <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
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

export default ShowClasses;

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
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #a5b4fc;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
    border-color: rgba(99, 102, 241, 0.5);
  }
  
  .MuiSpeedDialIcon-root {
    width: 20px;
    height: 20px;
  }
`;

const StyledMenu = styled(Menu)`
  && {
    .MuiPaper-root {
      background: rgba(26, 26, 46, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      min-width: 180px;
      margin-top: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(99, 102, 241, 0.15);
    }
  }
`;