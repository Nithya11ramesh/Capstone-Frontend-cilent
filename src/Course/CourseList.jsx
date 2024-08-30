/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../ContextAPI/CourseContext';
import CourseEditForm from './CourseEditForm';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../ContextAPI/AuthContext';
import { message } from 'antd';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const CourseList = () => {
    const { fetchCourses, deleteCourse, courses, loading, error } = useContext(CourseContext);
    const { users } = useContext(AuthContext);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedCourses, setSortedCourses] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

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
                >
                    <Dropdown.Item eventKey="A to Z">A to Z</Dropdown.Item>
                    <Dropdown.Item eventKey="Z to A">Z to A</Dropdown.Item>
                    <Dropdown.Item eventKey="Low Price to High Price">Low Price to High Price</Dropdown.Item>
                    <Dropdown.Item eventKey="High Price to Low Price">High Price to Low Price</Dropdown.Item>
                </DropdownButton>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className="row">
                {filteredCourses.map((course) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={course._id}>
                        <div className="card">
                            <img src={course.thumbnail} className="card-img-top" alt={course.title} />
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                                <p className="card-text"><strong>Price:</strong> ${course.price}</p>
                                <button onClick={() => handleLessons(course._id)} className="btn btn-primary">Lessons</button>
                                <button onClick={() => handleAssignments(course._id)} className="btn btn-secondary ms-2">Assignments</button>
                                <button onClick={() => handleQuizzes(course._id)} className="btn btn-success ms-2">Quizzes</button>
                                <button onClick={() => handleEditCourse(course._id)} className="btn btn-warning ms-2">Edit</button>
                                <button onClick={() => handleDeleteCourse(course._id)} className="btn btn-danger ms-2">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showEditForm && <CourseEditForm courseId={selectedCourseId} />}
        </div>
    );
};

export default CourseList;
