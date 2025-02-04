import { useEffect, useState } from 'react';
import Constants from '../../../../../Constants';
import './CandidateCompletedInterviewSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card, Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function CandidateCompletedInterviewSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCandidateCompletedInterviewSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getCandidateCompletedInterviewSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [candidateCompletedInterviewSupportBookings, setCandidateCompletedInterviewSupportBookings] = useState([]);
    const getCandidateCompletedInterviewSupportBookings = async () => {
        setLoadingBar(true);
        const candidateCompletedInterviewSupportBookingsRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const candidateCompletedInterviewSupportBookingsResponse = await CandidateService.getCandidateCompletedInterviewSupportBookingByCandidateId(candidateCompletedInterviewSupportBookingsRequest);
            console.log(candidateCompletedInterviewSupportBookingsResponse);
            if (candidateCompletedInterviewSupportBookingsResponse.length === 0) {
                getCandidateCompletedInterviewSupportBookingsDisplayErrMsg('Completed Bookings are not found');
            } else {
                setCandidateCompletedInterviewSupportBookings(candidateCompletedInterviewSupportBookingsResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleCandidateCompletedInterviewSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCandidateCompletedInterviewSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCandidateCompletedInterviewSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCandidateCompletedInterviewSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getCandidateCompletedInterviewSupportBookingsDisplayErrMsg("Could not process your request");
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setRating(0);
        setRateInterviewSupportModalData(null);
    };
    const [rateInterviewSupportModalData, setRateInterviewSupportModalData] = useState(null);
    const [rating, setRating] = useState(0)
    const handleRatingChange = (rate) => {
        setRating(rate)
    }
    const handleRateInterviewSupportModal = (item) => {
        console.log(item);
        setRateInterviewSupportModalData(item);
        setShowModal(true);
    }

    const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);
    const handleRate = async (interviewSupportBookingId) => {
        if (rating === 0) {
            handleRatingInterviewSupportModalErrMsg('Please, Provide Your Rating');
        } else {
            setLoadingBar(true);
            setIsRatingButtonDisabled(true);
            const ratingRequest = {
                candidateId: localStorage.getItem('breezeUserId'),
                interviewSupportBookingId: interviewSupportBookingId,
                rating: rating,
            }
            console.log(ratingRequest);
            try {
                const responseData = await CandidateService.rateInterviewSupport(ratingRequest);
                console.log(responseData);
                handleRatingInterviewSupportModalSucMsg('Successfully Rated for Interview Support');
            } catch (error) {
                console.log(error.message);
                handleRateErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleRateErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleRatingInterviewSupportModalErrMsg('Inputs are invalid');
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleRatingInterviewSupportModalErrMsg('Entity Not Found');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleRatingInterviewSupportModalErrMsg('Sorry, Our service is down');
        else
            handleRatingInterviewSupportModalErrMsg("Could not process your request");
    }

    const [ratingModalErrDiv, setRatingModalErrDiv] = useState(false); 
    const [ratingModalErr, setRatingModalErr] = useState('');
    const handleRatingInterviewSupportModalErrMsg = (errorMessage) => {
        setRatingModalErr(errorMessage);
        setRatingModalErrDiv(true);
        setTimeout(() => {
            setRatingModalErr('');
            setRatingModalErrDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const handleRatingInterviewSupportModalSucMsg = (errorMessage) => {
        setMessageColor('green');
        setRatingModalErr(errorMessage);
        setRatingModalErrDiv(true);
        setTimeout(() => {
            setRatingModalErr('');
            setRatingModalErrDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='candidate-completed-interview-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {candidateCompletedInterviewSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Interview Support Booking"}</Card.Title>
                            {item.interviewSupportBookingDto.rating === 0 && (
                                <button
                                    className='rate-booking-button'
                                    onClick={() => handleRateInterviewSupportModal(item)}
                                >
                                    Rate
                                </button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Interview Supporter-Name : </label> <span>{item.interviewer.userFirstname + " " + item.interviewer.userLastname}</span> <br />
                                <label>Interview Supporter-Experience : </label> <span>{item.interviewer.userExperience}</span> <br />
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
                                {item.interviewSupportBookingDto.rating !== 0 && (
                                    <div className='mt-2'> 
                                        <label style={{ verticalAlign: 'middle' }}>Your Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.interviewSupportBookingDto.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                )}
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
            {showModal && (
                <Modal className='rate-interview-support-modal' size='md' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Rate Interview Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='interview-support-booking-data'>
                                <div className='booking-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Booking Data</label> <br />
                                    <label>Interview Supporter-Name : </label> <span>{rateInterviewSupportModalData.interviewer.userFirstname + " " + rateInterviewSupportModalData.interviewer.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{rateInterviewSupportModalData.interviewer.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{rateInterviewSupportModalData.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Status : </label> <span>{rateInterviewSupportModalData.interviewSupportBookingDto.bookingStatus}</span> <br />
                                    <label>Booked Date : </label> <span>{(Constants.convertUserTimezoneDateTime(rateInterviewSupportModalData.interviewSupportBookingDto.bookedDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label>
                                        <div className='time-slot-container'>
                                            {rateInterviewSupportModalData.interviewSupportBookingDto.timeSlotList.map((item, index) => (
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
                                <div className='mt-3'>
                                    <label>Provide Your Rating</label> <br />
                                    <Rating
                                        allowFraction
                                        transition
                                        fillColor='#1b4962'
                                        allowHover={false}
                                        size={25}
                                        showTooltip={true}
                                        onClick={handleRatingChange}
                                    />
                                </div>
                            </div>
                            <div className=''>
                                {ratingModalErrDiv &&
                                    <div style={customCssForMsg}>
                                        <label>{ratingModalErr}</label>
                                    </div>}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                className='modal-rate-btn px-3'
                                onClick={() => handleRate(rateInterviewSupportModalData.interviewSupportBookingDto.interviewSupportBookingId)}
                                disabled={isRatingButtonDisabled}
                            >
                                Rate
                            </button>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CandidateCompletedInterviewSupportBookings;