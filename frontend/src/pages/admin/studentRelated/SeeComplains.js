import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains, updateComplainStatus } from '../../../redux/complainRelated/complainHandle';
import styled, { keyframes } from 'styled-components';
import Popup from '../../../components/Popup';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('active');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllComplains(currentUser._id, "Complain"));
    }
  }, [currentUser?._id, dispatch]);

  if (error) {
    console.error('Error fetching complaints:', error);
  }

  const handleResolve = (complainId) => {
    dispatch(updateComplainStatus(complainId, { status: 'Resolved' }));
    setMessage("Complaint resolved successfully");
    setShowPopup(true);
  };

  const activeComplaints = Array.isArray(complainsList)
    ? complainsList.filter((c) => c.status !== 'Resolved')
    : [];
  const resolvedComplaints = Array.isArray(complainsList)
    ? complainsList.filter((c) => c.status === 'Resolved')
    : [];

  const currentList = activeTab === 'active' ? activeComplaints : resolvedComplaints;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toISOString().substring(0, 10) : "Invalid Date";
  };

  return (
    <PageWrapper>
      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <LoadingText>Loading complaints...</LoadingText>
        </LoadingWrapper>
      ) : response || !Array.isArray(complainsList) || complainsList.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>No Complaints</EmptyTitle>
          <EmptyText>There are no complaints at this time. All is well!</EmptyText>
        </EmptyState>
      ) : (
        <ContentWrapper>
          <PageHeader>
            <HeaderIcon>📝</HeaderIcon>
            <HeaderText>
              <PageTitle>Complaints Management</PageTitle>
              <PageSubtitle>
                {activeComplaints.length} active · {resolvedComplaints.length} resolved
              </PageSubtitle>
            </HeaderText>
          </PageHeader>

          <TabBar>
            <TabButton $active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
              Active
              {activeComplaints.length > 0 && <TabBadge>{activeComplaints.length}</TabBadge>}
            </TabButton>
            <TabButton $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
              History
              {resolvedComplaints.length > 0 && <TabBadge $resolved>{resolvedComplaints.length}</TabBadge>}
            </TabButton>
          </TabBar>

          {currentList.length === 0 ? (
            <EmptyTabState>
              <EmptyTabIcon>{activeTab === 'active' ? '✅' : '📋'}</EmptyTabIcon>
              <EmptyTabText>
                {activeTab === 'active'
                  ? 'No active complaints. Great job!'
                  : 'No resolved complaints yet.'}
              </EmptyTabText>
            </EmptyTabState>
          ) : (
            <CardsGrid>
              {currentList.map((complain) => (
                <ComplainCard key={complain._id}>
                  <CardHeader>
                    <UserInfo>
                      <UserAvatar>
                        {complain.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </UserAvatar>
                      <UserDetails>
                        <UserName>{complain.user?.name || 'Unknown User'}</UserName>
                        <UserType>{complain.userType === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}</UserType>
                      </UserDetails>
                    </UserInfo>
                    <DateBadge>{formatDate(complain.date)}</DateBadge>
                  </CardHeader>

                  <ComplaintText>{complain.complaint}</ComplaintText>

                  <CardFooter>
                    <StatusBadge $resolved={complain.status === 'Resolved'}>
                      {complain.status || 'Pending'}
                    </StatusBadge>
                    {complain.status !== 'Resolved' && (
                      <ResolveButton onClick={() => handleResolve(complain._id)}>
                        ✓ Resolve
                      </ResolveButton>
                    )}
                  </CardFooter>
                </ComplainCard>
              ))}
            </CardsGrid>
          )}
        </ContentWrapper>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default SeeComplains;

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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const PageWrapper = styled.div`
  animation: ${fadeInUp} 0.5s ease forwards;
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
  border: 4px solid rgba(239, 68, 68, 0.2);
  border-top-color: #ef4444;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const ContentWrapper = styled.div``;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const HeaderIcon = styled.span`
  font-size: 2.5rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(248, 113, 113, 0.15) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
`;

const HeaderText = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 4px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
    : 'transparent'};
  color: ${props => props.$active ? '#a5b4fc' : 'rgba(255, 255, 255, 0.5)'};
  border: 1px solid ${props => props.$active ? 'rgba(99, 102, 241, 0.3)' : 'transparent'};

  &:hover {
    background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const TabBadge = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.$resolved
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.$resolved ? '#34d399' : '#f87171'};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
`;

const ComplainCard = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: white;
`;

const UserDetails = styled.div``;

const UserName = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
  color: #ffffff;
`;

const UserType = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
`;

const DateBadge = styled.span`
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ComplaintText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$resolved
    ? 'rgba(16, 185, 129, 0.15)'
    : 'rgba(245, 158, 11, 0.15)'};
  color: ${props => props.$resolved ? '#34d399' : '#fbbf24'};
  border: 1px solid ${props => props.$resolved
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(245, 158, 11, 0.3)'};
`;

const ResolveButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
`;

const EmptyIcon = styled.span`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  max-width: 400px;
`;

const EmptyTabState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(30, 30, 60, 0.3);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
`;

const EmptyTabIcon = styled.span`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const EmptyTabText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;
