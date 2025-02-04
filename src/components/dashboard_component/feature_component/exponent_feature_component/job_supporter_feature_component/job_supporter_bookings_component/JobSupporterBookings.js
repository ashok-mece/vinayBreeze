import { useEffect, useState } from 'react';
import './JobSupporterBookings.css';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import JobSupporterService from '../../../../../../Services/exponent_service/JobSupporterService';

function JobSupporterBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [jobSupportBookings, setJobSupportBookings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getJobSupportBookingsByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await JobSupporterService.getJobSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                jobSupportBookingDisplayErrMsg("Job Support Bookings are not found");
            } else {
                setJobSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleJobSupportBookingsByExponentIdErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getJobSupportBookingsByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleJobSupportBookingsByExponentIdErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            jobSupportBookingDisplayErrMsg("Your Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            jobSupportBookingDisplayErrMsg("Job Support Bookings are not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            jobSupportBookingDisplayErrMsg("Sorry, Our service is down");
        else
            jobSupportBookingDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const jobSupportBookingDisplayErrMsg = (errorMessage) => {
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
        <div className='exponent-job-supporter-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='job-supporter-bookings' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {jobSupportBookings.map((item, index) => (
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

export default JobSupporterBookings;