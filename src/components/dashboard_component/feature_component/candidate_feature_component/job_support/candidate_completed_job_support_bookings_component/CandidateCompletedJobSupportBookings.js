import { useEffect, useState } from 'react';
import './CandidateCompletedJobSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card, Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function CandidateCompletedJobSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCandidateCompletedJobSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getCandidateCompletedJobSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [candidateCompletedJobSupportBookings, setCandidateCompletedJobSupportBookings] = useState([]);
    const getCandidateCompletedJobSupportBookings = async () => {
        setLoadingBar(true);
        const candidateCompletedJobSupportBookingsRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const candidateCompletedJobSupportBookingsResponse = await CandidateService.getCandidateCompletedJobSupportBookingByCandidateId(candidateCompletedJobSupportBookingsRequest);
            console.log(candidateCompletedJobSupportBookingsResponse);
            if (candidateCompletedJobSupportBookingsResponse.length === 0) {
                getCandidateCompletedJobSupportBookingsDisplayErrMsg('Completed Bookings are not found');
            } else {
                setCandidateCompletedJobSupportBookings(candidateCompletedJobSupportBookingsResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleCandidateCompletedJobSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCandidateCompletedJobSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCandidateCompletedJobSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCandidateCompletedJobSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getCandidateCompletedJobSupportBookingsDisplayErrMsg("Could not process your request");
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setRating(0);
        setRateJobSupportModalData(null);
    };
    const [rateJobSupportModalData, setRateJobSupportModalData] = useState(null);
    const [rating, setRating] = useState(0)
    const handleRatingChange = (rate) => {
        setRating(rate)
    }
    const handleRateJobSupportModal = (item) => {
        console.log(item);
        setRateJobSupportModalData(item);
        setShowModal(true);
    }

    const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);
    const handleRate = async (jobSupportBookingId) => {
        if (rating === 0) {
            handleRatingJobSupportModalErrMsg('Please, Provide Your Rating');
        } else {
            setLoadingBar(true);
            setIsRatingButtonDisabled(true);
            const ratingRequest = {
                candidateId: localStorage.getItem('breezeUserId'),
                jobSupportBookingId: jobSupportBookingId,
                rating: rating,
            }
            console.log(ratingRequest);
            try {
                const responseData = await CandidateService.rateJobSupport(ratingRequest);
                console.log(responseData);
                handleRatingJobSupportModalSucMsg('Successfully Rated for Job Support');
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
            handleRatingJobSupportModalErrMsg('Inputs are invalid');
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleRatingJobSupportModalErrMsg('Entity Not Found');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleRatingJobSupportModalErrMsg('Sorry, Our service is down');
        else
            handleRatingJobSupportModalErrMsg("Could not process your request");
    }

    const [ratingModalErrDiv, setRatingModalErrDiv] = useState(false); 
    const [ratingModalErr, setRatingModalErr] = useState('');
    const handleRatingJobSupportModalErrMsg = (errorMessage) => {
        setRatingModalErr(errorMessage);
        setRatingModalErrDiv(true);
        setTimeout(() => {
            setRatingModalErr('');
            setRatingModalErrDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const handleRatingJobSupportModalSucMsg = (errorMessage) => {
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
        <div className='candidate-completed-job-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {candidateCompletedJobSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Job Support Booking"}</Card.Title>
                            {item.jobSupportBookingDto.rating === 0 && (
                                <button
                                    className='rate-booking-button'
                                    onClick={() => handleRateJobSupportModal(item)}
                                >
                                    Rate
                                </button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Job Supporter-Name : </label> <span>{item.jobSupporter.userFirstname + " " + item.jobSupporter.userLastname}</span> <br />
                                <label>Job Supporter-Experience : </label> <span>{item.jobSupporter.userExperience}</span> <br />
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
                                {item.jobSupportBookingDto.rating !== 0 && (
                                    <div className='mt-2'> 
                                        <label style={{ verticalAlign: 'middle' }}>Your Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.jobSupportBookingDto.rating}
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
                <Modal className='rate-job-support-modal' size='md' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Rate Job Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-booking-data'>
                                <div className='booking-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Booking Data</label> <br />
                                    <label>Job Supporter-Name : </label> <span>{rateJobSupportModalData.jobSupporter.userFirstname + " " + rateJobSupportModalData.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{rateJobSupportModalData.jobSupporter.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{rateJobSupportModalData.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Status : </label> <span>{rateJobSupportModalData.jobSupportBookingDto.bookingStatus}</span> <br />
                                    <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(rateJobSupportModalData.jobSupportBookingDto.startDate)).date}</span> <br />
                                    <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(rateJobSupportModalData.jobSupportBookingDto.endDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label>
                                        <div className='time-slot-container'>
                                            {rateJobSupportModalData.jobSupportBookingDto.timeSlotList.map((item, index) => (
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
                                onClick={() => handleRate(rateJobSupportModalData.jobSupportBookingDto.jobSupportBookingId)}
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

export default CandidateCompletedJobSupportBookings;