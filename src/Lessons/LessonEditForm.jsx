/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Card, Button, TextField, Box, Grid, Typography } from '@mui/material';
import { message } from 'antd';
import { LessonContext } from '../ContextAPI/LessonContext';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledForm = styled(Form)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
});

const StyledTextarea = styled('textarea')({
  width: '100%',
  padding: '8px',
  marginTop: '8px',
  borderColor: '#c4c4c4',
  borderRadius: '4px',
  borderWidth: '1px',
  resize: 'vertical',
});

const StyledButton = styled(Button)({
  marginTop: '16px',
});

const LessonEditForm = ({ onClose }) => {
  const { lessonId } = useParams();
  const { fetchLessonById, updateLesson } = useContext(LessonContext);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    session: '',
    description: '',
    url: '',
  });

  useEffect(() => {
    const getLessonData = async () => {
      const lesson = await fetchLessonById(lessonId);
      if (lesson) {
        setInitialValues({
          session: lesson.session,
          description: lesson.description,
          url: lesson.url,
        });
      }
    };

    getLessonData();
  }, []);

  const validationSchema = Yup.object({
    session: Yup.string().required('Session is required'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values) => {
    try {
      await updateLesson(lessonId, values);
      message.success('Lesson updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error updating lesson:', error);
      message.error('Failed to update lesson.');
    }
  };

  return (
    <Container sx={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ display: 'flex', width: '100%', maxWidth: '1200px' }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/girl-watching-video-lesson-2739596-2283972.png"
              alt="Lesson"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ padding: '16px' }}>
            <Typography variant="h4" component="h2" align="center" style={{ marginBottom: '20px' }}>
              Update Lesson
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <StyledForm>
                  <Field
                    name="session"
                    as={StyledTextField}
                    label="Session"
                    fullWidth
                    variant="outlined"
                    error={touched.session && Boolean(errors.session)}
                    helperText={touched.session && errors.session}
                  />
                  <Field
                    name="description"
                    as={StyledTextarea}
                    label="Description"
                    minRows={3}
                    placeholder="Enter description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  {touched.description && errors.description && (
                    <div style={{ color: 'red', marginBottom: '8px' }}>{errors.description}</div>
                  )}
                  <Field
                    name="url"
                    as={StyledTextField}
                    label="Video URL"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Enter YouTube video URL"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.url}
                    error={touched.url && Boolean(errors.url)}
                    helperText={touched.url && errors.url}
                  />
                  <Box display="flex" justifyContent="flex-start" gap="16px">
                    <StyledButton type="submit" variant="contained" color="primary">
                      Update Lesson
                    </StyledButton>
                    <StyledButton
                      onClick={onClose || (() => navigate(-1))}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </StyledButton>
                  </Box>
                </StyledForm>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default LessonEditForm;