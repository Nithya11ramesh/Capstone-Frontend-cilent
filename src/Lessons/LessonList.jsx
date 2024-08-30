/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box, Collapse, Typography, Button, Paper } from '@mui/material';
import { LessonContext } from '../ContextAPI/LessonContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import CreateLesson from './CreateLesson';
import LessonEditForm from './LessonEditForm';

const LessonList = () => {
    const { courseId } = useParams();
    const { fetchLessonsByCourseId, deleteLesson, lessons, loading: lessonLoading, fetchCompletedStudents } = useContext(LessonContext);
    const { users } = useContext(AuthContext);
    const [completedStudents, setCompletedStudents] = useState([]);
    const [showCompletedStudents, setShowCompletedStudents] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchLessonsByCourseId(courseId);
            } catch (error) {
                console.error('Error fetching lessons:', error);
                message.error('Failed to fetch lessons.');
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteLesson = async (lessonId) => {
        try {
            await deleteLesson(lessonId);
            message.success('Lesson deleted successfully!');
            await fetchLessonsByCourseId(courseId); // Refresh lessons
        } catch (error) {
            console.error('Error deleting lesson:', error);
            message.error('Failed to delete lesson.');
        }
    };

    const handleEditLesson = (lessonId) => {
        navigate(`/edit-lesson/${lessonId}`)
        // setEditLesson(lesson);
    };

    const handleCreateLesson = () => {
        navigate(`/create-lesson/${courseId}`);
    };

    const handleStartLearning = (lessonId) => {
        navigate(`/lesson-detailed/${lessonId}`);
    };

    const handleViewCompletion = async (lessonId) => {
        try {
            const students = await fetchCompletedStudents(lessonId);
            setCompletedStudents(Array.isArray(students) ? students : []);
            setShowCompletedStudents(prevState => (prevState === lessonId ? null : lessonId));
        } catch (error) {
            console.error('Error fetching completed students:', error);
            message.error('Failed to fetch completed students.');
            setCompletedStudents([]); // Ensure completedStudents is always an array
        }
    };

    return (
        <Container>
            <TableContainer component={Paper}>
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <Typography variant="h4" component="h2" style={{ color: 'darkcyan' }}>
                            Lessons
                        </Typography>
                    </Col>
                    <Col md={3} className="text-end">
                        {users && (users.role === 'admin' || users.role === 'instructor') && (
                            <Button variant="contained" color="success" onClick={handleCreateLesson}>Create Lesson</Button>
                        )}
                    </Col>
                </Row>
                <Table aria-label="lessons table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Session</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessonLoading ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : lessons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">No Lessons Available</TableCell>
                            </TableRow>
                        ) : (
                            lessons.map((lesson) => (
                                <React.Fragment key={lesson._id}>
                                    <TableRow>
                                        <TableCell>{lesson.session}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" className='me-2 mt-2' color="primary" onClick={() => handleStartLearning(lesson._id)}>Start Learning</Button>
                                            {users && (users.role === 'admin' || users.role === 'instructor') && (
                                                <>
                                                    <Button variant="outlined" className='me-2 mt-2' color="warning" onClick={() => handleEditLesson(lesson._id)}>Edit</Button>
                                                    <Button variant="outlined" className='me-2 mt-2' color="error" onClick={() => handleDeleteLesson(lesson._id)}>Delete</Button>
                                                    <Button variant="outlined" className='me-2 mt-2' color="secondary" onClick={() => handleViewCompletion(lesson._id)}>
                                                        {showCompletedStudents === lesson._id ? 'Hide Completed Students' : 'View Completed Students'}
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Collapse in={showCompletedStudents === lesson._id} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Completed Students
                                                    </Typography>
                                                    {Array.isArray(completedStudents) && completedStudents.length > 0 ? (
                                                        <Card style={{ backgroundColor: 'lightblue', width: "100%" }}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Student Name</TableCell>
                                                                        <TableCell>Completion Date</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {completedStudents.map((student) => (
                                                                        <TableRow key={student._id}>
                                                                            <TableCell>{student.firstName} {student.lastName}</TableCell>
                                                                            <TableCell>{new Date(student.completedAt).toLocaleDateString()}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Card>
                                                    ) : (
                                                        <Card style={{ padding: '30px', backgroundColor: 'lightblue', width: "100%" }}>
                                                            <Typography>No students have completed this lesson yet.</Typography>
                                                        </Card>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* {editLesson && (
                <LessonEditForm lesson={editLesson} onClose={() => setEditLesson(null)} />
            )} */}
        </Container>
    );
};

export default LessonList;