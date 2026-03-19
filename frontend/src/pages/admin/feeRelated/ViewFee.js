import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { CircularProgress, Stack, TextField, MenuItem } from '@mui/material';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const ViewFee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paidAmount, setPaidAmount] = useState('');
  const [status, setStatus] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Fee/${id}`);
        if (result.data && !result.data.message) {
          setFee(result.data);
          setPaidAmount(result.data.paidAmount || 0);
          setStatus(result.data.status);
          setPaidDate(result.data.paidDate ? new Date(result.data.paidDate).toISOString().substring(0, 10) : '');
        } else {
          setMessage('Fee record not found');
          setShowPopup(true);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error fetching fee details');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFee();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const fields = {
        paidAmount: Number(paidAmount),
        status,
        paidDate: paidDate || undefined,
      };
      const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Fee/${id}`, fields);
      if (result.data) {
        setFee(result.data);
        setMessage('Fee record updated successfully!');
        setShowPopup(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating fee');
      setShowPopup(true);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>Loading fee details...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (!fee) {
    return (
      <EmptyState>
        <EmptyIcon>❌</EmptyIcon>
        <EmptyTitle>Fee Record Not Found</EmptyTitle>
        <BackBtn onClick={() => navigate('/Admin/fees')}>Go Back to Fees</BackBtn>
      </EmptyState>
    );
  }

  const dueDate = new Date(fee.dueDate);
  const dueDateString = dueDate.toString() !== "Invalid Date" ? dueDate.toISOString().substring(0, 10) : "N/A";

  return (
    <PageWrapper>
      <DetailCard>
        <IconWrap>
          <span>💰</span>
        </IconWrap>

        <FormHeader>
          <FormTitle>Fee Details</FormTitle>
          <FormSubtitle>View and update payment status</FormSubtitle>
        </FormHeader>

        {/* Read-only Info */}
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Student</InfoLabel>
            <InfoValue>{fee.student?.name || 'Unknown'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Roll Number</InfoLabel>
            <InfoValue>{fee.student?.rollNum || 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Fee Type</InfoLabel>
            <InfoValue>{fee.feeType}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Total Amount</InfoLabel>
            <InfoValue highlight>tk {fee.amount}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Due Date</InfoLabel>
            <InfoValue>{dueDateString}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Remarks</InfoLabel>
            <InfoValue>{fee.remarks || 'None'}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <Divider />

        {/* Update form */}
        <UpdateSection>
          <SectionTitle>Update Payment</SectionTitle>
          <Form onSubmit={handleUpdate}>
            <Stack spacing={3}>
              <StyledTextField
                label="Paid Amount"
                type="number"
                variant="outlined"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: fee.amount }}
              />

              <StyledTextField
                select
                label="Status"
                variant="outlined"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                SelectProps={{ MenuProps: darkMenuProps }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </StyledTextField>

              <StyledTextField
                label="Payment Date"
                type="date"
                variant="outlined"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <SubmitButton type="submit" disabled={updating}>
                {updating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Update Payment"}
              </SubmitButton>

              <BackBtn type="button" onClick={() => navigate('/Admin/fees')}>
                Back to Fees
              </BackBtn>
            </Stack>
          </Form>
        </UpdateSection>
      </DetailCard>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default ViewFee;

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: calc(100vh - 150px);
  padding: 20px;
`;

const DetailCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 40px;
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const IconWrap = styled.div`
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
`;

const InfoLabel = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 6px;
  font-weight: 600;
`;

const InfoValue = styled.p`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${props => props.highlight ? '#f472b6' : '#ffffff'};
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  margin: 24px 0;
`;

const UpdateSection = styled.div``;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
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
      &.Mui-focused { color: #ec4899; }
    }
    input, textarea { color: white; }
    .MuiSelect-select { color: white; }
    .MuiSelect-icon { color: rgba(255, 255, 255, 0.5); }
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

const BackBtn = styled.button`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.span`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
`;
