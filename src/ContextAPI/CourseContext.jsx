import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; 
import axios from 'axios';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const API_URL = 'https://server-o2fj.onrender.com/apiCourses';

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCourses(response.data);
        } catch (err) {
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', err.response);
                setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred.'}`);
            } else if (err.request) {
                // No response received from the server
                console.error('Error request:', err.request);
                setError('No response from server. Please check your network connection.');
            } else {
                // Other errors
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseById = async (courseId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCurrentCourse(response.data);
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response);
                setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred.'}`);
            } else if (err.request) {
                console.error('Error request:', err.request);
                setError('No response from server. Please check your network connection.');
            } else {
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async (courseData, mediaFiles) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(courseData).forEach((key) => {
                formData.append(key, courseData[key]);
            });
            if (mediaFiles) {
                for (let file of mediaFiles) {
                    formData.append('media', file);
                }
            }
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setCourses((prevCourses) => [...prevCourses, response.data.course]);
            setMessage('Course Created Successfully!');
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response);
                setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred.'}`);
            } else if (err.request) {
                console.error('Error request:', err.request);
                setError('No response from server. Please check your network connection.');
            } else {
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateCourse = async (courseId, updatedData, mediaFiles = []) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(updatedData).forEach((key) => {
                formData.append(key, updatedData[key]);
            });
            if (mediaFiles) {
                for (let file of mediaFiles) {
                    formData.append('media', file);
                }
            }
            const response = await axios.put(`${API_URL}/${courseId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            const updatedCourses = courses.map(course => course._id === courseId ? response.data : course);
            setCourses(updatedCourses);
            setMessage('Course Updated Successfully!');
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response);
                setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred.'}`);
            } else if (err.request) {
                console.error('Error request:', err.request);
                setError('No response from server. Please check your network connection.');
            } else {
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (courseId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
            setMessage('Course Deleted Successfully!');
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response);
                setError(`Error ${err.response.status}: ${err.response.data.message || 'An error occurred.'}`);
            } else if (err.request) {
                console.error('Error request:', err.request);
                setError('No response from server. Please check your network connection.');
            } else {
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

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

CourseProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
