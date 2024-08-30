import  { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LessonContext } from '../ContextAPI/LessonContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { Container, Card, CardBody } from 'react-bootstrap';
import { Button, Typography } from '@mui/material';
import { message } from 'antd';

const LessonDetailed = () => {
    const { lessonId } = useParams();
    const { fetchLessonById, markLessonAsCompleted, updateLesson } = useContext(LessonContext);
    const { users } = useContext(AuthContext);
    const [lesson, setLesson] = useState(null);
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedLesson = await fetchLessonById(lessonId);
                if (fetchedLesson) {
                    setLesson(fetchedLesson);
                    const isCompleted = fetchedLesson.completion.some(
                        (c) => c.completedStudents.includes(users?.userId) && c.completionStatus === 'completed'
                    );
                    setCompleted(isCompleted);
                } else {
                    message.error('Lesson not found.');
                }
            } catch (error) {
                console.error('Error fetching lesson details:', error);
                message.error('Failed to fetch lesson details.');
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMarkAsCompleted = async () => {
        try {
            // Mark the lesson as completed
            await markLessonAsCompleted(lessonId, users.userId, 'completed');
            setCompleted(true);

            // Update the course progress
            await updateLesson(lesson.courseId, users.userId);

            // Navigate back and show success message
            navigate(-1);
            message.success('Lesson marked as completed and course progress updated!');
        } catch (error) {
            console.error('Error marking lesson as completed and updating course progress:', error);
            message.error('Failed to mark lesson as completed and update course progress.');
        }
    };

    if (!lesson) return <div>Loading...</div>;

    return (
        <Container>
            <Card>
                <CardBody>
                    <Typography variant="h4">{lesson.session}</Typography>
                    <Typography variant="body1"><strong>Lesson Description: </strong>{lesson.description}</Typography>
                    <Typography variant="body1"><strong>Lesson Url: </strong><a href={lesson.url} target='_blank' rel="noopener noreferrer">Click Here</a></Typography>
                    {users && (users.role === 'student') && <Typography variant="body1"><strong>Lesson Completion Status: </strong>{completed ? 'completed' : 'pending'}</Typography>}

                    {users && (users.role === 'student') && <Button
                        variant="outlined"
                        color={completed ? 'success' : 'primary'}
                        onClick={handleMarkAsCompleted}
                        disabled={completed}
                    >
                        {completed ? 'Completed' : 'Mark as Completed'}
                    </Button>}
                    <Button onClick={(() => navigate(-1))} variant="outlined" color="secondary" style={{ marginTop: '16px', marginLeft: '8px' }}>
                        Back
                    </Button>
                </CardBody>
            </Card>
        </Container>
    );
};

export default LessonDetailed;