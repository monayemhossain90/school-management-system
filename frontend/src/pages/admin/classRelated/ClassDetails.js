import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import styled, { keyframes } from 'styled-components';
import CountUp from 'react-countup';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <ActionButtons>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")} sx={{ color: '#ef4444' }}>
                    <DeleteIcon />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </ActionButtons>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <SectionWrapper>
                {response ? (
                    <EmptyState>
                        <EmptyIcon>📚</EmptyIcon>
                        <EmptyTitle>No Subjects Yet</EmptyTitle>
                        <EmptyText>Add subjects to this class to get started</EmptyText>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </EmptyState>
                ) : (
                    <>
                        <SectionHeader>
                            <HeaderIcon>📖</HeaderIcon>
                            <HeaderText>
                                <SectionTitle>Subjects List</SectionTitle>
                                <SectionSubtitle>{subjectsList?.length || 0} subjects enrolled</SectionSubtitle>
                            </HeaderText>
                        </SectionHeader>
                        <TableWrapper>
                            <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        </TableWrapper>
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                )}
            </SectionWrapper>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <ActionButtons>
                <IconButton onClick={() => deleteHandler(row.id, "Student")} sx={{ color: '#ef4444' }}>
                    <PersonRemoveIcon />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton>
            </ActionButtons>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <SectionWrapper>
                {getresponse ? (
                    <EmptyState>
                        <EmptyIcon>👨‍🎓</EmptyIcon>
                        <EmptyTitle>No Students Yet</EmptyTitle>
                        <EmptyText>Add students to this class to get started</EmptyText>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                        >
                            Add Students
                        </GreenButton>
                    </EmptyState>
                ) : (
                    <>
                        <SectionHeader>
                            <HeaderIcon>👥</HeaderIcon>
                            <HeaderText>
                                <SectionTitle>Students List</SectionTitle>
                                <SectionSubtitle>{sclassStudents?.length || 0} students enrolled</SectionSubtitle>
                            </HeaderText>
                        </SectionHeader>
                        <TableWrapper>
                            <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        </TableWrapper>
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </SectionWrapper>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <SectionWrapper>
                <EmptyState>
                    <EmptyIcon>👨‍🏫</EmptyIcon>
                    <EmptyTitle>Teachers Section</EmptyTitle>
                    <EmptyText>Teacher assignments will appear here</EmptyText>
                </EmptyState>
            </SectionWrapper>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        const stats = [
            {
                icon: '📚',
                title: 'Subjects',
                value: numberOfSubjects,
                gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                shadowColor: 'rgba(99, 102, 241, 0.3)',
            },
            {
                icon: '👨‍🎓',
                title: 'Students',
                value: numberOfStudents,
                gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                shadowColor: 'rgba(16, 185, 129, 0.3)',
            },
            {
                icon: '👨‍🏫',
                title: 'Teachers',
                value: 0,
                gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                shadowColor: 'rgba(245, 158, 11, 0.3)',
            },
        ];

        return (
            <DetailsWrapper>
                <ClassHeader>
                    <ClassIconWrapper>
                        <ClassIcon>🎓</ClassIcon>
                    </ClassIconWrapper>
                    <ClassInfo>
                        <ClassName>Class {sclassDetails && sclassDetails.sclassName}</ClassName>
                        <ClassMeta>Manage subjects, students, and teachers</ClassMeta>
                    </ClassInfo>
                </ClassHeader>

                <StatsGrid>
                    {stats.map((stat, index) => (
                        <StatCard key={stat.title} $delay={index * 0.1}>
                            <StatIconWrapper $gradient={stat.gradient} $shadow={stat.shadowColor}>
                                <span>{stat.icon}</span>
                            </StatIconWrapper>
                            <StatContent>
                                <StatValue>
                                    <CountUp start={0} end={stat.value} duration={2} />
                                </StatValue>
                                <StatLabel>{stat.title}</StatLabel>
                            </StatContent>
                        </StatCard>
                    ))}
                </StatsGrid>

                <QuickActions>
                    <QuickActionsTitle>Quick Actions</QuickActionsTitle>
                    <ActionsGrid>
                        {getresponse && (
                            <ActionCard onClick={() => navigate("/Admin/class/addstudents/" + classID)}>
                                <ActionIcon>➕</ActionIcon>
                                <ActionText>Add Students</ActionText>
                            </ActionCard>
                        )}
                        {response && (
                            <ActionCard onClick={() => navigate("/Admin/addsubject/" + classID)}>
                                <ActionIcon>📖</ActionIcon>
                                <ActionText>Add Subjects</ActionText>
                            </ActionCard>
                        )}
                    </ActionsGrid>
                </QuickActions>
            </DetailsWrapper>
        );
    }

    return (
        <PageWrapper>
            {loading ? (
                <LoadingWrapper>
                    <LoadingSpinner />
                    <LoadingText>Loading class details...</LoadingText>
                </LoadingWrapper>
            ) : (
                <ContentWrapper>
                    <StyledTabContext value={value}>
                        <TabHeader>
                            <StyledTabList onChange={handleChange}>
                                <StyledTab label="Details" value="1" />
                                <StyledTab label="Subjects" value="2" />
                                <StyledTab label="Students" value="3" />
                                <StyledTab label="Teachers" value="4" />
                            </StyledTabList>
                        </TabHeader>
                        <TabContent>
                            <TabPanel value="1">
                                <ClassDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <ClassSubjectsSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <ClassStudentsSection />
                            </TabPanel>
                            <TabPanel value="4">
                                <ClassTeachersSection />
                            </TabPanel>
                        </TabContent>
                    </StyledTabContext>
                </ContentWrapper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default ClassDetails;

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
  min-height: calc(100vh - 100px);
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

const ContentWrapper = styled.div`
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const StyledTabContext = styled(TabContext)``;

const TabHeader = styled.div`
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px 16px 0 0;
  margin-bottom: 0;
`;

const StyledTabList = styled(TabList)`
  && {
    .MuiTabs-indicator {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      height: 3px;
      border-radius: 3px;
    }
  }
`;

const StyledTab = styled(Tab)`
  && {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: none;
    padding: 16px 24px;
    transition: all 0.3s ease;
    
    &.Mui-selected {
      color: #ffffff;
    }
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

const TabContent = styled.div`
  background: rgba(30, 30, 60, 0.3);
  border-radius: 0 0 16px 16px;
  min-height: 400px;
  
  .MuiTabPanel-root {
    padding: 24px;
  }
`;

const SectionWrapper = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const HeaderIcon = styled.span`
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

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SectionSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
`;

const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  margin-bottom: 24px;
  max-width: 300px;
`;

const DetailsWrapper = styled.div``;

const ClassHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
`;

const ClassIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
`;

const ClassIcon = styled.span`
  font-size: 2.5rem;
`;

const ClassInfo = styled.div``;

const ClassName = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ClassMeta = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px ${props => props.$shadow};
  
  span {
    font-size: 1.5rem;
  }
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const QuickActions = styled.div`
  margin-top: 24px;
`;

const QuickActionsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
`;

const ActionsGrid = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ActionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.span`
  font-size: 1.25rem;
`;

const ActionText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;