import { useEffect, useState } from 'react';
import './InterviewSupporterTodayBookings.css';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';
import Constants from '../../../../../Constants';
import { Card } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function InterviewSupporterTodayBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [todayInterviewSupportBookings, setTodayInterviewSupportBookings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getTodayInterviewSupportBookingsByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await InterviewSupporterService.getTodayInterviewSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                todayInterviewSupportBookingDisplayErrMsg("Scheduled Bookings are not found for Today");
                setTodayInterviewSupportBookings([]);
            } else {
                setTodayInterviewSupportBookings(responseData);
                if (!(responseData.some(item => item.interviewSupportBookingDto.meetingLink !== ''))) {
                    console.log('meeting link is not there');
                    setTimeout(() => {
                        getTodayInterviewSupportBookingsByExponentId();
                    }, 60000);
                }
            }
        } catch (error) {
            console.log(error.message);
            handleTodayInterviewSupportBookingsByExponentIdErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getTodayInterviewSupportBookingsByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTodayInterviewSupportBookingsByExponentIdErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            todayInterviewSupportBookingDisplayErrMsg("Your Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            todayInterviewSupportBookingDisplayErrMsg("You Have No Scheduled Bookings Today");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            todayInterviewSupportBookingDisplayErrMsg("Sorry, Our service is down");
        else
            todayInterviewSupportBookingDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const todayInterviewSupportBookingDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
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
        <div className='exponent-interview-supporter-today-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='interview-supporter-bookings' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {todayInterviewSupportBookings.map((item, index) => (
                    <Card className='card' key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }}>
                        <Card.Body>
                            <Card.Text>
                                <div className='interview-supporter-booking-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Interview Support Booking'}</label>
                                    </div>
                                    <label>Candidate-Name : </label> <span>{item.candidate.userFirstname + ' ' + item.candidate.userLastname}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Booked Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.interviewSupportBookingDto.bookedDate)).date}</span> <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                        <div>
                                            <button
                                                className='join-meeting-button'
                                                onClick={() => window.open(item.interviewSupportBookingDto.meetingLink, '_blank')}
                                                disabled={item.interviewSupportBookingDto.meetingLink === ''}
                                                style={{marginTop: '20px'}}
                                            >
                                                Join Zoom Meeting
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div>
                                {/* <label>Resume Link : </label>
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
                                </span><br /> */}
                                <label>Job Description(JD) : </label> <span className='job-description'>{item.interviewSupportBookingDto.jobDescription ? item.interviewSupportBookingDto.jobDescription : ('Not Provided')}</span> <br />
                                <div>
                                    {interviewSupportCard === item.interviewSupportBookingDto.interviewSupportBookingId && (
                                        <div style={customCssForMsg}>
                                            <label>{interviewSupportCardErr}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                ))}
            </div>
            <div>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
        </div>
    );
}

export default InterviewSupporterTodayBookings;