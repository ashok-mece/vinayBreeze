import Constants from "../../../../Constants";
import TrainerHome from "../trainer_feature_component/trainer_home_component/TrainerHome";
import JobSupporterHome from "../job_supporter_feature_component/job_supporter_home_component/JobSupporterHome";
import InterviewSupporterHome from "../interview_supporter_feature_component/interview_supporter_home_component/InterviewSupporterHome";

function ExponentHome() {

    const selectedExponentType = localStorage.getItem("breezeSelectedExponentType");

    const trainerFlow = [
        "1.The trainer can create a training session for the selected course under the 'Create Training' menu.",
        "2.Once the trainer creates a training session, the Admin will approve or reject the session based on the requirements.",
        "3.If the training is rejected, the Admin will provide a detailed description explaining the reason for rejection.",
        "4.The trainer can update the rejected training according to the given description.",
        "5.If the training is approved, it will be available for candidates to enroll.",
        "6.The training will automatically start on the course start date.",
        "7.The trainer can join the training session at the scheduled time once the training has started.",
        "8.The Admin can change the course start date based on the number of enrollments.",
        "9.The Admin can change the course end date if needed.",
        "10.The training will automatically be marked as completed on the course end date.",
        "11.Once the training is completed, the trainer need to a create new training again."
    ];

    const intervieweSupporterFlow = [
        "1.Based on the interviewer's technical stack and available time slots, the interviewer can create interview support.",
        "2.Once the interviewer creates interview support, the Admin will approve or reject the interview support based on the requirements.",
        "3.If the interview support is rejected, the Admin will provide a detailed description explaining the reason for rejection.",
        "4.The interviewer can update the rejected interview support according to the given description.",
        "5.If the interview support is approved, it will be available for candidates to book.",
        "6.The interviewer can update the approved interview support.",
        "7.If the updated interview support is approved by the Admin, candidates will see the updated interview support details for booking.",
        "8.If the updated interview support is rejected by the Admin, candidates will see the previous interview support details for booking.",
        "9.Candidates can select a date and choose the interviewer’s available time slots to book interview support.",
        "10.The interviewer can view candidate bookings in the Interview Support Bookings menu.",
        "11.The interviewer can join the interview support session at the scheduled time through the Scheduled Bookings menu.",
        "12.The interview support will automatically be marked as completed the day after the booking date.",
        "13.The interviewer can view completed interview supports in the Completed Bookings menu.",
    ];

    const jobSupporterFlow = [
        "1.Based on the Job Supporter's technical stack and available time slots, the Job Supporter can create Job Support.",
        "2.The Job Supporter creates Job Support, the Admin will approve or reject it based on the requirements.",
        "3.The Job Support is rejected, the Admin provides a detailed description explaining the reason for rejection.",
        "4.The Job Supporter updates the rejected Job Support according to the provided description.",
        "5.The Job Support is approved, it becomes available for candidates to book.",
        "6.The Job Supporter can update the approved Job Support.",
        "7.If the updated Job Support is approved by the Admin, candidates will see the updated Job Support details for booking.",
        "8.If the updated Job Support is rejected by the Admin, candidates will see the original Job Support details for booking.",
        "9.Candidates can select the Job Support start date and choose from the available time slots to book Job Support.",
        "10.The Job Support end date is automatically set to 29 days after the Job Support start date.",
        "11.The Job Supporter can view candidate bookings in the Job Support Bookings menu.",
        "12.The Job Supporter can join the Job Support session at the scheduled time through the Scheduled Bookings menu.",
        "13.The Job Support will automatically be marked as completed the day after the Job Support booking end date.",
        "14.The Job Supporter can view completed Job Supports in the Completed Bookings menu.",
    ];

    return (
        <div>
            {selectedExponentType === Constants.TRAINER && (
                <TrainerHome trainerFlow={trainerFlow} />
            )}
            {selectedExponentType === Constants.JOB_SUPPORTER && (
                <JobSupporterHome jobSupporterFlow={jobSupporterFlow} />
            )}
            {selectedExponentType === Constants.INTERVIEW_SUPPORTER && (
                <InterviewSupporterHome interviewSupporterFlow={intervieweSupporterFlow} />
            )}
        </div>
    );
}

export default ExponentHome;