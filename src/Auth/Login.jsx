/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../ContextAPI/AuthContext';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login, users, fetchUserDetails } = useContext(AuthContext);
    const { fetchEnrollmentByUser } = useContext(EnrollmentContext);
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            await login(values);
            await fetchUserDetails();
            setLoading(false);
        } catch (error) {
            message.error('Invalid credentials');
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (users) {
            if (users.role === 'admin') {
                message.success('Login successful! Redirecting to admin dashboard...');
                navigate('/admin-dashboard');
            } else if (users.role === 'instructor') {
                message.success('Login successful! Redirecting to instructor dashboard...');
                navigate('/instructor-dashboard');
            } else if (users.role === 'student') {
                if (users.enrollStatus === 'enrolled') {
                    message.success('Login successful! Redirecting to student dashboard...');
                    navigate('/student-dashboard');
                } else {
                    message.success('Login successful! Please enroll in courses.');
                    navigate('/courses');
                }
            }
        }
    }, [users]);

    return (
        <div className="container">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-5 d-md-block">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/003/689/228/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
                            className="img-fluid rounded-start login-image"
                            alt="Login Image"
                        />
                    </div>
                    <div className="col-md-7 col-12">
                        <div className="card-body">
                            <h1 className="text-center pacifico-regular" style={{ color: 'gray' }}>
                                <i className="bi bi-person-fill"> Login</i>
                            </h1>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label playwrite-sk">
                                                <i className="bi bi-envelope-at"> Email</i>
                                            </label>
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control email-input"
                                                required
                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label playwrite-sk">
                                                <i className="bi bi-key"> Password</i>
                                            </label>
                                            <Field
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="form-control password-input"
                                                required
                                            />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                onClick={() => navigate('/forgot-password')}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-center gap-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary pacifico-regular"
                                                style={{ fontSize: '1.5rem' }}
                                                disabled={isSubmitting || loading}
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;