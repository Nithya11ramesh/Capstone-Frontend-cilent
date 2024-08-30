/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import  { useContext, useEffect } from 'react';
import { LessonContext } from '../ContextAPI/LessonContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { useParams } from 'react-router-dom';
import { Container, Card, Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CourseProgress = () => {
    const { courseId } = useParams();
    const { users } = useContext(AuthContext); 
    const { lessons, fetchLessonsByCourseId } = useContext(LessonContext);

    useEffect(() => {
        fetchLessonsByCourseId(courseId);
    }, []);

    // Ensure user is available before proceeding
    if (!users) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    // Calculate the completion data for the logged-in user
    const data = {
        labels: lessons.map((lesson, index) => `Lesson ${index + 1}`), // X-axis labels
        datasets: [
            {
                label: 'Completion Percentage',
                data: lessons.map(lesson =>
                    lesson.completion.some(c => c.completedStudents.includes(users?.userId) && c.completionStatus === 'completed') ? 100 : 0
                ), // Y-axis data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Completion Percentage (%)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Lessons',
                },
            },
        },
    };

    return (
        <Container style={{ padding: '30px' }}>
           
            <Card >
            <Typography variant="h4" component="h2" className="text-center" style={{ color: 'darkcyan' }}>
            Course Progress
            </Typography>
            <Box>
                {/* <Typography variant="h5" gutterBottom>
                    Course Progress
                </Typography> */}
                <Bar data={data} options={options} />
            </Box>
            </Card>
        </Container>
    );
};

export default CourseProgress;