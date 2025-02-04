import { useEffect, useState } from 'react';
import './CandidateTodayInterviewSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function CandidateTodayInterviewSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTodayCandidateInterviewSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getTodayCandidateInterviewSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [todayCandidateInterviewSupportBookings, setTodayCandidateInterviewSupportBookings] = useState([]);
    const getTodayCandidateInterviewSupportBookings = async () => {
        setLoadingBar(true);
        const request = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const responseData = await CandidateService.getTodayCandidateInterviewSupportBookingByCandidateId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayCandidateInterviewSupportBookingsDisplayErrMsg('Interview Support Bookings are not found');
                setTodayCandidateInterviewSupportBookings([]);
            } else {
                setTodayCandidateInterviewSupportBookings(responseData);
                if (!(responseData.some(item => item.interviewSupportBookingDto.meetingLink !== ''))) {
                    console.log('meeting link is not there');
                    setTimeout(() => {
                        getTodayCandidateInterviewSupportBookings();
                    }, 60000);
                }
            }
        } catch (error) {
            console.log(error.message);
            handleTodayCandidateInterviewSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayCandidateInterviewSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTodayCandidateInterviewSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayCandidateInterviewSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getTodayCandidateInterviewSupportBookingsDisplayErrMsg("Could not process your request");
    }

    // open Resume code
    const [resumeUrl, setResumeUrl] = useState('');
    useEffect(() => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        }
    }, [resumeUrl]);
    const handleOpenResume = async (path, interviewSupportBookingId) => {
        setLoadingBar(true);
        console.log(path);
        try {
            const resumeRequest = {
                courseContent: path,
            }
            const resumeResponse = await GlobalService.getCourseContentByPath(resumeRequest);
            console.log(resumeResponse);
            const resumeFile = new Blob([resumeResponse.data], { type: resumeResponse.headers['content-type'] });
            const resumeFileUrl = URL.createObjectURL(resumeFile);
            setResumeUrl(resumeFileUrl);
        } catch (error) {
            console.error('Error fetching data for path:', path, error);
            handleResumeErrors(error.message, interviewSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleResumeErrors = (errorStatus, interviewSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleInterviewSupportCardErrMsg("Resume Path is invalid", interviewSupportBookingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleInterviewSupportCardErrMsg("File Not Found", interviewSupportBookingId);
        else
            handleInterviewSupportCardErrMsg("Could not process your request", interviewSupportBookingId);
    }

    const [interviewSupportCard, setInterviewSupportCard] = useState(0);
    const [interviewSupportCardErr, setInterviewSupportCardErr] = useState('');
    const handleInterviewSupportCardErrMsg = (errorMessage, interviewSupportBookingId) => {
        setInterviewSupportCardErr(errorMessage);
        setInterviewSupportCard(interviewSupportBookingId);
        setTimeout(() => {
            setInterviewSupportCardErr('');
            setInterviewSupportCard(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='candidate-today-interview-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {todayCandidateInterviewSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Interview Support Booking"}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Interview Supporter-Name : </label> <span>{item.interviewer.userFirstname + " " + item.interviewer.userLastname}</span> <br />
                                <label>Interview Supporter-Experience : </label> <span>{item.interviewer.userExperience}</span> <br />
                                <div>
                                    <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                    <span>
                                        <Rating
                                            size={20}
                                            initialValue={item.interviewSupportDto.rating}
                                            allowFraction
                                            fillColor='#1b4962'
                                            readonly={true}
                                        />
                                    </span> <br />
                                </div>
                                <label>Technical-Stack : </label> <span>{item.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                <label>Booked Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.interviewSupportBookingDto.bookedDate)).date}</span> <br />
                                <div className='time-slots'>
                                    <label>Booked Slots : </label>
                                    <div className='time-slot-container'>
                                        {item.interviewSupportBookingDto.timeSlotList.map((item, index) => (
                                            <button
                                                key={index}
                                                type='button'
                                                className='time-slot-button'
                                            >
                                                {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label>Job Description(JD) : </label> <span className='job-description'>{item.interviewSupportBookingDto.jobDescription ? item.interviewSupportBookingDto.jobDescription : ('Not Provided')}</span>
                                    </div>
                                    {/* <div>
                                        <label>Resume Link : </label>
                                        <span>
                                            {item.interviewSupportBookingDto.resume ? (
                                                <button
                                                    onClick={() => handleOpenResume(item.interviewSupportBookingDto.resume, item.interviewSupportBookingDto.interviewSupportBookingId)}
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        padding: '0',
                                                        color: '#1b4962',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Open Resume
                                                </button>
                                            ) : (' Not Provided')}
                                        </span>
                                    </div> */}
                                    <div>
                                        <button
                                            className='join-meeting-button'
                                            onClick={() => window.open(item.interviewSupportBookingDto.meetingLink, '_blank')}
                                            disabled={item.interviewSupportBookingDto.meetingLink === ''}
                                        >
                                            Join Zoom Meeting
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {interviewSupportCard === item.interviewSupportBookingDto.interviewSupportBookingId && (
                                        <div style={customCssForMsg}>
                                            <label>{interviewSupportCardErr}</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
        </div>
    );
}

export default CandidateTodayInterviewSupportBookings;