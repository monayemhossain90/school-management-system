import { useEffect, useState } from 'react';
import { CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const TeacherComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");

  const dispatch = useDispatch()

  const { status, currentUser, error } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault()
    if (!currentUser?._id) {
      setMessage("Please log out and log back in.")
      setShowPopup(true)
      return
    }
    setLoader(true)
    const fields = {
      user: currentUser._id,
      userType: 'teacher',
      date,
      complaint,
    };
    dispatch(addStuff(fields, "Complain"))
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false)
      setShowPopup(true)
      setMessage("Complaint submitted successfully")
      setComplaint("")
      setDate("")
    }
    else if (error) {
      setLoader(false)
      setShowPopup(true)
      setMessage("Network Error")
    }
  }, [status, error])

  if (!currentUser) {
    return (
      <PageWrapper>
        <LoadingState>
          <CircularProgress sx={{ color: '#f59e0b' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>Loading user data...</p>
        </LoadingState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <FormCard>
        <IconWrapper>
          <span>📝</span>
        </IconWrapper>

        <FormHeader>
          <FormTitle>Submit a Complaint</FormTitle>
          <FormSubtitle>Share your feedback or concerns with the administration</FormSubtitle>
        </FormHeader>

        <Form onSubmit={submitHandler}>
          <Stack spacing={3}>
            <StyledTextField
              fullWidth
              label="Select Date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
            <StyledTextField
              fullWidth
              label="Write your complaint"
              variant="outlined"
              placeholder="Describe your issue in detail..."
              value={complaint}
              onChange={(event) => setComplaint(event.target.value)}
              required
              multiline
              rows={4}
            />

            <SubmitButton type="submit" disabled={loader}>
              {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Submit Complaint"}
            </SubmitButton>
          </Stack>
        </Form>
      </FormCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default TeacherComplain;

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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
  
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
        border-color: #f59e0b;
        border-width: 2px;
      }
      
      input {
        color: white;
        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
      }
      
      textarea {
        color: white;
      }
    }
    
    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.5);
      
      &.Mui-focused {
        color: #f59e0b;
      }
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #1a1a2e;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(245, 158, 11, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;