import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import Popup from '../../components/Popup';

const TeacherFees = () => {
  const { currentUser } = useSelector(state => state.user);

  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingFees, setLoadingFees] = useState(true);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [feeType, setFeeType] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Edit state
  const [editingFee, setEditingFee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const classId = currentUser?.teachSclass?._id || currentUser?.teachSclass;
  const schoolId = currentUser?.school?._id || currentUser?.school;

  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchFees();
    }
  }, [classId]);

  const fetchStudents = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Sclass/Students/${classId}`);
      if (Array.isArray(result.data)) {
        setStudents(result.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchFees = async (resolvedSchoolId) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeList/${resolvedSchoolId}`);
      if (Array.isArray(result.data)) {
        // Filter to only show fees for students in this class
        const classStudentIds = students.map(s => s._id);
        setFees(result.data);
      } else {
        setFees([]);
      }
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setLoadingFees(false);
    }
  };

  // Re-fetch fees when students are loaded
  useEffect(() => {
    if (students.length > 0) {
      const studentSchoolId = students[0]?.school?._id || students[0]?.school;
      const resolvedSchoolId = schoolId || studentSchoolId;
      if (resolvedSchoolId) {
        fetchFees(resolvedSchoolId);
      } else {
        setLoadingFees(false);
      }
    } else if (!loadingStudents) {
      setLoadingFees(false);
    }
  }, [students, schoolId, loadingStudents]);

  const resetForm = () => {
    setSelectedStudent('');
    setFeeType('');
    setAmount('');
    setDueDate('');
    setRemarks('');
    setPaidAmount('');
    setEditingFee(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    try {
      if (editingFee) {
        // Update existing fee
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Fee/${editingFee._id}`, {
          feeType,
          amount: Number(amount),
          dueDate,
          remarks,
          paidAmount: Number(paidAmount || 0),
          status: Number(paidAmount || 0) >= Number(amount) ? 'Paid' :
            Number(paidAmount || 0) > 0 ? 'Partial' : 'Pending',
        });
        setMessage("Fee updated successfully");
      } else {
        // Create new fee
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FeeCreate`, {
          student: selectedStudent,
          feeType,
          amount: Number(amount),
          dueDate,
          remarks,
          paidAmount: Number(paidAmount || 0),
          adminID: schoolId,
          status: Number(paidAmount || 0) >= Number(amount) ? 'Paid' :
            Number(paidAmount || 0) > 0 ? 'Partial' : 'Pending',
        });
        setMessage("Fee added successfully");
      }
      setShowPopup(true);
      resetForm();
      setShowForm(false);

      const studentSchoolId = students[0]?.school?._id || students[0]?.school;
      const resolvedSchoolId = schoolId || studentSchoolId;
      if (resolvedSchoolId) {
        fetchFees(resolvedSchoolId);
      }
    } catch (err) {
      setMessage("Error saving fee");
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setSelectedStudent(fee.student?._id || fee.student);
    setFeeType(fee.feeType);
    setAmount(fee.amount);
    setDueDate(fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '');
    setRemarks(fee.remarks || '');
    setPaidAmount(fee.paidAmount || 0);
    setShowForm(true);
  };

  // Filter fees for students in this class only
  const classStudentIds = students.map(s => s._id);
  const classFees = fees.filter(f => {
    const studentId = f.student?._id || f.student;
    return classStudentIds.includes(studentId);
  });

  const getStudentName = (studentId) => {
    const id = studentId?._id || studentId;
    const student = students.find(s => s._id === id);
    return student ? student.name : (studentId?.name || 'Unknown');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toISOString().substring(0, 10) : '-';
  };

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

  if (!currentUser) {
    return (
      <PageWrapper>
        <LoadingState>
          <CircularProgress sx={{ color: '#f59e0b' }} />
        </LoadingState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <HeaderLeft>
          <HeaderIconBox>💰</HeaderIconBox>
          <HeaderText>
            <PageTitle>Fee Management</PageTitle>
            <PageSubtitle>
              Manage fees for your class students · {classFees.length} records
            </PageSubtitle>
          </HeaderText>
        </HeaderLeft>
        <AddButton onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Fee'}
        </AddButton>
      </PageHeader>

      {showForm && (
        <FormCard>
          <FormTitle>{editingFee ? '✏️ Edit Fee' : '➕ Add New Fee'}</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGrid>
              {!editingFee && (
                <StyledTextField
                  select
                  fullWidth
                  label="Select Student"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  SelectProps={{ MenuProps: darkMenuProps }}
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.name} (Roll: {student.rollNum})
                    </MenuItem>
                  ))}
                </StyledTextField>
              )}
              <StyledTextField
                fullWidth
                select
                label="Fee Type"
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                required
                SelectProps={{ MenuProps: darkMenuProps }}
              >
                {['Tuition Fee', 'Exam Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Other'].map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </StyledTextField>
              <StyledTextField
                fullWidth
                label="Amount (tk)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <StyledTextField
                fullWidth
                label="Paid Amount (tk)"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                multiline
                rows={2}
              />
            </FormGrid>
            <SubmitButton type="submit" disabled={loader}>
              {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> :
                editingFee ? 'Update Fee' : 'Add Fee'}
            </SubmitButton>
          </Form>
        </FormCard>
      )}

      {loadingStudents || loadingFees ? (
        <LoadingState>
          <CircularProgress sx={{ color: '#f59e0b' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>Loading data...</p>
        </LoadingState>
      ) : classFees.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💰</EmptyIcon>
          <EmptyTitle>No Fee Records</EmptyTitle>
          <EmptyText>Click "Add Fee" to create fee records for your students.</EmptyText>
        </EmptyState>
      ) : (
        <FeeTable>
          <TableHeader>
            <HeaderCell>Student</HeaderCell>
            <HeaderCell>Fee Type</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Paid</HeaderCell>
            <HeaderCell>Due Date</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>Action</HeaderCell>
          </TableHeader>
          {classFees.map((fee) => (
            <TableRow key={fee._id}>
              <TableCell>
                <StudentName>{getStudentName(fee.student)}</StudentName>
              </TableCell>
              <TableCell>{fee.feeType}</TableCell>
              <TableCell>tk {fee.amount?.toLocaleString()}</TableCell>
              <TableCell>tk {(fee.paidAmount || 0).toLocaleString()}</TableCell>
              <TableCell>{formatDate(fee.dueDate)}</TableCell>
              <TableCell>
                <StatusBadge $status={fee.status}>
                  {fee.status || 'Pending'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <EditButton onClick={() => handleEdit(fee)}>
                  ✏️ Edit
                </EditButton>
              </TableCell>
            </TableRow>
          ))}
        </FeeTable>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default TeacherFees;

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageWrapper = styled.div`
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderIconBox = styled.span`
  font-size: 2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 14px;
`;

const HeaderText = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #1a1a2e;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  }
`;

const FormCard = styled.div`
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.3s ease forwards;
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
`;

const Form = styled.form``;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      color: white;

      fieldset {
        border-color: rgba(255, 255, 255, 0.1);
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

    .MuiSelect-select {
      color: white !important;
      -webkit-text-fill-color: white !important;
    }

    .MuiSelect-icon {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SubmitButton = styled.button`
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #1a1a2e;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FeeTable = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.8fr 0.8fr 1fr 0.8fr 0.7fr;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const HeaderCell = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.8fr 0.8fr 1fr 0.8fr 0.7fr;
  padding: 14px 20px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StudentName = styled.span`
  font-weight: 600;
  color: #ffffff;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'Paid') return 'rgba(16, 185, 129, 0.15)';
    if (props.$status === 'Partial') return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(239, 68, 68, 0.15)';
  }};
  color: ${props => {
    if (props.$status === 'Paid') return '#34d399';
    if (props.$status === 'Partial') return '#fbbf24';
    return '#f87171';
  }};
  border: 1px solid ${props => {
    if (props.$status === 'Paid') return 'rgba(16, 185, 129, 0.3)';
    if (props.$status === 'Partial') return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  }};
`;

const EditButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.25);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 40px;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
`;

const EmptyIcon = styled.span`
  font-size: 3.5rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
`;
