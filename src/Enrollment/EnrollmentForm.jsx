/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import  { useContext, useEffect } from 'react';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';
import { CourseContext } from '../ContextAPI/CourseContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EnrollmentForm = () => {
    const { createEnrollment, fetchEnrollments, loading, error } = useContext(EnrollmentContext);
    const { fetchCourseById, currentCourse } = useContext(CourseContext);
    const { users, fetchUserDetails, updateUserDetails } = useContext(AuthContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (courseId) {
            fetchCourseById(courseId);
        } else {
            console.error("Course ID is undefined in useEffect");
        }
    }, [courseId]);

    useEffect(() => {
        if (!users) {
            fetchUserDetails();
        }
    }, [users, fetchUserDetails]);

   

    const initialValues = {
        qualification: '',
        passOutYear: '',
    };

    const validationSchema = Yup.object().shape({
        qualification: Yup.string().required('Qualification is required'),
        passOutYear: Yup.number()
            .required('Pass Out Year is required')
            .integer('Pass Out Year must be a number')
            .min(2015, 'Pass Out Year must be at least 2015')
            .max(new Date().getFullYear(), `Pass Out Year cannot be more than current year (${new Date().getFullYear()})`),
    });

    const handleCancel = () => {
        navigate('/courses');
    };

    
    const handlePayLaterEnrollment = async (values, setSubmitting) => {
        if (!courseId) {
            message.error("Course ID is undefined.");
            setSubmitting(false);
            return;
        }

        const userId = users?.userId;

        if (!userId) {
            message.error("User ID is undefined. Please log in again.");
            setSubmitting(false);
            return;
        }

        try {
            const enrollmentData = {
                user: userId,
                course: courseId,
                qualification: values.qualification,
                passOutYear: values.passOutYear,
                paymentStatus: 'pending',
            };

            await createEnrollment(courseId, enrollmentData);
            updateUserDetails({ ...users, enrollStatus: 'enrolled' });
            fetchEnrollments();
            navigate('/student-dashboard');
            message.success('Enrollment Successful. Our Payment Support Team will reach out for the payment process.');
        } catch (error) {
            console.error('Enrollment Error:', error);
            if (error.response && error.response.data) {
                console.error('Server Response Data:', error.response.data);
            }
            message.error('Enrollment Failed.');
        } finally {
            setSubmitting(false);
        }
    };
    const handlePayNowEnrollment = async (values, setSubmitting) => {
        if (!courseId) {
            message.error("Course ID is undefined.");
            setSubmitting(false);
            return;
        }

        const userId = users?.userId;

        if (!userId) {
            message.error("User ID is undefined. Please log in again.");
            setSubmitting(false);
            return;
        }

        try {
            const enrollmentData = {
                user: userId,
                course: courseId,
                qualification: values.qualification,
                passOutYear: values.passOutYear,
                paymentStatus: 'pending', // Set initial payment status as 'pending'
            };

            await createEnrollment(courseId, enrollmentData);
            updateUserDetails({ ...users, enrollStatus: 'enrolled' });
            fetchEnrollments();

            navigate(`/payment/${enrollmentData._id}`, { state: { price: currentCourse.price } });
        } catch (error) {
            console.error('Enrollment Error:', error);
            if (error.response && error.response.data) {
                console.error('Server Response Data:', error.response.data);
            }
            message.error('Enrollment Failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentCourse || !users) return <div>Loading course details...</div>;

    return (
        <div className='container'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={() => { }} // Dummy submit handler to avoid errors
            >
                {({ isSubmitting, setFieldValue, values, setSubmitting }) => (
                    <Form>
                        <div className='card'>
                            <h2>Course: {currentCourse.title}</h2>
                            <p>Price: ${currentCourse.price}</p>
                            <p>Duration: {currentCourse.duration} month</p>
                            <label htmlFor="qualification">Qualification:</label>
                            <Field as="select" id="qualification" name="qualification" className='mb-3'>
                                <option value="">Select</option>
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Others">Others</option>
                            </Field>
                            <ErrorMessage name="qualification" component="div" className="error" />
                            <label htmlFor="passOutYear">Pass Out Year:</label>
                            <DatePicker
                                id="passOutYear"
                                name="passOutYear"
                                selected={values.passOutYear ? new Date(values.passOutYear, 0) : null}
                                onChange={date => setFieldValue('passOutYear', date ? date.getFullYear() : '')}
                                showYearPicker
                                dateFormat="yyyy"
                                minDate={new Date(2015, 0)}
                                maxDate={new Date()}
                                className="form-control mb-3"
                            />
                            <ErrorMessage name="passOutYear" component="div" className="error" />
                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    type="button"
                                    className='btn btn-success me-2'
                                    disabled={isSubmitting || loading}
                                    onClick={() => handlePayNowEnrollment(values, setSubmitting)}
                                >
                                    Pay Now
                                </button>
                                <button
                                    type="button"
                                    className='btn btn-warning me-2'
                                    disabled={isSubmitting || loading}
                                    onClick={() => handlePayLaterEnrollment(values, setSubmitting)}
                                >
                                    Pay Later
                                </button>
                                <button
                                    type="button"
                                    className='btn btn-outline-dark'
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default EnrollmentForm;