/**
 * SeeNotice Component
 * 
 * A reusable component for displaying school notices and announcements.
 * Used in both the homepage dashboard and dedicated notices sections.
 * 
 * Key Features:
 * - Fetches notices based on user role (Admin uses their ID, others use school ID)
 * - Loading state with animated spinner
 * - Empty state when no notices exist
 * - Table display with title, details, and date columns
 * - Notice count badge in header
 * - Fade-in entrance animation
 * 
 * @component
 * @returns {JSX.Element} The rendered notices section
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import styled, { keyframes } from 'styled-components';
import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
  const dispatch = useDispatch();

  // Extract user data and notice list from Redux store
  const { currentUser, currentRole } = useSelector(state => state.user);
  const { noticesList, loading, error, response } = useSelector((state) => state.notice);

  /**
   * Fetch all notices on component mount
   * Admin fetches by their own ID, other roles fetch by school ID
   */
  useEffect(() => {
    if (currentUser) {
      if (currentRole === "Admin") {
        dispatch(getAllNotices(currentUser._id, "Notice"));
      } else {
        const schoolId = currentUser.school?._id || currentUser.school;
        if (schoolId) {
          dispatch(getAllNotices(schoolId, "Notice"));
        }
      }
    }
  }, [currentUser, currentRole, dispatch]);

  // Error logging for debugging
  if (error) {
    console.log(error);
  }

  // Table column configuration
  const noticeColumns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'details', label: 'Details', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  /**
   * Transform notice data into table row format
   * Formats dates to ISO string (YYYY-MM-DD)
   */
  const noticeRows = noticesList.map((notice) => {
    const date = new Date(notice.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      title: notice.title,
      details: notice.details,
      date: dateString,
      id: notice._id,
    };
  });

  return (
    <NoticeWrapper>
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading notices...</LoadingText>
        </LoadingState>
      ) : response ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>No Notices Yet</EmptyTitle>
          <EmptyText>When there are announcements, they'll appear here.</EmptyText>
        </EmptyState>
      ) : (
        <>
          <NoticeHeader>
            <HeaderLeft>
              <NoticeIcon>📢</NoticeIcon>
              <HeaderText>
                <NoticeTitle>Notices & Announcements</NoticeTitle>
                <NoticeSubtitle>Stay updated with the latest school announcements</NoticeSubtitle>
              </HeaderText>
            </HeaderLeft>
            <NoticeBadge>{noticesList.length} notices</NoticeBadge>
          </NoticeHeader>

          <TableContainer>
            {Array.isArray(noticesList) && noticesList.length > 0 &&
              <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
            }
          </TableContainer>
        </>
      )}
    </NoticeWrapper>
  );
};

export default SeeNotice;

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const NoticeWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease forwards;
`;

const NoticeHeader = styled.div`
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

const NoticeIcon = styled.span`
  font-size: 2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 14px;
`;

const HeaderText = styled.div``;

const NoticeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const NoticeSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const NoticeBadge = styled.span`
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #a5b4fc;
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
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
  max-width: 300px;
`;