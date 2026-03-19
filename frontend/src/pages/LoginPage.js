/**
 * LoginPage Component
 * 
 * A dynamic login page that adapts based on user role (Admin, Student, Teacher).
 * Features a modern split-screen design with role-specific theming.
 * 
 * Key Features:
 * - Role-based form fields (email for Admin/Teacher, rollNumber for Student)
 * - Guest mode login for demo purposes
 * - Form validation with error states
 * - Password visibility toggle
 * - Animated gradient backgrounds and decorative elements
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.role - User role ('Admin', 'Student', or 'Teacher')
 * @returns {JSX.Element} The rendered login page
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Grid, Checkbox, FormControlLabel,
  TextField, IconButton, InputAdornment, CircularProgress, Backdrop
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const LoginPage = ({ role }) => {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract user-related state from Redux store
  const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

  // Local state management
  const [toggle, setToggle] = useState(false);           // Password visibility toggle
  const [guestLoader, setGuestLoader] = useState(false); // Loading state for guest login
  const [loader, setLoader] = useState(false);           // Loading state for regular login
  const [showPopup, setShowPopup] = useState(false);     // Popup visibility
  const [message, setMessage] = useState("");            // Popup message content

  // Form validation error states
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  /**
   * Handles form submission for login
   * Validates required fields and dispatches login action
   * 
   * @param {Event} event - Form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Student login uses rollNumber and studentName
    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      // Validate required fields
      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      // Admin and Teacher login use email
      const email = event.target.email.value;
      const password = event.target.password.value;

      // Validate required fields
      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  /**
   * Clears validation errors when user types in input fields
   * 
   * @param {Event} event - Input change event
   */
  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "zxc";

    if (role === "Admin") {
      const email = "yogendra@12";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === "Student") {
      const rollNum = "1";
      const studentName = "Dipesh Awasthi";
      const fields = { rollNum, studentName, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === "Teacher") {
      const email = "tony@12";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  const getRoleColor = () => {
    switch (role) {
      case 'Admin': return { primary: '#6366f1', secondary: '#8b5cf6' };
      case 'Student': return { primary: '#10b981', secondary: '#34d399' };
      case 'Teacher': return { primary: '#f59e0b', secondary: '#fbbf24' };
      default: return { primary: '#6366f1', secondary: '#8b5cf6' };
    }
  };

  const colors = getRoleColor();

  return (
    <PageWrapper>
      {/* Background Elements */}
      <BackgroundOrb $color={colors.primary} className="orb-1" />
      <BackgroundOrb $color={colors.secondary} className="orb-2" />
      <GridPattern />

      <ContentWrapper>
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <FormSection>
              <FormCard>
                <LogoSection>
                  <RoleBadge $gradient={`linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`}>
                    {role}
                  </RoleBadge>
                </LogoSection>

                <WelcomeText>
                  <Title>Welcome back! 👋</Title>
                  <Subtitle>Enter your credentials to access your {role.toLowerCase()} account</Subtitle>
                </WelcomeText>

                <Form onSubmit={handleSubmit}>
                  {role === "Student" ? (
                    <>
                      <StyledTextField
                        fullWidth
                        id="rollNumber"
                        label="Roll Number"
                        name="rollNumber"
                        autoComplete="off"
                        type="number"
                        autoFocus
                        error={rollNumberError}
                        helperText={rollNumberError && 'Roll Number is required'}
                        onChange={handleInputChange}
                        $accentColor={colors.primary}
                      />
                      <StyledTextField
                        fullWidth
                        id="studentName"
                        label="Your Name"
                        name="studentName"
                        autoComplete="name"
                        error={studentNameError}
                        helperText={studentNameError && 'Name is required'}
                        onChange={handleInputChange}
                        $accentColor={colors.primary}
                      />
                    </>
                  ) : (
                    <StyledTextField
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={emailError}
                      helperText={emailError && 'Email is required'}
                      onChange={handleInputChange}
                      $accentColor={colors.primary}
                    />
                  )}

                  <StyledTextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={toggle ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    error={passwordError}
                    helperText={passwordError && 'Password is required'}
                    onChange={handleInputChange}
                    $accentColor={colors.primary}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setToggle(!toggle)} edge="end" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {toggle ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <OptionsRow>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: 'rgba(255,255,255,0.3)',
                            '&.Mui-checked': { color: colors.primary }
                          }}
                        />
                      }
                      label={<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Remember me</span>}
                    />
                    <ForgotLink href="#">Forgot password?</ForgotLink>
                  </OptionsRow>

                  <PrimaryButton
                    type="submit"
                    fullWidth
                    disabled={loader}
                    $gradient={`linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`}
                  >
                    {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Sign In"}
                  </PrimaryButton>

                  <GuestButton
                    fullWidth
                    onClick={guestModeHandler}
                    disabled={guestLoader}
                  >
                    {guestLoader ? <CircularProgress size={24} sx={{ color: colors.primary }} /> : "Continue as Guest"}
                  </GuestButton>

                  {role === "Admin" && (
                    <SignUpRow>
                      <span>Don't have an account?</span>
                      <SignUpLink to="/Adminregister">Sign up</SignUpLink>
                    </SignUpRow>
                  )}
                </Form>
              </FormCard>
            </FormSection>
          </Grid>

          {/* Decorative Section */}
          <Grid item xs={false} md={6}>
            <DecoSection $gradient={`linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`}>
              <DecoContent>
                <DecoIcon>
                  {role === 'Admin' && '🛡️'}
                  {role === 'Student' && '📚'}
                  {role === 'Teacher' && '👨‍🏫'}
                </DecoIcon>
                <DecoTitle>{role} Portal</DecoTitle>
                <DecoText>
                  {role === 'Admin' && 'Manage your institution with powerful administrative tools and analytics.'}
                  {role === 'Student' && 'Access your courses, assignments, and track your academic journey.'}
                  {role === 'Teacher' && 'Create engaging content and monitor your students\' progress.'}
                </DecoText>
                <FeatureList>
                  <FeatureItem>✓ Secure Authentication</FeatureItem>
                  <FeatureItem>✓ Real-time Updates</FeatureItem>
                  <FeatureItem>✓ Modern Dashboard</FeatureItem>
                </FeatureList>
              </DecoContent>
              <FloatingShapes>
                <Shape className="shape-1" />
                <Shape className="shape-2" />
                <Shape className="shape-3" />
              </FloatingShapes>
            </DecoSection>
          </Grid>
        </Grid>
      </ContentWrapper>

      <StyledBackdrop open={guestLoader}>
        <LoaderContent>
          <CircularProgress size={48} sx={{ color: colors.primary }} />
          <LoaderText>Setting up guest mode...</LoaderText>
        </LoaderContent>
      </StyledBackdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default LoginPage;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0f0f23;
  position: relative;
  overflow: hidden;
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at center, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const BackgroundOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: ${pulse} 8s ease-in-out infinite;
  pointer-events: none;
  
  &.orb-1 {
    width: 500px;
    height: 500px;
    background: ${props => props.$color};
    top: -200px;
    right: 20%;
    opacity: 0.3;
  }
  
  &.orb-2 {
    width: 400px;
    height: 400px;
    background: ${props => props.$color};
    bottom: -150px;
    left: 10%;
    opacity: 0.25;
    animation-delay: 3s;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
`;

const FormSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 0.6s ease forwards;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RoleBadge = styled.div`
  display: inline-block;
  padding: 10px 28px;
  background: ${props => props.$gradient};
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
`;

const WelcomeText = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

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
        border-color: ${props => props.$accentColor || '#6366f1'};
        border-width: 2px;
      }
    }
    
    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.5);
      
      &.Mui-focused {
        color: ${props => props.$accentColor || '#6366f1'};
      }
    }
    
    .MuiFormHelperText-root {
      color: #ef4444;
    }
    
    input, textarea {
      color: white;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 100px #1a1a2e inset;
        -webkit-text-fill-color: white;
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
        opacity: 1;
      }
    }
  }
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ForgotLink = styled.a`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #8b5cf6;
  }
`;

const PrimaryButton = styled(Button)`
  && {
    padding: 14px;
    background: ${props => props.$gradient};
    color: white;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
    }
    
    &:disabled {
      background: rgba(99, 102, 241, 0.5);
    }
  }
`;

const GuestButton = styled(Button)`
  && {
    padding: 14px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    font-size: 1rem;
    text-transform: none;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const SignUpRow = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  
  span {
    margin-right: 0.5rem;
  }
`;

const SignUpLink = styled(Link)`
  color: #8b5cf6;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    color: #a78bfa;
  }
`;

const DecoSection = styled.div`
  min-height: 100vh;
  background: ${props => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const DecoContent = styled.div`
  text-align: center;
  color: white;
  z-index: 10;
  padding: 2rem;
  max-width: 400px;
`;

const DecoIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const DecoTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const DecoText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
  display: inline-block;
`;

const FeatureItem = styled.li`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FloatingShapes = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Shape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  
  &.shape-1 {
    width: 200px;
    height: 200px;
    top: 10%;
    right: 10%;
    animation-delay: 0s;
  }
  
  &.shape-2 {
    width: 150px;
    height: 150px;
    bottom: 20%;
    left: 5%;
    animation-delay: 2s;
  }
  
  &.shape-3 {
    width: 100px;
    height: 100px;
    top: 50%;
    right: 20%;
    animation-delay: 4s;
  }
`;

const StyledBackdrop = styled(Backdrop)`
  && {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(10px);
    z-index: 9999;
  }
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoaderText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
`;
