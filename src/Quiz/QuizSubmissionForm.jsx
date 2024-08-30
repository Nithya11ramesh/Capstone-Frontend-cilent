/* eslint-disable react-hooks/exhaustive-deps */
import  { useState, useEffect, useContext } from 'react';
import { QuizContext } from '../ContextAPI/QuizContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, RadioGroup, FormControlLabel, Radio, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { message } from 'antd';

const QuizSubmissionForm = () => {
    const { quizId } = useParams();
    const { fetchQuizById, updateQuizGrade } = useContext(QuizContext);
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                if (!quizId) throw new Error("Quiz ID is required");
                const fetchedQuiz = await fetchQuizById(quizId);
                if (fetchedQuiz && fetchedQuiz.data && fetchedQuiz.data.quiz) {
                    const quizData = fetchedQuiz.data.quiz;
                    if (quizData.questions && quizData.questions.length > 0) {
                        setQuiz(quizData);
                        setAnswers(Array(quizData.questions.length).fill(''));
                    } else {
                        console.error('Fetched quiz does not have questions:', quizData);
                        setQuiz(null);
                    }
                } else {
                    console.error('Fetched quiz data is incomplete:', fetchedQuiz);
                    setQuiz(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setLoading(false);
            }
        };
        loadQuiz();
    }, []);

    const handleAnswerChange = (e) => {
        const selectedOptionIndex = parseInt(e.target.value, 10);
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = selectedOptionIndex;
        setAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            let calculatedScore = 0;

            quiz.questions.forEach((question, index) => {
                if (answers[index] === question.correctAnswer) {
                    calculatedScore += 5; // Assuming 5 points per correct answer
                }
            });

            setScore(calculatedScore);

            // Show success message using Ant Design's message component
            message.success(`Quiz submitted! Your total score is ${calculatedScore}.`);

            const submissions = quiz.questions.map((question, index) => ({
                questionId: question._id,
                selectedOption: answers[index],
                score: calculatedScore,
            }));

            const result = await updateQuizGrade(quiz._id, submissions);
            console.log('Quiz submission result:', result); // Log the result to debug

            navigate('/student-dashboard');
        } catch (error) {
            console.error('Error updating quiz grade:', error);
            message.error('Failed to submit quiz. Please try again.');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return <Typography>Quiz not found or has no questions.</Typography>;
    }

    return (
        <Container className='container py-5'>
            <Card variant="outlined" style={{ color: 'white', backgroundColor: '#333' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {quiz.title}
                    </Typography>
                    <Typography variant="h6">
                        Question {currentQuestionIndex + 1}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {quiz.questions[currentQuestionIndex].questionText}
                    </Typography>
                    <RadioGroup
                        value={answers[currentQuestionIndex]}
                        onChange={handleAnswerChange}
                    >
                        {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio style={{ color: 'blue' }} />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                    <Grid container spacing={2} justifyContent="space-between" mt={2}>
                        <Grid item>
                            {currentQuestionIndex > 0 && (
                                <Button variant="outlined" onClick={handlePreviousQuestion}>
                                    Previous
                                </Button>
                            )}
                        </Grid>
                        <Grid item>
                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                <Button variant="contained" onClick={handleNextQuestion}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleSubmitQuiz}>
                                    Submit Quiz
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default QuizSubmissionForm;