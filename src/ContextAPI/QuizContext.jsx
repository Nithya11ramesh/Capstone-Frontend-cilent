/* eslint-disable react/prop-types */
import  { createContext, useState } from 'react';
import axios from 'axios';
export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [totalQuizCount, setTotalQuizCount] = useState(0);
    const [totalQuizGrade, setTotalQuizGrade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [storeQuizScore, ] = useState({});
    const [quizSubmissions, setQuizSubmissions] = useState({});
    const [currentQuiz, setCurrentQuiz] = useState({});

    const fetchQuizzesByCourseId = async (courseId) => {
        setLoading(true);
        try {
            if (!courseId) {
                throw new Error('Course ID is not provided');
            }

            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiQuizzes/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setQuizzes(response.data.quizzes);
            setTotalQuizCount(response.data.count);
        } catch (error) {
            console.error('Error fetching quizzes:', error.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchQuizById = async (quizId) => {
        if (!quizId) {
            throw new Error('Quiz ID is required');
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiQuizzes/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Log the full response object and the specific quiz data for debugging
            // console.log('Full response:', response);
            // console.log('Fetched quiz data:', response.data.quiz);

            // Set quiz data and submissions

            setCurrentQuiz(response.data.quiz || {}); // Ensure it’s an object
            setQuizSubmissions(response.data.quiz.submissions || []); // Ensure it’s an array
            return response; // Ensure this returns the full response object

        } catch (error) {
            console.error('Error fetching quiz by ID:', error.response ? error.response.data : error.message);
            setCurrentQuiz(null); // Handle quiz state
            setQuizSubmissions([]); // Reset submissions

            if (error.response && error.response.status === 404) {
                console.error('Quiz not found:', quizId);
            }
        } finally {
            setLoading(false);
        }
    };



    const createQuiz = async (courseId, quizData) => {
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiQuizzes/${courseId}`, quizData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setQuizzes(prevQuizzes => [...prevQuizzes, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    };

    const updateQuiz = async (quizId, quizData) => {
        try {
            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiQuizzes/${quizId}`, quizData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setQuizzes((prevQuizzes) =>
                prevQuizzes.map((quiz) =>
                    quiz._id === quizId ? response.data : quiz
                )
            );
            return response.data;
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    };

    const deleteQuiz = async (quizId) => {
        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiQuizzes/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const updateQuizGrade = async (quizId, answers) => {
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiQuizzes/${quizId}/grade`, { answers }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const { score } = response.data;
            setTotalQuizGrade(score); // Update totalQuizGrade state with the calculated score
            return response.data;
        } catch (error) {
            console.error('Error updating quiz grade:', error);
            throw error;
        }
    };

    // Function to fetch total quiz grade
    const fetchTotalQuizGrade = async (courseId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiQuizzes/totalGrade/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Total Quiz Grade:", response.data.totalGrade);
            setTotalQuizGrade(response.data.totalGrade || 0);
        } catch (error) {
            console.error('Error fetching total quiz grade:', error);
            setTotalQuizGrade(0);
        } finally {
            setLoading(false);
        }
    };
    const deleteSubmission = async (submissionId) => {
        setLoading(true);
        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiQuizzes/submissions/${submissionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setQuizSubmissions(quizSubmissions.filter((submission) => submission._id !== submissionId));
        } catch (err) {
            console.error('Error deleting submission:', err);
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <QuizContext.Provider value={{
            quizzes,
            totalQuizCount,
            totalQuizGrade,
            loading,
            fetchQuizzesByCourseId,
            fetchQuizById,
            fetchTotalQuizGrade,
            currentQuiz,
            createQuiz,
            updateQuiz,
            deleteQuiz,
            updateQuizGrade,
            quizSubmissions,
            deleteSubmission,
            storeQuizScore,
        }}>
            {children}
        </QuizContext.Provider>
    );
};