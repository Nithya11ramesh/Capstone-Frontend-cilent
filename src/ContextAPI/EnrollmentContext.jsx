/* eslint-disable react/prop-types */
import  { createContext, useState } from 'react';
import axios from 'axios';

export const EnrollmentContext = createContext();

export const EnrollmentProvider = ({ children }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [currentEnrollment, setCurrentEnrollment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch all enrollments
    const fetchEnrollments = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiEnrollments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data && Array.isArray(response.data.enrollments)) {
                setEnrollments(response.data.enrollments);
            } else {
                console.error('Expected array but received:', response.data);
                setEnrollments([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Enrollment Fetching Error:', err.response ? err.response.data : err.message);
            setError(err.message || 'Failed to fetch enrollments.');
            setLoading(false);
        }
    };
    // Fetch all enrollments for a specific course
    const fetchEnrollmentsByCourse = async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEnrollments(response.data || []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch enrollments by course.');
            setLoading(false);
        }
    };

    // get enrollments for the user
    const fetchEnrollmentByUser = async (userId) => {

        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEnrollments(response.data);
            fetchEnrollments();
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
            return [];
        }
    };


    // Fetch all enrollments By Id
    const fetchEnrollmentsById = async (enrollmentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${enrollmentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCurrentEnrollment(response.data || []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch enrollments by Id.');
            setLoading(false);
            console.error("Failed to fetch enrollments by Id:", err);
        }
    };

    // Create a new enrollment
    const createEnrollment = async (courseId, enrollmentData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${courseId}`, enrollmentData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setLoading(false);
            setMessage('Enrollment created successfully!');
            fetchEnrollments(); // Fetch updated enrollments after creating a new one
            setEnrollments(response.data); // Return created enrollment data if needed
            console.log("Enroll:", response.data);
        } catch (error) {
            setError(error.message || 'Error creating enrollment.');
            setLoading(false);
        }
    };

    // Update a specific enrollment by ID
    const updateEnrollment = async (enrollmentId, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${enrollmentId}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const updatedEnrollments = enrollments.map(enrollment =>
                enrollment._id === enrollmentId ? response.data : enrollment
            );
            setEnrollments(updatedEnrollments);
            setLoading(false);
            setMessage('Enrollment updated successfully!');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Enrollment not found. Please refresh and try again.');
            } else {
                setError(err.message || 'Failed to update enrollment.');
            }
            setLoading(false);
            console.error("Enroll Updating Error:", err);
        }
    };



    // Delete a specific enrollment by ID
    const deleteEnrollment = async (enrollmentId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiEnrollments/${enrollmentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updatedEnrollments = enrollments.filter(enrollment => enrollment._id !== enrollmentId);
            setEnrollments(updatedEnrollments);
            setLoading(false);
            setMessage('Enrollment deleted successfully!');
        } catch (err) {
            setError(err.message || 'Failed to delete enrollment.');
            setLoading(false);
            console.error("Error:", err);
        }
    };

    return (
        <EnrollmentContext.Provider value={{
            enrollments,
            currentEnrollment,
            fetchEnrollments,
            fetchEnrollmentByUser,
            fetchEnrollmentsById,
            fetchEnrollmentsByCourse,
            createEnrollment,
            updateEnrollment,
            deleteEnrollment,
            loading,
            error,
            message,
        }}>
            {children}
        </EnrollmentContext.Provider>
    );
};