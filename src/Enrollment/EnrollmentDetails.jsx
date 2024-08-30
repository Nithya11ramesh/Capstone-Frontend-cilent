/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const EnrollmentDetails = ({ enrollment, onClose }) => {
    return (
        <div>
            <strong>User:</strong> {enrollment.user.firstName} {enrollment.user.lastName}<br />
            <strong>Qualification:</strong> {enrollment.qualification} <br />
            <strong>Pass Out Year:</strong> {enrollment.passOutYear} <br />
            <strong>Enrolled Date:</strong> {new Date(enrollment.enrolledAt).toLocaleDateString()} <br />
            <strong>Course:</strong> {enrollment.course.title} <br />
            <strong>Instructor:</strong> {enrollment.course.instructor.name} <br />
            <strong>Payment Status:</strong> {enrollment.paymentStatus} <br />
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default EnrollmentDetails;