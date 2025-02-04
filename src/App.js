import './App.css';
import Login from './components/login_component/Login';
import Register from './components/register_component/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from './components/verify_email_component/VerifyEmail';
import Dashboard from './components/dashboard_component/Dashboard';
import Home from './components/dashboard_component/feature_component/Home';
import MandatoryUpdateFields from './components/dashboard_component/feature_component/mandatory_update_fields_component/MandatoryUpdateFields';
import Technology from './components/dashboard_component/feature_component/admin_feature_component/technology_component/Technology';
import Course from './components/dashboard_component/feature_component/admin_feature_component/course_component/Course';
import CreateTraining from './components/dashboard_component/feature_component/exponent_feature_component/trainer_feature_component/create_training_component/CreateTraining';
import CreatedTraining from './components/dashboard_component/feature_component/admin_feature_component/created_training_component/CreatedTraining';
import AddSample from './components/dashboard_component/feature_component/admin_feature_component/add_sample/AddSample';
import TrainerRejectedTrainings from './components/dashboard_component/feature_component/exponent_feature_component/trainer_feature_component/trainer_rejected_trainings_component/TrainerRejectedTrainings';
import CandidateSearchTraining from './components/dashboard_component/feature_component/candidate_feature_component/training/search_training_component/CandidateSearchTraining';
import EnrolledTraining from './components/dashboard_component/feature_component/candidate_feature_component/training/enrolled_training_component/EnrolledTraining';
import AdminEnrolledTrainings from './components/dashboard_component/feature_component/admin_feature_component/admin_enrolled_trainings_component/AdminEnrolledTrainings';
import TrainerApprovedTrainings from './components/dashboard_component/feature_component/exponent_feature_component/trainer_feature_component/trainer_approved_trainings_component/TrainerApprovedTrainings';
import AdminStartedTrainings from './components/dashboard_component/feature_component/admin_feature_component/admin_started_trainings_component/AdminStartedTrainings';
import TrainerStartedTrainings from './components/dashboard_component/feature_component/exponent_feature_component/trainer_feature_component/trainer_started_trainings_component/TrainerStartedTrainings';
import CandidateStartedTraining from './components/dashboard_component/feature_component/candidate_feature_component/training/candidate_started_trainings_component/CandidateStartedTraining';
import AdminCompletedTrainings from './components/dashboard_component/feature_component/admin_feature_component/admin_completed_trainings_component/AdminCompletedTrainings';
import CandidateCompletedTrainings from './components/dashboard_component/feature_component/candidate_feature_component/training/candidate_completed_trainings_component/CandidateCompletedTrainings';
import TrainerCompletedTrainings from './components/dashboard_component/feature_component/exponent_feature_component/trainer_feature_component/trainer_completed_trainings_component/TrainerCompletedTrainings';
import ResetPassword from './components/reset_password_component/ResetPassword';
import RoleBasedRoute from './components/RoleBasedRoute';
import Constants from './components/Constants';
import CreateAdmin from './components/dashboard_component/feature_component/admin_feature_component/create_admin_component/CreateAdmin';
import PageNotFound from './components/page_not_found_component/PageNotFound';
import SessionExpired from './components/session_expired_component/SessionExpired';
import CreateInterviewSupport from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/create_interview_support_component/CreateInterviewSupport';
import CreatedInterviewSupport from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/created_interview_support_component/CreatedInterviewSupport';
import ExponentRejectedInterviewSupport from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/rejected_interview_support_component/ExponentRejectedInterviewSupport';
import ExponentApprovedInterviewSupport from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/approved_interview_support_component/ExponentApprovedInterviewSupport';
import UpdatedInterviewSupport from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/updated_interview_support_component/UpdatedInterviewSupport';
import CandidateSearchInterviewSupport from './components/dashboard_component/feature_component/candidate_feature_component/interview_support/search_interview_support_component/CandidateSearchInterviewSupport';
import AdminBookedInterviewSupport from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/admin_booked_interview_support_component/AdminBookedInterviewSupport';
import CandidateInterviewSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/interview_support/candidate_interview_support_bookings_component/CandidateInterviewSupportBookings';
import InterviewSupporterBookings from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/interview_supporter_bookings_component/InterviewSupporterBookings';
import AdminTodayInterviewSupportBookings from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/admin_today_interview_support_bookings_component/AdminTodayInterviewSupportBookings';
import CandidateTodayInterviewSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/interview_support/candidate_today_interview_support_bookings_component/CandidateTodayInterviewSupportBookings';
import InterviewSupporterTodayBookings from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/interview_supporter_today_bookings_component/InterviewSupporterTodayBookings';
import AdminCompletedInterviewSupports from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/admin_completed_interview_Supports_component/AdminCompletedInterviewSupports';
import CandidateCompletedInterviewSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/interview_support/candidate_completed_interview_support_bookings_component/CandidateCompletedInterviewSupportBookings';
import InterviewSuppoterCompletedBookings from './components/dashboard_component/feature_component/exponent_feature_component/interview_supporter_feature_component/interview_supporter_completed_bookings_component/InterviewSuppoterCompletedBookings';
import AdminRescheduledInterviewSupports from './components/dashboard_component/feature_component/admin_feature_component/interview_support_component/admin_rescheduled_interview_support_component/AdminRescheduledInterviewSupports';
import BasePage from './components/base_page_component/BasePage';
import AdminUsers from './components/dashboard_component/feature_component/admin_feature_component/admin_users_component/AdminUsers';
import CreateJobSupport from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/create_job_supporter_component/CreateJobSupport';
import CreatedJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/created_job_support_component/CreatedJobSupport';
import ExponentRejectedJobSupport from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/rejected_job_support_component/ExponentRejectedJobSupport';
import ExponentApprovedJobSupport from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/approved_job_support_component/ExponentApprovedJobSupport';
import CandidateSearchJobSupport from './components/dashboard_component/feature_component/candidate_feature_component/job_support/search_job_support_component/CandidateSearchJobSupport';
import AdminBookedJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_booked_job_support_component/AdminBookedJobSupport';
import CandidateJobSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/job_support/candidate_job_support_bookings/CandidateJobSupportBookings';
import AdminRescheduledJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_rescheduled_job_support_component/AdminRescheduledJobSupport';
import UpdatedJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/updated_job_support_component/UpdatedJobSupport';
import AdminStoppedJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_stopped_job_support_component/AdminStoppedJobSupport';
import AdminContinuedJobSupport from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_continued_job_support_component/AdminContinuedJobSupport';
import AdminTodayJobSupportBookings from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_today_job_support_booking_component/AdminTodayJobSupportBookings';
import CandidateTodayJobSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/job_support/candidate_today_job_support_bookings_component/CandidateTodayJobSupportBookings';
import JobSupporterBookings from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/job_supporter_bookings_component/JobSupporterBookings';
import JobSupporterTodayBookings from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/job_supporter_today_bookings_component/JobSupporterTodayBookings';
import CandidateCompletedJobSupportBookings from './components/dashboard_component/feature_component/candidate_feature_component/job_support/candidate_completed_job_support_bookings_component/CandidateCompletedJobSupportBookings';
import AdminCompletedJobSupports from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_completed_job_supports_component/AdminCompletedJobSupports';
import JobSupporterCompletedBookings from './components/dashboard_component/feature_component/exponent_feature_component/job_supporter_feature_component/job_supporter_completed_bookings_component/JobSupporterCompletedBookings';
import AdminAssignedJobSupports from './components/dashboard_component/feature_component/admin_feature_component/job_support_component/admin_assigned_job_support_component/AdminAssignedJobSupports';
import PrivacyPolicy from './components/dashboard_component/feature_component/mandatory_update_fields_component/PrivacyPolicy';
import CompanyUsersComponent from './components/dashboard_component/feature_component/fetchuser/CompanyUsersComponent.js/CompanyUsersComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="loading-bar" element={<LoadingBar />} /> */}
        <Route path="" element={<BasePage />} />
        <Route path="register-user" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="dashboard" element={<Dashboard />} >
          <Route path="" element={<Home />} />

          {/**Admin Routes */}
          <Route path="technology" element={<RoleBasedRoute element={<Technology />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="course" element={<RoleBasedRoute element={<Course />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="CompanyUsersComponent" element={<RoleBasedRoute element={<CompanyUsersComponent />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="created-trainings" element={<RoleBasedRoute element={<CreatedTraining />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="add-sample" element={<RoleBasedRoute element={<AddSample />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-enrolled-trainings" element={<RoleBasedRoute element={<AdminEnrolledTrainings />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-started-trainings" element={<RoleBasedRoute element={<AdminStartedTrainings />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-completed-trainings" element={<RoleBasedRoute element={<AdminCompletedTrainings />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="create-admin" element={<RoleBasedRoute element={<CreateAdmin />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-users" element={<RoleBasedRoute element={<AdminUsers />} allowedRoles={[Constants.ADMIN]} />} />

          <Route path="created-interview-supports" element={<RoleBasedRoute element={<CreatedInterviewSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="updated-interview-supports" element={<RoleBasedRoute element={<UpdatedInterviewSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-booked-interview-supports" element={<RoleBasedRoute element={<AdminBookedInterviewSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-rescheduled-interview-supports" element={<RoleBasedRoute element={<AdminRescheduledInterviewSupports />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-today-interview-support-bookings" element={<RoleBasedRoute element={<AdminTodayInterviewSupportBookings />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-completed-interview-support-bookings" element={<RoleBasedRoute element={<AdminCompletedInterviewSupports />} allowedRoles={[Constants.ADMIN]} />} />

          <Route path="created-job-supports" element={<RoleBasedRoute element={<CreatedJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="updated-job-supports" element={<RoleBasedRoute element={<UpdatedJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-booked-job-supports" element={<RoleBasedRoute element={<AdminBookedJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-rescheduled-job-supports" element={<RoleBasedRoute element={<AdminRescheduledJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-stopped-job-supports" element={<RoleBasedRoute element={<AdminStoppedJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-continued-job-supports" element={<RoleBasedRoute element={<AdminContinuedJobSupport />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-assigned-job-supports" element={<RoleBasedRoute element={<AdminAssignedJobSupports />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-today-job-support-bookings" element={<RoleBasedRoute element={<AdminTodayJobSupportBookings />} allowedRoles={[Constants.ADMIN]} />} />
          <Route path="admin-completed-job-support-bookings" element={<RoleBasedRoute element={<AdminCompletedJobSupports />} allowedRoles={[Constants.ADMIN]} />} />

          {/**Exponent Routes */}
          <Route path="create-training" element={<RoleBasedRoute element={<CreateTraining />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="trainer-rejected-trainings" element={<RoleBasedRoute element={<TrainerRejectedTrainings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="trainer-approved-trainings" element={<RoleBasedRoute element={<TrainerApprovedTrainings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="trainer-started-trainings" element={<RoleBasedRoute element={<TrainerStartedTrainings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="trainer-completed-trainings" element={<RoleBasedRoute element={<TrainerCompletedTrainings />} allowedRoles={[Constants.EXPONENT]} />} />

          <Route path="create-interview-support" element={<RoleBasedRoute element={<CreateInterviewSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="exponent-rejected-interview-support" element={<RoleBasedRoute element={<ExponentRejectedInterviewSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="exponent-approved-interview-support" element={<RoleBasedRoute element={<ExponentApprovedInterviewSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="interview-supporter-bookings" element={<RoleBasedRoute element={<InterviewSupporterBookings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="interview-supporter-today-bookings" element={<RoleBasedRoute element={<InterviewSupporterTodayBookings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="interview-supporter-completed-bookings" element={<RoleBasedRoute element={<InterviewSuppoterCompletedBookings />} allowedRoles={[Constants.EXPONENT]} />} />

          <Route path="create-job-support" element={<RoleBasedRoute element={<CreateJobSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="exponent-rejected-job-support" element={<RoleBasedRoute element={<ExponentRejectedJobSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="exponent-approved-job-support" element={<RoleBasedRoute element={<ExponentApprovedJobSupport />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="job-supporter-bookings" element={<RoleBasedRoute element={<JobSupporterBookings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="job-supporter-today-bookings" element={<RoleBasedRoute element={<JobSupporterTodayBookings />} allowedRoles={[Constants.EXPONENT]} />} />
          <Route path="job-supporter-completed-bookings" element={<RoleBasedRoute element={<JobSupporterCompletedBookings />} allowedRoles={[Constants.EXPONENT]} />} />

          {/**Candidate Routes */}
          <Route path="candidate-search-training" element={<RoleBasedRoute element={<CandidateSearchTraining />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="enrolled-trainings" element={<RoleBasedRoute element={<EnrolledTraining />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-started-trainings" element={<RoleBasedRoute element={<CandidateStartedTraining />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-completed-trainings" element={<RoleBasedRoute element={<CandidateCompletedTrainings />} allowedRoles={[Constants.CANDIDATE]} />} />

          <Route path="candidate-search-interview-supports" element={<RoleBasedRoute element={<CandidateSearchInterviewSupport />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-interview-support-bookings" element={<RoleBasedRoute element={<CandidateInterviewSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-today-interview-support-bookings" element={<RoleBasedRoute element={<CandidateTodayInterviewSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-completed-interview-support-bookings" element={<RoleBasedRoute element={<CandidateCompletedInterviewSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />

          <Route path="candidate-search-job-supports" element={<RoleBasedRoute element={<CandidateSearchJobSupport />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-job-support-bookings" element={<RoleBasedRoute element={<CandidateJobSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-today-job-support-bookings" element={<RoleBasedRoute element={<CandidateTodayJobSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />
          <Route path="candidate-completed-job-support-bookings" element={<RoleBasedRoute element={<CandidateCompletedJobSupportBookings />} allowedRoles={[Constants.CANDIDATE]} />} />

        </Route>
        <Route path='mandatoryUpdateFields' element={<MandatoryUpdateFields />} /> {/**remove after */}
        <Route path='session-expired' element={<SessionExpired />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} /> {/**remove after */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

/** children={<Home />}
 * <Route path="dashboard/feature1" element={<Dashboard children={<Feature1 />} />} />
        <Route path="dashboard/feature2" element={<Dashboard children={<Feature2 />} />} />
        <Route path='mandatoryUpdateFields' element={<MandatoryUpdateFields />} />
 */

export default App;