/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { QuizContext } from '../ContextAPI/QuizContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box, Paper } from '@mui/material';
import { message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';

const QuizList = () => {
    const { fetchQuizzesByCourseId, fetchQuizById, deleteQuiz, quizzes, loading } = useContext(QuizContext);
    const { users } = useContext(AuthContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (courseId) {
            fetchQuizzesByCourseId(courseId);
        }
    }, []);

    const handleTakeQuiz = async (quizId) => {
        try {
            await fetchQuizById(quizId);
            navigate(`/quiz-submission/${quizId}`);
        } catch (error) {
            console.error('Error fetching quiz by ID:', error);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteQuiz(quizId);
            message.success('Quiz deleted successfully!');
            fetchQuizzesByCourseId(courseId);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            message.error('Quiz failed to delete.');
        }
    };

    const handleAddQuiz = () => {
        navigate(`/create-quiz/${courseId}`);
    };

    const handleViewSubmissions = (quizId) => {
        navigate(`/quiz-submission-list/${quizId}`);
    };

    return (
        <Container>
            <TableContainer component={Paper}>
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <h2 className='pacifico-regular' style={{ color: 'darkcyan' }}>Quizzes</h2>
                    </Col>
                    <Col md={3} className="text-end">
                        {users?.role === 'admin' && (
                            <Button variant="contained" color="success" onClick={handleAddQuiz}>Add Quiz</Button>
                        )}
                    </Col>
                </Row>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Quiz</strong></TableCell>
                            <TableCell align="center"><strong>Questions</strong></TableCell>
                            {users?.role === 'student' && <TableCell align="center"><strong>Attend Date</strong></TableCell>}
                            {users?.role === 'student' && <TableCell align="center"><strong>Score</strong></TableCell>}
                            {(users?.role === 'admin' || users?.role === 'instructor') && <TableCell align="center"><strong>Actions</strong></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Loading quizzes...</TableCell>
                            </TableRow>
                        ) : quizzes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No quizzes available.</TableCell>
                            </TableRow>
                        ) : (
                            quizzes.map((quiz) => (
                                <React.Fragment key={quiz._id}>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {quiz.title}
                                        </TableCell>
                                        <TableCell align="center">{quiz.questions.length}</TableCell>

                                        {users?.role === 'student' && (
                                            <React.Fragment>
                                                {quiz.submissions?.find(submission => submission.student === users.userId) ? (
                                                    <React.Fragment>
                                                            <TableCell align="center">
                                                                {quiz.submissions?.find(submission => submission.student === users.userId)?.createdAt ? (
                                                                    new Date(quiz.submissions.find(submission => submission.student === users.userId).createdAt).toLocaleDateString()
                                                                ) : '-'}
                                                            </TableCell>
                                                        <TableCell align="center">
                                                            {quiz.submissions.find(submission => submission.student === users.userId).score}
                                                        </TableCell>
                                                    </React.Fragment>
                                                ) : (
                                                    <TableCell colSpan={2} align="center">
                                                        <Button variant="contained" color="primary" onClick={() => handleTakeQuiz(quiz._id)}>
                                                            Attend Quiz
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </React.Fragment>
                                        )}

                                        {(users?.role === 'admin' || users?.role === 'instructor') && (
                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center">
                                                    {/* Uncomment if Edit functionality is needed */}
                                                    {/* <Button variant="outlined" color="warning" className="me-3 mt-2" onClick={() => handleEditQuiz(quiz._id)}>Edit</Button> */}
                                                    <Button variant="outlined" color="error" className="me-3 mt-2" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</Button>
                                                    <Button variant="outlined" color="secondary" className="me-3 mt-2" onClick={() => handleViewSubmissions(quiz._id)}>View Submissions</Button>
                                                </Box>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default QuizList;