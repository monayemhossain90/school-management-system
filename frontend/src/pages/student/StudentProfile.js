import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName;
  const studentSchool = currentUser.school;

  const profileFields = [
    { label: 'Full Name', value: currentUser.name, icon: '👤' },
    { label: 'Roll Number', value: currentUser.rollNum, icon: '🔢' },
    { label: 'Class', value: sclassName?.sclassName, icon: '🎓' },
    { label: 'School', value: studentSchool?.schoolName, icon: '🏫' },
  ];

  const personalInfo = [
    { label: 'Date of Birth', value: 'January 1, 2000' },
    { label: 'Gender', value: 'Male' },
    { label: 'Email', value: 'john.doe@example.com' },
    { label: 'Phone', value: '(123) 456-7890' },
    { label: 'Address', value: '123 Main Street, City, Country' },
    { label: 'Emergency Contact', value: '(987) 654-3210' },
  ];

  return (
    <PageWrapper>
      <ProfileCard>
        <AvatarSection>
          <Avatar>
            {String(currentUser.name).charAt(0).toUpperCase()}
          </Avatar>
          <RoleBadge>Student</RoleBadge>
        </AvatarSection>

        <ProfileHeader>
          <ProfileName>{currentUser.name}</ProfileName>
          <ProfileClass>Class {sclassName?.sclassName}</ProfileClass>
        </ProfileHeader>

        <Divider />

        <ProfileDetails>
          {profileFields.map((field, index) => (
            <DetailItem key={field.label} $delay={index * 0.1}>
              <DetailIcon>{field.icon}</DetailIcon>
              <DetailContent>
                <DetailLabel>{field.label}</DetailLabel>
                <DetailValue>{field.value}</DetailValue>
              </DetailContent>
            </DetailItem>
          ))}
        </ProfileDetails>
      </ProfileCard>

      {/* <InfoCard>
        <InfoCardHeader>
          <InfoCardIcon>📋</InfoCardIcon>
          <InfoCardTitle>Personal Information</InfoCardTitle>
        </InfoCardHeader>

        <InfoGrid>
          {personalInfo.map((info, index) => (
            <InfoItem key={info.label} $delay={index * 0.05}>
              <InfoLabel>{info.label}</InfoLabel>
              <InfoValue>{info.value}</InfoValue>
            </InfoItem>
          ))}
        </InfoGrid>
      </InfoCard> */}
    </PageWrapper>
  )
}

export default StudentProfile;

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

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const ProfileCard = styled.div`
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.3);
  margin-bottom: 16px;
`;

const RoleBadge = styled.span`
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  color: #34d399;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ProfileClass = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin-bottom: 24px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const DetailIcon = styled.span`
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const DetailValue = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
`;

const InfoCard = styled.div`
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
`;

const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const InfoCardIcon = styled.span`
  font-size: 1.5rem;
`;

const InfoCardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
`;

const InfoLabel = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const InfoValue = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
`;