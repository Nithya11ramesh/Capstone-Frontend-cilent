/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const resetMessages = () => {
        setError(null);
        setMessage(null);
    };

    const fetchCourses = async () => {
        resetMessages();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiCourses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCourses(response.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseById = async (courseId) => {
        resetMessages();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCurrentCourse(response.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async (courseData, mediaFiles) => {
        resetMessages();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(courseData).forEach((key) => {
                formData.append(key, courseData[key]);
            });
            if (mediaFiles && mediaFiles.length > 0) {
                mediaFiles.forEach(file => formData.append('media', file));
            }

            const response = await axios.post('https://capstone-backend-05tj.onrender.com/apiCourses', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setCourses((prevCourses) => [...prevCourses, response.data.course]);
            setMessage("Course Created Successfully!");
            fetchCourses();
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateCourse = async (courseId, updatedData, mediaFiles = []) => {
        resetMessages();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(updatedData).forEach((key) => {
                formData.append(key, updatedData[key]);
            });
            if (mediaFiles && mediaFiles.length > 0) {
                mediaFiles.forEach(file => formData.append('media', file));
            }

            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const updatedCourses = courses.map(course => course._id === courseId ? response.data : course);
            setCourses(updatedCourses);
            setMessage("Course Updated Successfully!");
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (courseId) => {
        resetMessages();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
        }

        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCourses(courses.filter(course => course._id !== courseId));
            setMessage("Course Deleted Successfully!");
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err) => {
        if (err.response) {
            // Server responded with a status other than 2xx
            setError(err.response.data.message || 'An error occurred.');
        } else if (err.request) {
            // Request was made but no response received
            setError('No response from the server.');
        } else {
            // Something else happened
            setError(err.message || 'An unexpected error occurred.');
        }
        console.error("Error:", err);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <CourseContext.Provider value={{
            courses,
            currentCourse,
            fetchCourses,
            fetchCourseById,
            createCourse,
            updateCourse,
            deleteCourse,
            loading,
            error,
            message
        }}>
            {children}
        </CourseContext.Provider>
    );
};
