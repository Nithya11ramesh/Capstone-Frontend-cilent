/* eslint-disable no-unused-vars */
// ForgotPassword.jsx
import  { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../ContextAPI/AuthContext';
import { message as antMessage } from 'antd';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const response = await forgotPassword(values.email);
    if (response.success) {
      antMessage.success(response.message); // Ant Design message
    } else {
      antMessage.error(response.message); // Ant Design message
    }
    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-5 d-none d-md-block">
            <img
              src="https://static.vecteezy.com/system/resources/previews/016/462/187/original/forgot-the-password-illustration-concept-on-white-background-vector.jpg"
              className="img-fluid rounded-start login-image"
              alt="Forgot Password"
            />
          </div>
          <div className="col-md-7 col-12">
            <div className="card-body">
              <h1 className="text-center pacifico-regular" style={{ color: 'gray' }}>
                Forgot Password
              </h1>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="form-group">
                      <label htmlFor="email" className="playwrite-sk">Email</label>
                      <Field
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary mt-3 pacifico-regular"
                      style={{ fontSize: '1.5rem' }}
                    >
                      Send Reset Link
                    </button>

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

export default ForgotPassword;