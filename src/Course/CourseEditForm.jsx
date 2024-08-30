/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import  { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CourseContext } from '../ContextAPI/CourseContext';
import { AuthContext } from '../ContextAPI/AuthContext';
import { message } from 'antd';

const CourseEditForm = ({ show, handleClose, courseId }) => {
    const navigate = useNavigate();
    const { fetchCourseById, currentCourse, updateCourse } = useContext(CourseContext);
    const { fetchInstructors, instructors: fetchedInstructors } = useContext(AuthContext);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        if (show && courseId) {
            fetchCourseById(courseId);
        }
    }, [show, courseId]);

    useEffect(() => {
        const getInstructors = async () => {
            try {
                await fetchInstructors();
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        getInstructors(); // Fetch instructors on component mount
    }, []);

    useEffect(() => {
        if (fetchedInstructors) {
            setInstructors(fetchedInstructors);
        }
    }, [fetchedInstructors]);

    const initialValues = {
        title: currentCourse?.title || '',
        description: currentCourse?.description || '',
        instructor: currentCourse?.instructor ? currentCourse.instructor._id : '',
        price: currentCourse?.price || '',
        duration: currentCourse?.duration || '',
        category: currentCourse?.category || '',
        images: currentCourse?.images || '',

    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        instructor: Yup.string().required('Required'),
        price: Yup.number().required('Required').positive('Must be a positive number'),
        duration: Yup.string().required('Required'),
        category: Yup.string().required('Required'),

    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {

            await updateCourse(courseId, values, mediaFiles);
            message.success("Course Updated Successfully..!")
            setMediaFiles([]);
            navigate('/courses'); // Navigate only after successful update
        } catch (error) {
            console.error('Error updating course:', error);
            message.error("Course Updating Failed.")

        } finally {
            setSubmitting(false);
            handleClose(); // Close the modal after submission
        }
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none', maxHeight: '75vh', marginTop: '40px' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Course</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                            enableReinitialize
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
                                        <input type="file" className="form-control" name="mediaFiles" onChange={handleFileChange} multiple />
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-2 pacifico-regular" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating Course...' : 'Update Course'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseEditForm;