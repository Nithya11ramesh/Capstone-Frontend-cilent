
import { useContext, useState, useEffect } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { QuizContext } from '../ContextAPI/QuizContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Container, Col } from 'react-bootstrap';
import { message } from 'antd';

const EditQuizForm = () => {
  const { fetchQuizById, updateQuiz } = useContext(QuizContext);
  const { quizId, courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    questions: [{
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]
  });

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchQuizById(quizId);
        setInitialValues(response);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        message.error('Error fetching quiz data');
      }
    };

    fetchQuizData();
  }, [quizId, fetchQuizById]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      questions: Yup.array().of(
        Yup.object().shape({
          questionText: Yup.string().required('Question text is required'),
          options: Yup.array()
            .of(Yup.string().required('Option is required'))
            .min(4, 'At least 4 options are required'),
          correctAnswer: Yup.number().required('Correct answer is required')
        })
      )
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateQuiz(quizId, values);
        message.success('Quiz updated successfully');
        navigate(`/quizzes/${courseId}`);
      } catch (error) {
        message.error('Failed to update quiz');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container>
      <div className="card mb-3" style={{ width: '1200px' }}>
        <div className="row g-0">
          <Col md={6}>
            <img
              src="https://clipart-library.com/2023/232-2328186_image-free-printable-and-other-fun-quizzes-clickable.png"
              className="img-fluid rounded-start"
              alt="Quiz illustration"
            />
          </Col>
          <Col md={6}>
            <div className="card-body">
              <h1 className="text-center pacifico-regular" style={{ color: 'gray' }}>
                <i className="bi bi-pen-fill">Edit Quiz</i>
              </h1>

              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.title && formik.errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <FieldArray name="questions">
                    {({ push, remove }) => (
                      <>
                        {formik.values.questions.map((question, index) => (
                          <div key={index} className="mt-3">
                            <h5>Question {index + 1}</h5>
                            <Form.Group controlId={`questions[${index}].questionText`}>
                              <Form.Label>Question Text</Form.Label>
                              <Form.Control
                                type="text"
                                name={`questions[${index}].questionText`}
                                value={formik.values.questions[index].questionText}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.questions?.[index]?.questionText && formik.errors.questions?.[index]?.questionText}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.questions?.[index]?.questionText}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <FieldArray name={`questions[${index}].options`}>
                              {({ push: pushOption, remove: removeOption }) => (
                                <div>
                                  {formik.values.questions[index].options.map((option, optionIndex) => (
                                    <Form.Group key={optionIndex} controlId={`questions[${index}].options[${optionIndex}]`}>
                                      <Form.Label>Option {optionIndex + 1}</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name={`questions[${index}].options[${optionIndex}]`}
                                        value={formik.values.questions[index].options[optionIndex]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.questions?.[index]?.options?.[optionIndex] && formik.errors.questions?.[index]?.options?.[optionIndex]}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {formik.errors.questions?.[index]?.options?.[optionIndex]}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  ))}
                                  <Button
                                    variant="outline-primary"
                                    onClick={() => pushOption('')}
                                    className="mt-2"
                                  >
                                    Add Option
                                  </Button>
                                  {formik.values.questions[index].options.length > 4 && (
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => removeOption(formik.values.questions[index].options.length - 1)}
                                      className="mt-2 ms-2"
                                    >
                                      Remove Option
                                    </Button>
                                  )}
                                </div>
                              )}
                            </FieldArray>

                            <Form.Group controlId={`questions[${index}].correctAnswer`}>
                              <Form.Label>Correct Answer</Form.Label>
                              <Form.Control
                                as="select"
                                name={`questions[${index}].correctAnswer`}
                                value={formik.values.questions[index].correctAnswer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.questions?.[index]?.correctAnswer && formik.errors.questions?.[index]?.correctAnswer}
                                custom
                              >
                                {formik.values.questions[index].options.map((_, optionIndex) => (
                                  <option key={optionIndex} value={optionIndex}>
                                    {`Option ${optionIndex + 1}`}
                                  </option>
                                ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.questions?.[index]?.correctAnswer}
                              </Form.Control.Feedback>
                            </Form.Group>

                            {formik.values.questions.length > 1 && (
                              <Button
                                variant="outline-danger"
                                onClick={() => remove(index)}
                                className="mt-2"
                              >
                                Remove Question
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline-primary"
                          onClick={() => push({
                            questionText: '',
                            options: ['', '', '', ''],
                            correctAnswer: 0
                          })}
                          className="mt-3 me-3"
                        >
                          Add Question
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="mt-3"
                  >
                    {loading ? 'Updating...' : 'Update Quiz'}
                  </Button>
                </Form>
              </FormikProvider>
            </div>
          </Col>
        </div>
      </div>
    </Container>
  );
};

export default EditQuizForm;
