import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, TextField, IconButton, InputAdornment, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled, { keyframes } from 'styled-components';
import Popup from '../../components/Popup';

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [adminNameError, setAdminNameError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);
  const role = "Admin";

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.adminName.value;
    const schoolName = event.target.schoolName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!name || !schoolName || !email || !password) {
      if (!name) setAdminNameError(true);
      if (!schoolName) setSchoolNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    const fields = { name, email, password, role, schoolName };
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'adminName') setAdminNameError(false);
    if (name === 'schoolName') setSchoolNameError(false);
  };

  useEffect(() => {
    if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
      navigate('/Admin/dashboard');
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      console.log(error);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  return (
    <PageWrapper>
      {/* Background Elements */}
      <BackgroundOrb className="orb-1" />
      <BackgroundOrb className="orb-2" />
      <GridPattern />

      <ContentWrapper>
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <FormSection>
              <FormCard>
                <LogoSection>
                  <RoleBadge>🎓 Admin Registration</RoleBadge>
                </LogoSection>

                <WelcomeText>
                  <Title>Create Your School</Title>
                  <Subtitle>Register as an admin to manage your institution</Subtitle>
                </WelcomeText>

                <Form onSubmit={handleSubmit}>
                  <StyledTextField
                    fullWidth
                    id="adminName"
                    label="Your Name"
                    name="adminName"
                    autoComplete="name"
                    autoFocus
                    error={adminNameError}
                    helperText={adminNameError && 'Name is required'}
                    onChange={handleInputChange}
                  />
                  <StyledTextField
                    fullWidth
                    id="schoolName"
                    label="School Name"
                    name="schoolName"
                    autoComplete="off"
                    error={schoolNameError}
                    helperText={schoolNameError && 'School name is required'}
                    onChange={handleInputChange}
                  />
                  <StyledTextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={emailError}
                    helperText={emailError && 'Email is required'}
                    onChange={handleInputChange}
                  />
                  <StyledTextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={toggle ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    error={passwordError}
                    helperText={passwordError && 'Password is required'}
                    onChange={handleInputChange}
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

                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: 'rgba(255,255,255,0.3)',
                          '&.Mui-checked': { color: '#6366f1' }
                        }}
                      />
                    }
                    label={<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>I agree to the Terms & Conditions</span>}
                  />

                  <PrimaryButton type="submit" disabled={loader}>
                    {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Create Account"}
                  </PrimaryButton>

                  <SignUpRow>
                    <span>Already have an account?</span>
                    <SignUpLink to="/Adminlogin">Sign in</SignUpLink>
                  </SignUpRow>
                </Form>
              </FormCard>
            </FormSection>
          </Grid>

          {/* Decorative Section */}
          <Grid item xs={false} md={6}>
            <DecoSection>
              <DecoContent>
                <DecoIcon>🏫</DecoIcon>
                <DecoTitle>Start Managing Your School</DecoTitle>
                <DecoText>
                  Create a comprehensive management system for your institution.
                  Add students, teachers, and track academic progress all in one place.
                </DecoText>
                <FeatureList>
                  <FeatureItem>✓ Complete Student Management</FeatureItem>
                  <FeatureItem>✓ Teacher & Staff Portal</FeatureItem>
                  <FeatureItem>✓ Attendance Tracking</FeatureItem>
                  <FeatureItem>✓ Grade Management</FeatureItem>
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

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default AdminRegisterPage;

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
    background: #6366f1;
    top: -200px;
    right: 20%;
    opacity: 0.3;
  }
  
  &.orb-2 {
    width: 400px;
    height: 400px;
    background: #8b5cf6;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
`;

const WelcomeText = styled.div`
  text-align: center;
  margin-bottom: 2rem;
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

const PrimaryButton = styled.button`
  padding: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
