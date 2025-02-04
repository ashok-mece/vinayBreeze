import { useEffect, useState } from 'react';
import './InterviewSuppoterCompletedBookings.css';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function InterviewSuppoterCompletedBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [completedInterviewSupportBookings, setCompletedInterviewSupportBookings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getCompletedInterviewSupportBookingsByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await InterviewSupporterService.getCompletedInterviewSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                completedInterviewSupportBookingDisplayErrMsg("Completed Interview Support are not found");
            } else {
                setCompletedInterviewSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleCompletedInterviewSupportBookingsByExponentIdErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getCompletedInterviewSupportBookingsByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCompletedInterviewSupportBookingsByExponentIdErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            completedInterviewSupportBookingDisplayErrMsg("Your Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            completedInterviewSupportBookingDisplayErrMsg("You Have No Completed Interview Support");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            completedInterviewSupportBookingDisplayErrMsg("Sorry, Our service is down");
        else
            completedInterviewSupportBookingDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const completedInterviewSupportBookingDisplayErrMsg = (errorMessage) => {
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
        <div className='exponent-completed-interview-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='interview-supporter-completed-bookings' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {completedInterviewSupportBookings.map((item, index) => (
                    <Card className='card' key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }}>
                        <Card.Body>
                            <Card.Text>
                                <div className='interview-supporter-booking-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Interview Support Booking'}</label>
                                    </div>
                                    <label>Candidate-Name : </label> <span>{item.candidate.userFirstname + ' ' + item.candidate.userLastname}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Status : </label> <span>{item.interviewSupportBookingDto.bookingStatus}</span> <br />
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
                                    <div className='mt-1'>
                                        <label style={{ verticalAlign: 'middle' }}>Candidate Rating : &nbsp;</label>
                                        {item.interviewSupportBookingDto.rating !== 0 ? (
                                            <span>
                                                <Rating
                                                    size={20}
                                                    initialValue={item.interviewSupportBookingDto.rating}
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

export default InterviewSuppoterCompletedBookings; 