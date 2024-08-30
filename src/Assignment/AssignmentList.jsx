/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { AssignmentContext } from '../ContextAPI/AssignmentContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box, Collapse, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import SubmissionForm from './SubmissionForm';

const AssignmentList = () => {
    const { fetchAssignmentsByCourseId, deleteAssignment, assignments, loading: assignmentLoading, fetchAssignmentByAssignmentId, addSubmission } = useContext(AssignmentContext);
    const { users } = useContext(AuthContext);
    const { courseId } = useParams();
    const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
    const [showSubmissionUrl, setShowSubmissionUrl] = useState(null);
    const navigate = useNavigate(); // useNavigate hook to navigate programmatically

    useEffect(() => {
        if (courseId) {
            const fetchData = async () => {
                try {
                    await fetchAssignmentsByCourseId(courseId);
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                }
            };
            fetchData();
        }
    }, [courseId, fetchAssignmentsByCourseId]);

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await deleteAssignment(assignmentId);
            message.success('Assignment deleted successfully!');
            await fetchAssignmentsByCourseId(courseId); // Refresh assignments
        } catch (error) {
            console.error('Error deleting assignment:', error);
            message.error('Failed to delete assignment.');
        }
    };

    const handleAddAssignment = () => {
        navigate(`/create-assignment/${courseId}`);
    };

    const handleViewSubmissionsList = async (assignmentId) => {
        try {
            await fetchAssignmentByAssignmentId(assignmentId);
            navigate(`/submissionList/${assignmentId}`);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            message.error('Failed to fetch submissions.');
        }
    };

    const handleSubmitSubmissionForm = async (assignmentId, formData) => {
        try {
            await addSubmission(assignmentId, formData);
            message.success('Submission added successfully!');
            await fetchAssignmentsByCourseId(courseId); // Refresh assignments
        } catch (error) {
            console.error('Error submitting assignment:', error);
            message.error('Failed to submit assignment.');
        }
    };

    const handleViewClick = (assignmentId) => {
        setShowSubmissionUrl(prevState => (prevState === assignmentId ? null : assignmentId));
    };

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="center"><strong>Due Date</strong></TableCell>
                            {users && users.role === 'student' && (
                                <>
                                    <TableCell align="center"><strong>Submitted Date</strong></TableCell>
                                    <TableCell align="center"><strong>Grade</strong></TableCell>
                                    <TableCell align="center"><strong>Comments</strong></TableCell>
                                    <TableCell align="center"><strong>Task</strong></TableCell>
                                </>
                            )}
                            {users && (users.role === 'admin' || users.role === 'instructor') && (
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignmentLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">Loading assignments...</TableCell>
                            </TableRow>
                        ) : assignments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No assignments available.</TableCell>
                            </TableRow>
                        ) : (
                            assignments.map((assignment) => {
                                const studentSubmission = assignment.submissions?.find(submission => submission.student === users.userId);

                                return (
                                    <React.Fragment key={assignment._id}>
                                        <TableRow>
                                            <TableCell component="th" scope="row">{assignment.title}</TableCell>
                                            <TableCell>{assignment.description}</TableCell>
                                            <TableCell align="center">{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                                            {users && users.role === 'student' && (
                                                <>
                                                    {studentSubmission ? (
                                                        <>
                                                            <TableCell align="center">
                                                                {studentSubmission.createdAt ? new Date(studentSubmission.createdAt).toLocaleDateString() : '-'}
                                                            </TableCell>
                                                            <TableCell align="center">{studentSubmission.grade || '-'}</TableCell>
                                                            <TableCell align="center">{studentSubmission.comments || '-'}</TableCell>
                                                            <TableCell align="center">
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => handleViewClick(assignment._id)}
                                                                >
                                                                    {showSubmissionUrl === assignment._id ? 'Hide URL' : 'View'}
                                                                </button>
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell align="center">-</TableCell>
                                                            <TableCell align="center">-</TableCell>
                                                            <TableCell align="center">-</TableCell>
                                                            <TableCell align="center">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => setExpandedAssignmentId(assignment._id)}
                                                                >
                                                                    Submit
                                                                </button>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {users && (users.role === 'admin' || users.role === 'instructor') && (
                                                <TableCell align="center">
                                                    <button className="btn btn-danger ms-2 me-2 mt-2" onClick={() => handleDeleteAssignment(assignment._id)}>Delete</button>
                                                    <button className="btn btn-dark ms-2 me-2 mt-2" onClick={() => handleViewSubmissionsList(assignment._id)}>View Submissions</button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={expandedAssignmentId === assignment._id || showSubmissionUrl === assignment._id} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            {studentSubmission ? 'Submission Details' : 'Submit Assignment'}
                                                        </Typography>
                                                        {studentSubmission ? (
                                                            <div>
                                                                {showSubmissionUrl === assignment._id && (
                                                                    <p>URL: <a href={studentSubmission.submissionUrl} target="_blank" rel="noopener noreferrer">{studentSubmission.submissionUrl}</a></p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <SubmissionForm assignmentId={assignment._id} onSubmit={(formData) => handleSubmitSubmissionForm(assignment._id, formData)} />
                                                        )}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AssignmentList;
