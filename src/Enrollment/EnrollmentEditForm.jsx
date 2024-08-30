/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import  { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';
import { message } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EnrollmentEditForm = ({ show, handleClose, enrollmentId }) => {
    const navigate = useNavigate();
    const { fetchEnrollmentsById, fetchEnrollments, currentEnrollment, updateEnrollment } = useContext(EnrollmentContext);
    const [initialValues, setInitialValues] = useState({
        qualification: '',
        passOutYear: new Date(),
        paymentStatus: 'pending',
    });

    // Fetch enrollment data on component mount or when enrollmentId changes
    useEffect(() => {
        const getEnrollmentData = async () => {
            if (enrollmentId) {
                await fetchEnrollmentsById(enrollmentId);
            }
        };
        getEnrollmentData();
    }, [enrollmentId]);

    // Set initial values when currentEnrollment changes
    useEffect(() => {
        if (currentEnrollment) {
            setInitialValues({
                qualification: currentEnrollment.qualification || '',
                passOutYear: currentEnrollment.passOutYear ? new Date(currentEnrollment.passOutYear, 0, 1) : new Date(),
                paymentStatus: currentEnrollment.paymentStatus || 'pending',
            });
        }
    }, []);

    const validationSchema = Yup.object({
        qualification: Yup.string().required('Qualification is required'),
        passOutYear: Yup.date()
            .required('Pass Out Year is required')
            .max(new Date(), 'Pass Out Year cannot be in the future'),
        paymentStatus: Yup.string().required('Payment Status is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            // Convert passOutYear to a suitable format
            const updatedData = {
                ...values,
                passOutYear: new Date(values.passOutYear).getFullYear(), // Convert to number before sending
            };
            await updateEnrollment(enrollmentId, updatedData);
            console.log("Updated Values:", updatedData);
            message.success("Enrollment Updated Successfully..!");
            fetchEnrollments();
            navigate('/enroll'); // Navigate only after successful update
        } catch (error) {
            console.error('Error updating enrollment:', error);
            message.error("Enrollment Updating Failed.");
        } finally {
            setSubmitting(false);
            handleClose(); // Close the modal after submission
        }
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none', maxHeight: '75vh', marginTop: '40px' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Enrollment</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <Form>
                                    <div className="mb-3">
                                        <label className="form-label">Qualification</label>
                                        <Field as="select" className="form-control" name="qualification">
                                            <option value="">Select Qualification</option>
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Others">Others</option>
                                        </Field>
                                        <ErrorMessage name="qualification" component="div" className="text-danger" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Pass Out Year</label>
                                        <DatePicker
                                            selected={values.passOutYear}
                                            onChange={(date) => setFieldValue('passOutYear', date)}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            className="form-control"
                                            maxDate={new Date()}
                                        />
                                        <ErrorMessage name="passOutYear" component="div" className="text-danger" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Payment Status</label>
                                        <Field as="select" className="form-control" name="paymentStatus">
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                        </Field>
                                        <ErrorMessage name="paymentStatus" component="div" className="text-danger" />
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating Enrollment...' : 'Update Enrollment'}
                                    </button>
                                    <button type="button" className="btn btn-secondary mt-2" onClick={handleClose}>
                                        Cancel
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

export default EnrollmentEditForm;