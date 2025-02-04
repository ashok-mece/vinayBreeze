import { useEffect, useState } from 'react';
import './JobSupporterTodayBookings.css';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import JobSupporterService from '../../../../../../Services/exponent_service/JobSupporterService';

function JobSupporterTodayBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [todayJobSupportBookings, setTodayJobSupportBookings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getTodayJobSupportBookingsByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await JobSupporterService.getTodayJobSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                todayJobSupportBookingDisplayErrMsg("Scheduled Bookings are not found for Today");
                setTodayJobSupportBookings([]);
            } else {
                setTodayJobSupportBookings(responseData);
                if (!(responseData.some(item => item.jobSupportBookingDto.meetingLink !== ''))) {
                    console.log('meeting link is not there');
                    setTimeout(() => {
                        getTodayJobSupportBookingsByExponentId();
                    }, 60000);
                }
            }
        } catch (error) {
            console.log(error.message);
            handleTodayJobSupportBookingsByExponentIdErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getTodayJobSupportBookingsByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTodayJobSupportBookingsByExponentIdErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            todayJobSupportBookingDisplayErrMsg("Your Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            todayJobSupportBookingDisplayErrMsg("Scheduled Bookings are not found for Today");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            todayJobSupportBookingDisplayErrMsg("Sorry, Our service is down");
        else
            todayJobSupportBookingDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const todayJobSupportBookingDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='exponent-job-supporter-today-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='job-supporter-bookings' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {todayJobSupportBookings.map((item, index) => (
                    <Card className='card' key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }}>
                        <Card.Body>
                            <Card.Text>
                                <div className='job-supporter-booking-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Job Support Booking'}</label>
                                    </div>
                                    <label>Candidate-Name : </label> <span>{item.candidate.userFirstname + ' ' + item.candidate.userLastname}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.jobSupportBookingDto.startDate)).date}</span> <br />
                                    <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.jobSupportBookingDto.endDate)).date}</span> <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className='time-slots'>
                                            <label>Booked Slots : </label>
                                            <div className='time-slot-container'>
                                                {item.jobSupportBookingDto.timeSlotList.map((item, index) => (
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
                                                onClick={() => window.open(item.jobSupportBookingDto.meetingLink, '_blank')}
                                                disabled={item.jobSupportBookingDto.meetingLink === ''}
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
                                <label>Project Description(PD) : </label> <span className='project-description'>{item.jobSupportBookingDto.projectDescription ? item.jobSupportBookingDto.projectDescription : ('Not Provided')}</span> <br />
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

export default JobSupporterTodayBookings;