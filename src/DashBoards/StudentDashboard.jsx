/* eslint-disable react-hooks/exhaustive-deps */
import  { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../ContextAPI/AuthContext';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { users } = useContext(AuthContext);
    const { enrollments, fetchEnrollmentByUser, loading, error } = useContext(EnrollmentContext);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (users?.userId) {
            fetchEnrollmentByUser(users.userId);
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(enrollments)) {
            const filtered = enrollments.filter(enrollment => enrollment.user && enrollment.user._id === users.userId);
            setFilteredEnrollments(filtered);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePayment = (enrollmentId, price) => {
        navigate(`/payment/${enrollmentId}`, { state: { price } });
        console.log(`Initiating payment for enrollment ID: ${enrollmentId}`);
    };

    return (
        <div className="container-fluid p-3">
            <div className="container p-0">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {users ? (
                    <div className="card">
                        <div className="row g-0">
                            <div className="col-md-5 d-md-block">
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/009/312/916/original/student-showing-thumbs-up-3d-illustration-chartoon-character-cute-boy-png.png"
                                    className="img-fluid rounded-start login-image"
                                    alt="..."
                                />
                            </div>
                            <div className="col-md-7 col-12">
                                <div className="card-body py-3">
                                    <h2 className="card-title text-center pacifico-regular mb-4" style={{ color: 'darkcyan' }}>
                                        <i className="bi bi-person-fill me-2"></i>Profile
                                    </h2>
                                    <div className='pt-sans-regular-italic'>
                                        <h3><strong>Name:</strong> {users.firstName} {users.lastName}</h3>
                                        <h3><strong>Email:</strong> {users.email}</h3>
                                        <h3><strong>Enrollment Status:</strong> {users.enrollStatus}</h3>
                                        {filteredEnrollments.length === 0 && <p>No enrolled courses found.</p>}
                                        {filteredEnrollments.map(enrollment => (
                                            <div key={enrollment._id}>
                                                <h3><strong>Course Name:</strong> {enrollment.course?.title}</h3>
                                                <h3><strong>Enroll Date:</strong> {new Date(enrollment.enrollDate).toLocaleDateString()}</h3>
                                                <h3><strong>Payment Status:</strong> {enrollment.paymentStatus}</h3>
                                                <h3><strong>Qualification:</strong> {enrollment.qualification}</h3>
                                                <h3><strong>Pass Out Year:</strong> {enrollment.passOutYear}</h3>
                                                {enrollment.paymentStatus === 'pending' && enrollment.course && (
                                                    <button
                                                        onClick={() => handlePayment(enrollment._id, enrollment.course.price)}
                                                        className="btn btn-primary"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;