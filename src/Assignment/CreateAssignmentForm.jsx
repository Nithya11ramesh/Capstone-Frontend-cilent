/* eslint-disable react-hooks/exhaustive-deps */
import  { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AssignmentContext } from '../ContextAPI/AssignmentContext';
import { CourseContext } from '../ContextAPI/CourseContext';
import { message } from 'antd';

const CreateAssignmentForm = () => {
    const { addAssignment, fetchAssignmentsByCourseId } = useContext(AssignmentContext);
    const { fetchCourseById, currentCourse } = useContext(CourseContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (courseId) {
            fetchCourseById(courseId);
            fetchAssignmentsByCourseId(courseId);
        }
    }, []);

    useEffect(() => {
        if (courseId) {
            fetchAssignmentsByCourseId(courseId);
        }
    }, []);

    const initialValues = {
        title: '',
        description: '',
        dueDate: '',
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string(),
        dueDate: Yup.date().required("Due date is required"),
    });

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!courseId) {
            message.error("Course ID is undefined.");
            setSubmitting(false);
            return;
        }

        try {
            const assignmentData = {
                title: values.title,
                description: values.description,
                dueDate: values.dueDate,
                course: courseId,
            };

            await addAssignment(courseId, assignmentData);
            resetForm();
            fetchAssignmentsByCourseId(courseId);
            navigate(`/assignments/${courseId}`);
            message.success('Assignment created successfully');
        } catch (error) {
            console.error('Error creating assignment:', error);
            message.error('Failed to create assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentCourse) return <div>Loading course details...</div>;

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-6 d-md-block">
                            <img
                                src="https://cdni.iconscout.com/illustration/premium/thumb/online-assignment-5393172-4510999.png"
                                className="img-fluid rounded-start login-image"
                                alt="..."
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="card-body">
                                <h1 className="text-center pacifico-regular" style={{ color: 'gray' }}>
                                {currentCourse.title} <i className="bi bi-pen-fill"></i>
                                </h1>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ isSubmitting, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Assignment Title</label>
                                                <Field type="text" name="title" className="form-control mb-3" />
                                                <ErrorMessage name="title" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Assignment Description</label>
                                                <Field type="text" className="form-control" name="description" />
                                                <ErrorMessage name="description" component="div" className="text-danger" />
                                            </div>
                                            <div className="mb-3">

                                            <label htmlFor="dueDate">Due Date</label>
                            <Field type="date" name="dueDate" className="form-control mb-3" />
                            <ErrorMessage name="dueDate" component="div" className="error" />
                                         

                                            </div>

                                           

                                           
                                            <button type="submit" className="btn btn-primary mt-2 me-4 asap-bold" disabled={isSubmitting}>
                                                {isSubmitting ? 'Adding Assignment...' : 'Add Assignment'}
                                            </button>
                                            <button type="button" className='btn btn-outline-dark' onClick={() => navigate(`/assignments/${courseId}`)}>
                                    Cancel
                                </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default CreateAssignmentForm;