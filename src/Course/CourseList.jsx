/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../ContextAPI/CourseContext';
import CourseEditForm from './CourseEditForm';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../ContextAPI/AuthContext';
import { message } from 'antd';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const CourseList = () => {
    const { fetchCourses, deleteCourse, courses, loading } = useContext(CourseContext);
    const { users } = useContext(AuthContext);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedCourses, setSortedCourses] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        setSortedCourses(courses);
    }, [courses]);

    const handleEditCourse = (courseId) => {
        setSelectedCourseId(courseId);
        setShowEditForm(true);
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await deleteCourse(courseId);
            message.success('Course deleted successfully!');
        } catch (error) {
            console.error('Error deleting course:', error);
            message.error('Course failed to delete.');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (option) => {
        setSortOption(option);
        let sorted = [...sortedCourses];
        switch (option) {
            case 'A to Z':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'Z to A':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'Low Price to High Price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'High Price to Low Price':
                sorted.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        setSortedCourses(sorted);
    };

    const filteredCourses = sortedCourses.filter(
        (course) =>
            course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLessons = (courseId) => {
        navigate(`/lessons/${courseId}`);
    };

    const handleAssignments = (courseId) => {
        navigate(`/assignments/${courseId}`);
    };

    const handleQuizzes = (courseId) => {
        navigate(`/quizzes/${courseId}`);
    };

    return (
        <div className="container-fluid">
            <h2 className="text-center pacifico-regular">Our Courses</h2>
            <div className="d-flex justify-content-end mb-3 me-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="form-control me-2"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '200px', height: "38px" }}
                />
                <DropdownButton
                    id="dropdown-sort-button"
                    title="Sort Options"
                    onSelect={handleSort}
                    variant="outline-dark"
                >
                    <Dropdown.Item eventKey="A to Z">A to Z</Dropdown.Item>
                    <Dropdown.Item eventKey="Z to A">Z to A</Dropdown.Item>
                    <Dropdown.Item eventKey="Low Price to High Price">Low Price to High Price</Dropdown.Item>
                    <Dropdown.Item eventKey="High Price to Low Price">High Price to Low Price</Dropdown.Item>
                </DropdownButton>
            </div>
            {users && users.role === 'admin' && (
                <div className="d-flex justify-content-end">
                    <Link to={`/create-course`} className="btn btn-success me-4 mb-2">
                        Add Course
                    </Link>
                </div>
            )}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {loading ? (
                    <p>Loading courses...</p>
                ) : filteredCourses.length === 0 ? (
                    <p>No courses available.</p>
                ) : (
                    filteredCourses.map((course) => (
                        <div className="col mb-4 d-flex justify-content-center" key={course._id}>
                            <div className="card h-100" style={{ width: '350px' }}>
                                {course.images && (
                                    <img src={course.images[0]} alt={course.title} className="card-img-top img-fluid" style={{ border: '3px solid gold', borderRadius: '15%' }} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title pacifico-regular mb-3">{course.title}</h5>
                                    <p><strong>Category:</strong> {course.category}</p>
                                    <p><strong>Price:</strong> ${course.price}</p>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        {users && (users.role === 'admin' || users.role === 'instructor') && (<>
                                            <button className="btn btn-outline-info asap me-1" onClick={() => handleLessons(course._id)}>Lessons</button>
                                            <button className="btn btn-outline-info asap me-1" onClick={() => handleAssignments(course._id)}>Assignments</button>
                                            <button className="btn btn-outline-info asap me-1" onClick={() => handleQuizzes(course._id)}>Quizzes</button>
                                        </>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {users && users.role === 'admin' && (
                                            <>
                                                <button className="btn btn-warning asap me-2" onClick={() => handleEditCourse(course._id)}>Edit</button>
                                                <button className="btn btn-danger asap me-2" onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                                            </>
                                        )}
                                        {users && (
                                            <Link to={`/courses/${course._id}`} className="btn btn-primary me-2">
                                                See More
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <CourseEditForm
                show={showEditForm}
                handleClose={() => setShowEditForm(false)}
                courseId={selectedCourseId}
            />
        </div>
    );
};

export default CourseList;