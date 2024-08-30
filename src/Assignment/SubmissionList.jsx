/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AssignmentContext } from '../ContextAPI/AssignmentContext';
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TextField,
    Button,
    Typography,
    Autocomplete
} from '@mui/material';
import { Container } from 'react-bootstrap';
import { message } from 'antd';

const predefinedScores = Array.from({ length: 11 }, (_, i) => i.toString());

const SubmissionList = () => {
    const { assignmentId } = useParams();
    const {
        currentAssignment,
        loading,
        fetchAssignmentByAssignmentId,
        deleteSubmission,
        gradeSubmission
    } = useContext(AssignmentContext);

    const [marks, setMarks] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAssignmentByAssignmentId(assignmentId);
            } catch (error) {
                console.error('Failed to fetch assignment:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (currentAssignment && currentAssignment.submissions) {
            const marksState = {};
            const commentsState = {};
            currentAssignment.submissions.forEach(submission => {
                marksState[submission._id] = submission.grade ? submission.grade.toString() : '';
                commentsState[submission._id] = submission.comments || '';
            });
            setMarks(marksState);
            setComments(commentsState);
        }
    }, []);

    const handleMarksChange = (submissionId, value) => {
        setMarks(prev => ({ ...prev, [submissionId]: value }));
    };

    const handleCommentsChange = (submissionId, value) => {
        setComments(prev => ({ ...prev, [submissionId]: value }));
    };

    const handleGradeSubmit = async (submissionId) => {
        const mark = marks[submissionId];
        const comment = comments[submissionId];

        if (!mark || mark.trim() === '' || !comment || comment.trim() === '') {
            message.error('Marks and comments are required');
            return;
        }

        try {
            const gradeData = { grade: parseInt(mark, 10), comments: comment };
            await gradeSubmission(currentAssignment._id, submissionId, gradeData.grade, gradeData.comments);
            await fetchAssignmentByAssignmentId(assignmentId);
        } catch (error) {
            console.error('Error grading submission:', error);
            message.error('Failed to grade submission.');
        }
    };

    const handleDelete = async (submissionId) => {
        try {
            await deleteSubmission(assignmentId, submissionId);
            message.success('Submission deleted successfully!');
            fetchAssignmentByAssignmentId(assignmentId);
        } catch (error) {
            console.error('Error deleting submission:', error);
            message.error('Failed to delete submission.');
        }
    };

    return (
        <Container>
            {loading ? (
                <p>Loading submissions...</p>
            ) : !currentAssignment || !currentAssignment.submissions || currentAssignment.submissions.length === 0 ? (
                <p>No submissions available.</p>
            ) : (
                <TableContainer component={Paper}>
                    <h2 className='text-center pacifico-regular mt-3 mb-3' style={{ color: 'darkcyan' }}>Assignment Submissions</h2>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell align="center"><strong>Submission URL</strong></TableCell>
                                <TableCell align="center"><strong>Submitted Date</strong></TableCell>
                                <TableCell align="center"><strong>Grade</strong></TableCell>
                                <TableCell align="center"><strong>Comments</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentAssignment.submissions.map((submission) => (
                                <TableRow key={submission._id}>
                                    <TableCell>{submission.student ? `${submission.student.firstName} ${submission.student.lastName}` : '-'}</TableCell>
                                    <TableCell align="center" style={{ maxWidth: '400px', wordWrap: 'break-word' }}>
                                        <Typography>
                                            <a href={submission.submissionUrl} target="_blank" rel="noopener noreferrer">
                                                {submission.submissionUrl}
                                            </a>
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Autocomplete
                                            freeSolo
                                            options={predefinedScores}
                                            value={marks[submission._id] || ''}
                                            onChange={(event, newValue) => handleMarksChange(submission._id, newValue)}
                                            getOptionLabel={(option) => option.toString()}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" size="small" fullWidth />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            value={comments[submission._id] || ''}
                                            onChange={(e) => handleCommentsChange(submission._id, e.target.value)}
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            className='me-2 mt-2'
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleGradeSubmit(submission._id)}
                                        >
                                            Grade
                                        </Button>
                                        <Button
                                            className='me-2 mt-2'
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(submission._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SubmissionList;