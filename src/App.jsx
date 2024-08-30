
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Styles/Main.css';
import './App.css';
//ContextApi's
import { AuthProvider } from './ContextAPI/AuthContext';
import { CourseProvider } from './ContextAPI/CourseContext';
import { EnrollmentProvider } from './ContextAPI/EnrollmentContext';
import { AssignmentProvider } from './ContextAPI/AssignmentContext';
import { LessonProvider } from './ContextAPI/LessonContext';
import { QuizProvider } from './ContextAPI/QuizContext';

//Pages
import Home from './Pages/Home';
import About from './Pages/About';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
//Auth
import Register from './Auth/Register';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import Users from './Auth/Users';
//DashBoards
import AdminDashboard from './DashBoards/AdminDashboard';
import StudentDashboard from './DashBoards/StudentDashboard';
import InstructorDashBoard from './DashBoards/InstructorDashBoard'
//Enrollments
import EnrollmentForm from './Enrollment/EnrollmentForm';
import EnrollmentList from './Enrollment/EnrollmentList';
import EnrollmentDetails from './Enrollment/EnrollmentDetails';
import EnrollmentEditForm from './Enrollment/EnrollmentEditForm';
//Course
import CourseList from './Course/CourseList';
import CourseDetails from './Course/CourseDetails';
import CourseEditForm from './Course/CourseEditForm';
import CreateCourseForm from './Course/CreateCourseForm';
//Lessons
import LessonList from './Lessons/LessonList';
import CreateLesson from './Lessons/CreateLesson';
import LessonEditForm from './Lessons/LessonEditForm';
import LessonDetailed from './Lessons/LessonDetailed';
//Assignments
import AssignmentList from './Assignment/AssignmentList';
import CreateAssignmentForm from './Assignment/CreateAssignmentForm';
//Assignment-Submission
import SubmissionForm from './Assignment/SubmissionForm';
import SubmissionList from './Assignment/SubmissionList';
//Quizzes
import QuizList from './Quiz/QuizList';
import CreateQuizForm from './Quiz/CreateQuizForm';
import EditQuizForm from './Quiz/EditQuizForm';
import QuizSubmissionForm from './Quiz/QuizSubmissionForm';
import QuizSubmissionList from './Quiz/QuizSubmissionList';
//Progress Report
import CourseProgress from './DashBoards/CourseProgress';
//Payments
import PaymentPage from './Payment/PaymentPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <AuthProvider>
      <CourseProvider>
        <LessonProvider>
          <QuizProvider>
            <EnrollmentProvider>
              <AssignmentProvider>
                <Router>
                  <Header />
                  <div className='App asap-bold'>
                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/Home' element={<Home />} />
                      <Route path='/About' element={<About />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path='/forgot-password' element={<ForgotPassword />} />
                      <Route path='/reset-password/:token' element={<ResetPassword />} />
                      <Route path='/courses' element={<CourseList />} />
                    
                      {isAuthenticated ? (
                        <>
                          <Route path='/users-details' element={<Users />} />
                          <Route path='/admin-dashboard' element={<AdminDashboard />} />
                          <Route path='/instructor-dashboard' element={<InstructorDashBoard />} />
                          <Route path='/student-dashboard' element={<StudentDashboard />} />
                          <Route path='/courses/:courseId' element={<CourseDetails />} />
                          <Route path='/create-course' element={<CreateCourseForm />} />
                          <Route path='/course-edit/:courseId' element={<CourseEditForm />} />
                          <Route path='/enroll/:courseId' element={<EnrollmentForm />} />
                          <Route path='/enroll' element={<EnrollmentList />} />
                          <Route path='/enroll-details' element={<EnrollmentDetails />} />
                          <Route path='/enroll-edit/:enrollmentId' element={<EnrollmentEditForm />} />
                          <Route path='/assignments/:courseId' element={<AssignmentList />} />
                          <Route path='/create-assignment/:courseId' element={<CreateAssignmentForm />} />
                          <Route path='/submit/:assignmentId' element={<SubmissionForm />} />
                          <Route path='/submissionList/:assignmentId' element={<SubmissionList />} />
                          <Route path='/quizzes/:courseId' element={<QuizList />} />
                          <Route path='/create-quiz/:courseId' element={<CreateQuizForm />} />
                          <Route path='/quiz-edit/:quizId' element={<EditQuizForm />} />
                          <Route path='/quiz-submission/:quizId' element={<QuizSubmissionForm />} />
                          <Route path='//quiz-submission-list/:quizId' element={<QuizSubmissionList />} />
                          <Route path='/payment/:enrollmentId' element={<PaymentPage />} />
                          <Route path='/lessons/:courseId' element={<LessonList />} />
                          <Route path='/create-lesson/:courseId' element={<CreateLesson />} />
                          <Route path='/edit-lesson/:lessonId' element={<LessonEditForm />} />
                          <Route path='/lesson-detailed/:lessonId' element={<LessonDetailed />} />
                          <Route path='/progress-report/:courseId' element={<CourseProgress />} />
                        </>
                      ) : (<Route path="*" element={<Navigate to="/login" />} />)}
                    </Routes>
                  </div>
                  <Footer />
                </Router>
              </AssignmentProvider>
            </EnrollmentProvider>
          </QuizProvider>
        </LessonProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;