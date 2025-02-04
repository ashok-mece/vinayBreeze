import { useEffect, useState } from 'react';
import './JobSupporterCompletedBookings.css';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import JobSupporterService from '../../../../../../Services/exponent_service/JobSupporterService';

function JobSupporterCompletedBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [completedJobSupportBookings, setCompletedJobSupportBookings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getCompletedJobSupportBookingsByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await JobSupporterService.getCompletedJobSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                completedJobSupportBookingDisplayErrMsg("Completed Job Support Bookings are not found");
            } else {
                setCompletedJobSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleCompletedJobSupportBookingsByExponentIdErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getCompletedJobSupportBookingsByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCompletedJobSupportBookingsByExponentIdErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            completedJobSupportBookingDisplayErrMsg("Your Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            completedJobSupportBookingDisplayErrMsg("Completed Job Support are not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            completedJobSupportBookingDisplayErrMsg("Sorry, Our service is down");
        else
            completedJobSupportBookingDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const completedJobSupportBookingDisplayErrMsg = (errorMessage) => {
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
        <div className='exponent-completed-job-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='job-supporter-completed-bookings' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {completedJobSupportBookings.map((item, index) => (
                    <Card className='card' key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }}>
                        <Card.Body>
                            <Card.Text>
                                <div className='job-supporter-booking-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Job Support Booking'}</label>
                                    </div>
                                    <label>Candidate-Name : </label> <span>{item.candidate.userFirstname + ' ' + item.candidate.userLastname}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Status : </label> <span>{item.jobSupportBookingDto.bookingStatus}</span> <br />
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
                                    <div className='mt-1'>
                                        <label style={{ verticalAlign: 'middle' }}>Candidate Rating : &nbsp;</label>
                                        {item.jobSupportBookingDto.rating !== 0 ? (
                                            <span>
                                                <Rating
                                                    size={20}
                                                    initialValue={item.jobSupportBookingDto.rating}
                                                    allowFraction
                                                    fillColor='#1b4962'
                                                    readonly={true}
                                                />
                                            </span>
                                        ) : (
                                            <label style={{verticalAlign: 'middle' }}>Not Rated</label>
                                        )}
                                    </div>
                                </div>
                            </Card.Text>
                        </Card.Body>
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

export default JobSupporterCompletedBookings;