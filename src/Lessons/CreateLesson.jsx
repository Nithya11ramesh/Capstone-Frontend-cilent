import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { Container, TextField, Button, Typography, Box, Card, Grid } from '@mui/material';
import { LessonContext } from '../ContextAPI/LessonContext';

const CreateLesson = () => {
    const { courseId } = useParams(); // Get courseId for creating a new lesson
    const { createLesson } = useContext(LessonContext);
    const [lesson, setLesson] = useState({
        session: '',
        description: '',
        url: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson(prevLesson => ({
            ...prevLesson,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createLesson(courseId, lesson);
            message.success('Lesson created successfully!');
            navigate(-1);
        } catch (error) {
            console.error('Error submitting lesson:', error);
            message.error('Failed to submit lesson.');
        }
    };

    return (
        <Container sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ padding: '24px', maxWidth: '1200px', margin: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src="https://image.freepik.com/free-vector/learning-study-online-concept-illustration_409025-126.jpg"
                            alt="Lesson Image"
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h2" gutterBottom align='center'>
                            Create Lesson
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Session"
                                    name="session"
                                    value={lesson.session}
                                    onChange={handleChange}
                                    placeholder="Enter session"
                                    required
                                />
                            </Box>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={lesson.description}
                                    onChange={handleChange}
                                    placeholder="Enter description"
                                    multiline
                                    minRows={3}
                                    required
                                />
                            </Box>

                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Video URL"
                                    name="url"
                                    value={lesson.url}
                                    onChange={handleChange}
                                    placeholder="Enter YouTube video URL"
                                />
                            </Box>

                            <Box display="flex" gap="16px" mt={2}>
                                <Button variant="contained" color="primary" type="submit">
                                    Create Lesson
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Button>
                            </Box>
                        </form>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};

export default CreateLesson;
