import { useEffect, useState } from 'react';
import './InterviewSupporterHome.css';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';

function InterviewSupporterHome({ interviewSupporterFlow }) { 

    const [loadingBar, setLoadingBar] = useState(false);

    const userFullName = localStorage.getItem("breezeUserFullName");

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTodayInterviewSupporterBookingsErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        handleTodayInterviewSupporterBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [todayBookings, setTodayBookings] = useState([]);
    const handleTodayInterviewSupporterBookings = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: localStorage.getItem('breezeUserId'),
        }
        try {
            const responseData = await InterviewSupporterService.getTodayInterviewSupporterBookingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayInterviewSupporterBookingsErrMsg('Interview Support Bookings are not found for Today');
                setTodayBookings([]);
            } else {
                setTodayBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTodayInterviewSupporterBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayInterviewSupporterBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTodayInterviewSupporterBookingsErrMsg("Your Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayInterviewSupporterBookingsErrMsg("Sorry, Our service is down");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            getTodayInterviewSupporterBookingsErrMsg("No Interview Support Bookings Found Today");
        else
            getTodayInterviewSupporterBookingsErrMsg("Could not process your request");
    }

    // quotations code
    // const [currentQuotationIndex, setCurrentQuotationIndex] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentQuotationIndex((prevIndex) => (prevIndex + 1) % interviewSupporterFlow.length);
    //     }, 30000); // Slide every 30 seconds

    //     return () => clearInterval(interval);
    // }, [interviewSupporterFlow.length]);

    // greeting code
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='interview-supporter-home'>
            {loadingBar && <LoadingBar />}
            <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="slider-container mt-5" style={{ flex: '1' }} >
                    <h5>Hello {userFullName}</h5>
                    <h5>{greeting}</h5>
                    <h6 style={{ textDecoration: 'underline' }} >Interview Supporter Flow :</h6>
                    <div className="quotation-slider" >
                        {/* {interviewSupporterFlow.map((quotation, index) => (
                            <div
                                key={index}
                                className={`quotation ${index === currentQuotationIndex ? 'active' : ''}`}
                                style={{ transform: `translateX(-${currentQuotationIndex * 100}%)` }}
                            >
                                {quotation}
                            </div>
                        ))} */}
                        <ol style={{listStyleType:'none', paddingLeft:0}}>
                            {interviewSupporterFlow.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
            <div className='mt-5' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                <Card style={{ width: '100%', fontSize: '13px' }} className='card'>
                    <Card.Header style={{ backgroundColor: childColor }}>
                        <Card.Title style={{ fontSize: '15px' }}>Today Interview Support Bookings</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {todayBookings.map((item, index) => (
                            <Card key={index} style={{ width: '20rem', margin: '1rem', fontSize: '13px' }} className='card'>
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
                                            </div>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {todayBookings.length === 0 && (
                            <div style={{ width: '100%' }}>
                                <h5 style={{ textAlign: 'center' }}>You have No Interview Support Bookings Today</h5>
                            </div>
                        )}
                    </Card.Body>
                </Card>
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

export default InterviewSupporterHome;