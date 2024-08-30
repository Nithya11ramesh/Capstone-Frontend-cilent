/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children }) => {
    const [users, setUsers] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [instructors, setInstructors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
   const [message, setMessage] = useState();

    const getAllUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://server-o2fj.onrender.com/apiUsers/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && Array.isArray(response.data)) {
                setUsersDetails(response.data);
                //console.log("Users Details:", response.data); // Check data format
            } else {
                console.warn("Unexpected response format:", response.data); // Debug output
            }
        } catch (err) {
            console.error('User Fetching user:', err.response ? err.response.data : err.message);
            setError(err.message || 'Failed to fetch users.');
            setLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('https://server-o2fj.onrender.com/apiUsers/user/details', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                throw error;
            }
        } else {
            throw new Error('No token found');
        }
    };

    const updateUserDetails = async (updatedDetails) => {
        setLoading(true);
        try {
            const response = await axios.put('https://server-o2fj.onrender.com/apiUsers/user/update', updatedDetails, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error updating user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post('https://server-o2fj.onrender.com/apiUsers/login', credentials, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            localStorage.setItem('token', response.data.token);
            setUsers(response.data.user);
        } catch (error) {
            console.error('Login error:', error);
            setError('Error during login:', error.response ? error.response.data : error.message);
        }
    };

    const logout = () => {
        setUsers(null);
        localStorage.removeItem('token');
    };
    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('https://server-o2fj.onrender.com/apiUsers/forgot-password', { email }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response ? error.response.data.message : 'Error occurred' };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await axios.post(`https://server-o2fj.onrender.com/apiUsers/reset-password/${token}`, { password }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Error resetting password' };
        }
    };
    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchUserDetails();
        }
    }, []);

    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://server-o2fj.onrender.com/apiUsers/user/instructor', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setInstructors(response.data);
        } catch (error) {
            console.error("Error fetching Instructor details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                users,
                login,
                logout,
                forgotPassword,
                resetPassword,
                getAllUsers,
                usersDetails,
                fetchUserDetails,
                fetchInstructors,
                updateUserDetails,
                loading,
                error,
                instructors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};