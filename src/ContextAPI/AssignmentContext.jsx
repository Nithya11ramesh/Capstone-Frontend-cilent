/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import axios from 'axios';
// Create Context
export const AssignmentContext = createContext();

// AssignmentProvider Component
export const AssignmentProvider = ({ children }) => {
    const [assignments, setAssignments] = useState([]);
    const [assignmentCount, setAssignmentCount] = useState(0);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [currentSubmission, setCurrentSubmission] = useState(null);

    // Function to fetch assignments and submissions by courseId
    const fetchAssignmentsByCourseId = async (courseId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiAssignments/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAssignments(response.data.assignments || []);
            setAssignmentCount(response.data.assignments.length || 0);
            setSubmissions(response.data.submissions || []);
        } catch (error) {
            console.error('Error fetching assignments and submissions:', error);
            setAssignments([]);
            setAssignmentCount(0);
            setSubmissions([]);
            if (error.response && error.response.status === 404) {
                console.error('Assignments or submissions not found for the course:', courseId);
            }
        } finally {
            setLoading(false);
        }
    };

    const addAssignment = async (courseId, assignmentData) => {
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiAssignments/${courseId}`, assignmentData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setAssignments(prevAssignments => [...prevAssignments, response.data]);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            await axios.delete(`https://server-o2fj.onrender.com/apiAssignments/${assignmentId}`);
            setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment._id !== assignmentId), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const fetchAssignmentByAssignmentId = async (assignmentId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiAssignments/assignment/${assignmentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // console.log('Fetched assignment data:', response.data);

            setCurrentAssignment(response.data);
            setSubmissions(response.data.submissions || []);
            return response;
        } catch (error) {
            console.error('Error fetching assignment by ID:', error);
            setCurrentAssignment(null);
            setSubmissions([]);
            if (error.response && error.response.status === 404) {
                console.error('Assignment not found:', assignmentId);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateAssignment = async (assignmentId, updatedAssignment) => {
        try {
            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiAssignments/${assignmentId}`, updatedAssignment, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setAssignments(prevAssignments => prevAssignments.map(assignment =>
                assignment._id === assignmentId ? response.data : assignment
            ));
        } catch (error) {
            setError(error.message);
        }
    };

    const addSubmission = async (assignmentId, submissionUrl) => {
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiAssignments/submit/${assignmentId}`, { submissionUrl }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setSubmissions(prevSubmissions => [...prevSubmissions, response.data]);
        } catch (error) {
            console.error('Error adding submission:', error);
        }
    };

    const deleteSubmission = async (assignmentId, submissionId) => {
        // console.log('Deleting submission with ID:', submissionId, 'for assignment:', assignmentId);

        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiAssignments/submission/${assignmentId}/${submissionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSubmissions(prevSubmissions => prevSubmissions.filter(submission => submission._id !== submissionId));
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };


    const updateSubmission = async (submissionId, updatedSubmission) => {
        try {
            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiAssignments/submission/${submissionId}`, updatedSubmission, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setSubmissions(prevSubmissions => prevSubmissions.map(submission =>
                submission._id === submissionId ? response.data : submission
            ));
        } catch (error) {
            setError(error.message);
        }
    }

    const gradeSubmission = async (assignmentId, submissionId, grade, comments) => {
        try {
            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiAssignments/submission/${assignmentId}/${submissionId}/grade`, { grade, comments }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setAssignments(prevAssignments =>
                prevAssignments.map(assignment =>
                    assignment._id === assignmentId
                        ? {
                            ...assignment, submissions: assignment.submissions.map(sub =>
                                sub._id === submissionId
                                    ? { ...sub, grade, comments }
                                    : sub
                            )
                        }
                        : assignment
                )
            );
        } catch (err) {
            console.error('Error grading submission:', err);
        }
    };

    return (
        <AssignmentContext.Provider value={{
            assignments,
            assignmentCount,
            currentAssignment,
            loading,
            error,
            submissions,
            currentSubmission,
            fetchAssignmentsByCourseId,
            fetchAssignmentByAssignmentId,
            addAssignment,
            updateAssignment,
            deleteAssignment,
            addSubmission,
            updateSubmission,
            deleteSubmission,
            gradeSubmission,
        }}>
            {children}
        </AssignmentContext.Provider>
    );
};