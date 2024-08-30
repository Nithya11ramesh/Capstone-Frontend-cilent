/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';
import EnrollmentEditForm from './EnrollmentEditForm';
import { AuthContext } from '../ContextAPI/AuthContext';
import { message } from 'antd';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const EnrollmentList = () => {
    const { fetchEnrollments, enrollments, loading, deleteEnrollment } = useContext(EnrollmentContext);
    const { users } = useContext(AuthContext);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedEnrollments, setSortedEnrollments] = useState([]);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    useEffect(() => {
        if (Array.isArray(enrollments)) {
            setSortedEnrollments(enrollments);
        } else {
            console.error('Enrollments data is not an array:', enrollments);
        }
    }, [enrollments]);

    const handleEditEnrollment = (enrollmentId) => {
        setSelectedEnrollmentId(enrollmentId);
        setShowEditForm(true);
    };

    const handleDeleteEnrollment = async (enrollmentId) => {
        try {
            await deleteEnrollment(enrollmentId);
            message.success('Enrollment Deleted successfully..!');
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            message.error('Enrollment failed to delete.');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (option) => {
        setSortOption(option);
        let sorted = [...sortedEnrollments];
        switch (option) {
            case 'A to Z':
                sorted.sort((a, b) => a.course.title.localeCompare(b.course.title));
                break;
            case 'Z to A':
                sorted.sort((a, b) => b.course.title.localeCompare(a.course.title));
                break;
            default:
                break;
        }
        setSortedEnrollments(sorted);
    };

    const filteredEnrollments = sortedEnrollments.filter((enrollment) =>
        enrollment.user && // Ensure enrollment.user is not null or undefined
        (`${enrollment.user.firstName} ${enrollment.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container-fluid py-5">
            <h2 className="text-center pacifico-regular">Our Enrollments</h2>
            <div className="d-flex justify-content-end mb-3">
                <input
                    type="text"
                    placeholder="Search by name or course"
                    className="form-control me-2"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '250px' }}
                />
                <DropdownButton
                    id="dropdown-sort-button"
                    title="Sort Options"
                    onSelect={handleSort}
                    variant="outline-dark"
                >
                    <Dropdown.Item eventKey="A to Z">A to Z Alphabetical order</Dropdown.Item>
                    <Dropdown.Item eventKey="Z to A">Z to A Alphabetical order</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 ">
                {loading ? (
                    <p>Loading enrollments...</p>
                ) : filteredEnrollments.length === 0 ? (
                    <p>No enrollments available.</p>
                ) : (
                    filteredEnrollments.map((enrollment) => (
                        <div className="col mb-4 px-5 " key={enrollment._id}>
                            <div className="card h-100">
                                <div className="card-body d-flex align-items-start">
                                    {enrollment.user && (
                                        <h5 className="card-title asap">Student Name: {enrollment.user.firstName} {enrollment.user.lastName}</h5>
                                    )}
                                    <p><strong>Qualification:</strong> {enrollment.qualification}</p>
                                    <p><strong>Pass Out Year:</strong> {enrollment.passOutYear}</p>
                                    <p><strong>Enrolled Date:</strong> {new Date(enrollment.enrollDate).toLocaleDateString()}</p>
                                    <p><strong>Course:</strong> {enrollment.course.title}</p>
                                    <p><strong>Payment Status:</strong> {enrollment.paymentStatus}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {users && users.role === 'admin' && (
                                            <>
                                                <button className="btn btn-warning asap me-2" onClick={() => handleEditEnrollment(enrollment._id)}>Edit</button>
                                                <button className="btn btn-danger asap me-2" onClick={() => handleDeleteEnrollment(enrollment._id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <EnrollmentEditForm
                show={showEditForm}
                handleClose={() => setShowEditForm(false)}
                enrollmentId={selectedEnrollmentId}
            />
        </div>
    );
};

export default EnrollmentList;