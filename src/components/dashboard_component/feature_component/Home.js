import Constants from "../../Constants";
import './Home.css';
import AdminHome from '../feature_component/admin_feature_component/admin_home_component/AdminHome';
import CandidateHome from '../feature_component/candidate_feature_component/training/candidate_home_component/CandidateHome';
import ExponentHome from "./exponent_feature_component/exponent_home_component/ExponentHome";

function Home() {

    const userType = localStorage.getItem("breezeUserType");

    const candidateTrainingFlow = [
        "1.Candidates can search for training based on the provided courses.",
        "2.Candidates can enroll in the training if they are interested.",
        "3.Candidate enrolls in the training, the Admin will confirm or withdraw their enrollment by contacting the candidate.",
        "4.If the candidate's enrollment is confirmed, they can join training sessions in the Scheduled Trainings menu once the training has started.",
        "5.The Admin can change the course start date and end date of the training if required.",
        "6.The training will automatically be marked as completed on the course end date.",
        "7.Once the training is completed, candidates can rate the training in the Completed Trainings menu.",
    ];

    const candidateInterviewSupportFlow = [
        "1.Candidates can book Interview Support based on their requirements.",
        "2.Interview support booking is withdrawn by the Admin, the booking will be canceled.",
        "3.Interview support booking is approved by the Admin, the candidate becomes eligible to receive interview support from the interviewer.",
        "4.The candidate wishes to cancel their interview at the scheduled time and date, they must cancel the interview in the Interview Support Bookings menu.",
        "5.The candidate wishes to reschedule their interview, they can do so in the Interview Support Bookings menu.",
        "6.Candidates can join the interview support session at the scheduled time and date through the Scheduled Bookings menu.",
        "7.The interview support will automatically be marked as completed the day after the booking date.",
        "8.Candidates can view their completed interview supports in the Completed Bookings menu and rate their Interview Support.",
    ];

    const candidateJobSupportFlow = [
        "1.Candidates can book Job Support based on their requirements.",
        "2.If the candidate mistakenly chooses the wrong Job Support start date, booking slots, or technical stack, they can cancel the Job Support booking before Admin approval.",
        "3.If the candidate mistakenly chooses the wrong Job Support start date or booking slots, they can reschedule the Job Support booking.",
        "4.Before the Job Support starts, candidates can change the start date and booking slots.",
        "5.After the Job Support starts, candidates can only change the booking slots.",
        "6.If the candidate is dissatisfied with the Job Supporter's support, they can stop the Job Support booking in the Job Support Bookings menu.",
        "7.If the candidate is dissatisfied with the Job Supporter's support and wishes to assign another Job Supporter, they can do so in the Job Support Bookings menu.",
        "8.Candidates who wish to continue the Job Support can click the 'Continue' option in the Job Support Bookings menu.",
        "9.Candidates can view their Job Support bookings in the Candidate Support Bookings menu.",
        "10.Candidates can join the Job Support session at the scheduled time through the Scheduled Bookings menu.",
        "11.The Job Support will automatically be marked as completed the day after the Job Support booking end date.",
        "12.Candidates can view their completed Job Supports in the Candidate Support Completed Job Support menu.",
    ];

    return (
        <div>
            {userType === Constants.ADMIN && (
                <AdminHome />
            )}
            {userType === Constants.EXPONENT && (
                <ExponentHome />
            )}
            {userType === Constants.CANDIDATE && (
                <CandidateHome candidateTrainingFlow={candidateTrainingFlow} candidateInterviewSupportFlow={candidateInterviewSupportFlow} candidateJobSupportFlow={candidateJobSupportFlow} />
            )}
        </div>
    );

}

export default Home;