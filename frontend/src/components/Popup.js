import * as React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../redux/userRelated/userSlice';
import { underStudentControl } from '../redux/studentRelated/studentSlice';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import styled from 'styled-components';

const Popup = ({ message, setShowPopup, showPopup }) => {
  const dispatch = useDispatch();

  const vertical = "top";
  const horizontal = "right";

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowPopup(false);
    dispatch(underControl());
    dispatch(underStudentControl());
  };

  const successMessages = [
    "Done Successfully",
    "Complaint submitted successfully",
    "Complaint resolved",
    "Fee updated successfully",
    "Fee added successfully",
  ];
  const isSuccess = successMessages.some(msg => message?.toLowerCase().includes(msg.toLowerCase()))
    || message?.toLowerCase().includes("success");

  return (
    <StyledSnackbar
      open={showPopup}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
    >
      <StyledAlert
        onClose={handleClose}
        severity={isSuccess ? "success" : "error"}
        $isSuccess={isSuccess}
      >
        <AlertContent>
          <AlertIcon>{isSuccess ? '✓' : '✕'}</AlertIcon>
          <AlertText>{message}</AlertText>
        </AlertContent>
      </StyledAlert>
    </StyledSnackbar>
  );
};

export default Popup;

// Styled Components
const StyledSnackbar = styled(Snackbar)`
  && {
    .MuiSnackbar-root {
      top: 24px;
      right: 24px;
    }
  }
`;

const StyledAlert = styled(MuiAlert)`
  && {
    background: ${props => props.$isSuccess
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(52, 211, 153, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(248, 113, 113, 0.95) 100%)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${props => props.$isSuccess
    ? 'rgba(52, 211, 153, 0.3)'
    : 'rgba(248, 113, 113, 0.3)'};
    border-radius: 14px;
    padding: 12px 20px;
    box-shadow: 0 10px 40px ${props => props.$isSuccess
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'};
    min-width: 280px;
    
    .MuiAlert-icon {
      display: none;
    }
    
    .MuiAlert-action {
      padding: 0;
      margin-right: -8px;
      
      .MuiIconButton-root {
        color: white;
        opacity: 0.8;
        
        &:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    
    .MuiAlert-message {
      padding: 0;
      width: 100%;
    }
  }
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AlertIcon = styled.span`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
`;

const AlertText = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
`;
