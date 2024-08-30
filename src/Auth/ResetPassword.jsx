/* eslint-disable no-unused-vars */
import  { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../ContextAPI/AuthContext'; // Ensure the path is correct
import { message as antMessage } from 'antd';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useContext(AuthContext);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialValues = {
    password: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const { password } = values;
    const result = await resetPassword(token, password);

    if (result.success) {
      antMessage.success('Password reset successful.');
      navigate('/login');
    } else {
      antMessage.error(result.message);
    }

    setSubmitting(false);
  };

  return (
    <div className='container' style={{ padding: '20px' }}>
      <div className='card' style={{
        maxWidth: '900px',
        margin: 'auto',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div className="row g-0">
          <div className="col-md-5 d-none d-md-block">
            <img
              src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7876.jpg"
              alt="Reset Password"
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          </div>
          <div className="col-md-7 col-12">
            <div style={{ padding: '20px' }}>
              <h1 style={{ textAlign: 'center', fontFamily: "'Pacifico', cursive", color: 'gray' }}>
                Reset Password
              </h1>
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
                      <Field
                        name="password"
                        type="password"
                        placeholder="New Password"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                      />
                      <ErrorMessage name="password" component="div" style={{ color: 'red', marginTop: '5px' }} />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Reset Password
                    </button>
                    {error && <div style={{ marginTop: '10px', color: 'red' }}>{error}</div>}
                    {successMessage && <div style={{ marginTop: '10px', color: 'green' }}>{successMessage}</div>}
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

export default ResetPassword;