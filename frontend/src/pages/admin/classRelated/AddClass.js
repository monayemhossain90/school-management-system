import React, { useEffect, useState } from "react";
import { CircularProgress, Stack, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import styled, { keyframes } from "styled-components";

const AddClass = () => {
  const [sclassName, setSclassName] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userState = useSelector(state => state.user);
  const { status, currentUser, response, error, tempDetails } = userState;

  const adminID = currentUser._id
  const address = "Sclass"

  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    sclassName,
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(addStuff(fields, address))
  };

  useEffect(() => {
    if (status === 'added' && tempDetails) {
      navigate("/Admin/classes/class/" + tempDetails._id)
      dispatch(underControl())
      setLoader(false)
    }
    else if (status === 'failed') {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

  return (
    <PageWrapper>
      <FormCard>
        <IconWrapper>
          <span>🏫</span>
        </IconWrapper>

        <FormHeader>
          <FormTitle>Create New Class</FormTitle>
          <FormSubtitle>Add a new class to your school</FormSubtitle>
        </FormHeader>

        <Form onSubmit={submitHandler}>
          <Stack spacing={3}>
            <StyledTextField
              label="Class Name"
              variant="outlined"
              placeholder="e.g., Grade 10, Class A"
              value={sclassName}
              onChange={(event) => {
                setSclassName(event.target.value);
              }}
              required
              fullWidth
            />
            <SubmitButton
              type="submit"
              disabled={loader}
            >
              {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Create Class"}
            </SubmitButton>
            <BackButton type="button" onClick={() => navigate(-1)}>
              Go Back
            </BackButton>
          </Stack>
        </Form>
      </FormCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  )
}

export default AddClass

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
  max-width: 480px;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  
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
        border-color: #6366f1;
        border-width: 2px;
      }
    }
    
    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.5);
      
      &.Mui-focused {
        color: #6366f1;
      }
    }
    
    input, textarea {
      color: white;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
        opacity: 1;
      }
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
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