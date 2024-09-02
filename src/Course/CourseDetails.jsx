import { useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CourseContext } from '../ContextAPI/CourseContext';

const CourseDetails = () => {
    const { courseId } = useParams();
    const { currentCourse, fetchCourseById, loading, error } = useContext(CourseContext);

    useEffect(() => {
        if (courseId) {
            fetchCourseById(courseId);
        }
    }, [courseId, fetchCourseById]);

    return (
        <div className="container py-5">
            <div className="card mb-3 py-5">
                <div className="row g-0">
                    <div className="col-md-12">
                        <div className="card-body">
                            <h1 className="text-center pacifico-regular" style={{ color: 'darkblue' }}>
                                <i className="bi bi-book"> Course Details </i>
                            </h1>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>Error: {error}</p>
                            ) : currentCourse ? (
                                <div className="col">
                                    <div className="card">
                                        <img
                                            src={currentCourse.images || 'https://via.placeholder.com/300'} // Default image
                                            alt={currentCourse.title || 'Course Image'}
                                            className="card-img-top img-fluid"
                                            style={{ width: '50%', margin: 'auto' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title pacifico-regular">{currentCourse.title || 'No Title Available'}</h5>
                                            <h6 className="card-text asap">Course Description: {currentCourse.description || 'No Description Available'}</h6>
                                            <h6 className="card-text asap">Course Price: Rs.{currentCourse.price || 'N/A'}</h6>
                                            <h6 className="card-text asap">Course Duration: {currentCourse.duration || 'N/A'} Months</h6>
                                            <h6 className="card-text asap">Course Lessons: {currentCourse.lessons ? currentCourse.lessons.length : 'N/A'}</h6>
                                            <h6 className="card-text asap">Course Instructor: {currentCourse.instructor ? `${currentCourse.instructor.firstName} ${currentCourse.instructor.lastName}` : 'Unknown'}</h6>
                                            <Link to={`/enroll/${currentCourse._id}`} className="btn btn-success me-2 asap mb-2">
                                                Enroll
                                            </Link>
                                            <Link to={'/courses'} className="btn btn-primary me-2 asap">
                                                Back
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Course not found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
