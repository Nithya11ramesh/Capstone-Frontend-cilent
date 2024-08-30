/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../ContextAPI/CourseContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const CreateCourseForm = () => {
    const { createCourse, fetchCourses } = useContext(CourseContext);
    const { users, fetchInstructors, instructors: fetchedInstructors } = useContext(AuthContext);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const navigate = useNavigate();

    const initialValues = {
        title: '',
        description: '',
        instructor: '',
        price: '',
        duration: '',
        category: ''
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Course title is required'),
        description: Yup.string().required('Course description is required'),
        instructor: Yup.string().required('Please select an instructor'),
        price: Yup.number().required('Price is required').positive('Price must be a positive number'),
        duration: Yup.string().required('Duration is required'),
        category: Yup.string().required('Category is required'),
    });

    useEffect(() => {
        const getInstructors = async () => {
            try {
                await fetchInstructors();
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        getInstructors();
    }, []);

    useEffect(() => {
        if (fetchedInstructors) {
            setInstructors(fetchedInstructors);
        }
    }, []);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await createCourse(values, mediaFiles);
            resetForm(initialValues);
            message.success("Course Created Successfully..!")
            setMediaFiles([]);
            navigate(-1)
            fetchCourses();
        } catch (error) {
            console.error('Error creating course:', error);
            message.error("Course Creation Failed.")
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    return (
        <div className="container-fluid">
            <div className="container">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-6 d-md-block">
                            <img
                                src="https://pressbooks.bccampus.ca/writingplace/wp-content/uploads/sites/1608/2022/03/20943483-scaled.jpg"
                                className="img-fluid rounded-start login-image"
                                alt="..."
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="card-body">
                                <h1 className="text-center pacifico-regular" style={{ color: 'gray' }}>
                                    <i className="bi bi-person-fill"> Create New Course</i>
                                </h1>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Course Title</label>
                                                <Field type="text" className="form-control" name="title" />
                                                <ErrorMessage name="title" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Course Description</label>
                                                <Field type="text" className="form-control" name="description" />
                                                <ErrorMessage name="description" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Select Instructor</label>
                                                <Field as="select" className="form-control" name="instructor">
                                                    <option value="">Select an instructor</option>
                                                    {instructors.map((instructor) => (
                                                        <option key={instructor._id} value={instructor._id}>
                                                            {`${instructor.firstName} ${instructor.lastName}`}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="instructor" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Price</label>
                                                <Field type="number" className="form-control" name="price" />
                                                <ErrorMessage name="price" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Duration</label>
                                                <Field type="text" className="form-control" name="duration" />
                                                <ErrorMessage name="duration" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Category</label>
                                                <Field type="text" className="form-control" name="category" />
                                                <ErrorMessage name="category" component="div" className="text-danger" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label playwrite-sk">Upload Files</label>
                                                <Field type="file" className="form-control" name="files" onChange={handleFileChange} multiple />
                                            </div>

                                            <button type="submit" className="btn btn-primary mt-2 me-4 asap-bold" disabled={isSubmitting}>
                                                {isSubmitting ? 'Creating Course...' : 'Create Course'}
                                            </button>
                                            <button className="btn btn-secondary mt-2 asap-bold" onClick={() => navigate('/all-courses')}>
                                                Back
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

export default CreateCourseForm;