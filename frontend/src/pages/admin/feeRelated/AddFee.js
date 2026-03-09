import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { CircularProgress, Stack, TextField, MenuItem } from '@mui/material';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const AddFee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);
  const { studentsList } = useSelector(state => state.student);

  const [studentID, setStudentID] = useState('');
  const [feeType, setFeeType] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const adminID = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getAllStudents(adminID));
  }, [adminID, dispatch]);

  const feeTypes = ['Tuition', 'Lab', 'Library', 'Transport', 'Examination', 'Sports', 'Other'];

  const darkMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#1e1e3c',
        border: '1px solid rgba(255,255,255,0.1)',
        '& .MuiMenuItem-root': {
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(99,102,241,0.15)' },
          '&.Mui-selected': { backgroundColor: 'rgba(99,102,241,0.25)' },
        },
      },
    },
  };

  const fields = { student: studentID, feeType, amount: Number(amount), dueDate, remarks, adminID };
  const address = "Fee";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/fees');
      dispatch(underControl());
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <PageWrapper>
      <FormCard>
        <IconWrapper>
          <span>💰</span>
        </IconWrapper>

        <FormHeader>
          <FormTitle>Add Fee Record</FormTitle>
          <FormSubtitle>Create a new fee entry for a student</FormSubtitle>
        </FormHeader>

        <Form onSubmit={submitHandler}>
          <Stack spacing={3}>
            <StyledTextField
              select
              label="Student"
              variant="outlined"
              value={studentID}
              onChange={(event) => setStudentID(event.target.value)}
              required
              fullWidth
              SelectProps={{ MenuProps: darkMenuProps }}
            >
              {studentsList && studentsList.length > 0 && studentsList.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name} (Roll: {student.rollNum})
                </MenuItem>
              ))}
            </StyledTextField>

            <StyledTextField
              select
              label="Fee Type"
              variant="outlined"
              value={feeType}
              onChange={(event) => setFeeType(event.target.value)}
              required
              fullWidth
              SelectProps={{ MenuProps: darkMenuProps }}
            >
              {feeTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </StyledTextField>

            <StyledTextField
              label="Amount"
              type="number"
              variant="outlined"
              placeholder="Enter fee amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />

            <StyledTextField
              label="Due Date"
              type="date"
              variant="outlined"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <StyledTextField
              label="Remarks"
              variant="outlined"
              placeholder="Optional notes about this fee"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            <SubmitButton type="submit" disabled={loader}>
              {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Add Fee Record"}
            </SubmitButton>

            <BackButton type="button" onClick={() => navigate(-1)}>
              Go Back
            </BackButton>
          </Stack>
        </Form>
      </FormCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default AddFee;

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

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 150px);
  padding: 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 40px;
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
  
  span {
    font-size: 2.5rem;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const FormTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const Form = styled.form``;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      color: white;
      
      fieldset {
        border-color: rgba(255, 255, 255, 0.1);
        transition: border-color 0.3s ease;
      }
      
      &:hover fieldset {
        border-color: rgba(255, 255, 255, 0.2);
      }
      
      &.Mui-focused fieldset {
        border-color: #ec4899;
        border-width: 2px;
      }
    }
    
    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.5);
      
      &.Mui-focused {
        color: #ec4899;
      }
    }
    
    input, textarea {
      color: white;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
        opacity: 1;
      }
    }

    .MuiSelect-select {
      color: white;
    }

    .MuiSelect-icon {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(236, 72, 153, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;
