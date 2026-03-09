import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    const profileFields = [
        { label: 'Full Name', value: currentUser.name, icon: '👤' },
        { label: 'Email Address', value: currentUser.email, icon: '📧' },
        { label: 'School Name', value: currentUser.schoolName, icon: '🏫' },
        { label: 'Role', value: 'Administrator', icon: '🎓' },
    ];

    return (
        <PageWrapper>
            <ProfileCard>
                <AvatarSection>
                    <Avatar>
                        {currentUser.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <RoleBadge>Admin</RoleBadge>
                </AvatarSection>

                <ProfileHeader>
                    <ProfileName>{currentUser.name}</ProfileName>
                    <ProfileSchool>{currentUser.schoolName}</ProfileSchool>
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

                <StatsGrid>
                    <StatItem>
                        <StatValue>Active</StatValue>
                        <StatLabel>Account Status</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue>Full Access</StatValue>
                        <StatLabel>Permission Level</StatLabel>
                    </StatItem>
                </StatsGrid>
            </ProfileCard>
        </PageWrapper>
    )
}

export default AdminProfile

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
  justify-content: center;
  padding: 20px;
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 600px;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.3);
  margin-bottom: 16px;
`;

const RoleBadge = styled.span`
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  color: #a5b4fc;
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

const ProfileSchool = styled.p`
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
  margin-bottom: 32px;
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
  background: rgba(99, 102, 241, 0.1);
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
`;

const StatValue = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #a5b4fc;
  margin-bottom: 4px;
`;

const StatLabel = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;