import { useEffect, useState } from 'react';
import './CandidateInterviewSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card, Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { FaRedo } from 'react-icons/fa';

function CandidateInterviewSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCandidateInterviewSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getCandidateInterviewSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [candidateInterviewSupportBookings, setCandidateInterviewSupportBookings] = useState([]);
    const getCandidateInterviewSupportBookings = async () => {
        setLoadingBar(true);
        const candidateInterviewSupportBookingsRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const candidateInterviewSupportBookingsResponse = await CandidateService.getCandidateInterviewSupportBookingByCandidateId(candidateInterviewSupportBookingsRequest);
            console.log(candidateInterviewSupportBookingsResponse);
            if (candidateInterviewSupportBookingsResponse.length === 0) {
                getCandidateInterviewSupportBookingsDisplayErrMsg('Interview Support Bookings are not found');
            } else {
                setCandidateInterviewSupportBookings(candidateInterviewSupportBookingsResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleCandidateInterviewSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCandidateInterviewSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCandidateInterviewSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCandidateInterviewSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getCandidateInterviewSupportBookingsDisplayErrMsg("Could not process your request");
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

    const handleCancelBookingButton = async (interviewSupportBookingId) => {
        setLoadingBar(true);
        const cancelBookingRequest = {
            interviewSupportBookingId: interviewSupportBookingId,
        }

        try {
            const cancelBookingResponse = await CandidateService.cancelInterviewSupportBooking(cancelBookingRequest);
            console.log(cancelBookingResponse);
            handleInterviewSupportCardSucMsg('Successfully Cancelled Booking', interviewSupportBookingId);
        } catch (error) {
            console.log(error.message);
            handleCancelBookingErrors(error.message, interviewSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleCancelBookingErrors = (errorStatus, interviewSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleInterviewSupportCardErrMsg("Request is invalid", interviewSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleInterviewSupportCardErrMsg("Booking is Not Found", interviewSupportBookingId);
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
    const handleInterviewSupportCardSucMsg = (errorMessage, interviewSupportBookingId) => {
        setMessageColor('green');
        setInterviewSupportCardErr(errorMessage);
        setInterviewSupportCard(interviewSupportBookingId);
        setTimeout(() => {
            setInterviewSupportCardErr('');
            setInterviewSupportCard(0);
            setMessageColor(Constants.MESSAGE_COLOR);
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    // reschedule modal code
    const [selectedInterviewSupport, setSelectedInterviewSupport] = useState(null);
    const handleRescheduleInterviewSupportClick = (data) => {
        setSelectedInterviewSupport(data);
        setShowModal(true);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedInterviewSupport(null);
        setSelectedInterviewSupportDate(null);
        setTimeSlotList([]);
        setSelectedSlots([]);
    };

    // date
    const [selectedInterviewSupportDate, setSelectedInterviewSupportDate] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleSelectedInterviewSupportDate = (date) => {
        setSelectedInterviewSupportDate(date);
    };

    useEffect(() => {
        if (selectedInterviewSupportDate) {
            loadAvailableSlotsOnSelectedDate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterviewSupportDate]);

    // time slot code
    const [timeSlotList, setTimeSlotList] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const handleTimeSlotClick = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
        console.log(selectedSlots);
    };
    const handleTimeSlotReload = () => {
        setSelectedSlots([]);
    };

    const loadAvailableSlotsOnSelectedDate = async () => {
        if (selectedInterviewSupportDate === null) {
            selectedInterviewSupportModalDisplayErrMsg('Please Select a date');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('interviewSupportId', selectedInterviewSupport.interviewSupportDto.interviewSupportId);
            formData.append('bookedDateString', selectedInterviewSupportDate);
            console.log(formData);
            try {
                const responseData = await CandidateService.loadAvailableSlotsOnSelectedDate(formData);
                console.log(responseData);
                setTimeSlotList(responseData);
            } catch (error) {
                console.log(error.message);
                loadAvailableSlotsOnSelectedDateErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const loadAvailableSlotsOnSelectedDateErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Selected Entity is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            selectedInterviewSupportModalDisplayErrMsg("Could not process your request");
    }

    const handleRescheduleBooking = async () => {
        console.log(selectedInterviewSupport);
        if (selectedSlots === null || selectedSlots.length === 0) {
            selectedInterviewSupportModalDisplayErrMsg('select slots to book interview support');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('interviewSupportBookingId', selectedInterviewSupport.interviewSupportBookingDto.interviewSupportBookingId);
            formData.append('interviewSupportId', selectedInterviewSupport.interviewSupportDto.interviewSupportId);
            formData.append('candidateId', localStorage.getItem('breezeUserId'));
            formData.append('bookedDateString', selectedInterviewSupportDate);
            formData.append('timeSlotList', (selectedSlots.map(slot => slot.timeSlotId)));
            console.log(formData);
            try {
                const responseData = await CandidateService.rescheduleInterviewSupportBooking(formData);
                console.log(responseData);
                selectedInterviewSupportModalDisplaySucMsg('Your Booking has Rescheduled, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleRescheduleBookingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleRescheduleBookingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Your Booking is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            selectedInterviewSupportModalDisplayErrMsg("Could not process your request");
    }

    const [selectedInterviewSupportModalErrMsgDiv, setSelectedInterviewSupportModalErrMsgDiv] = useState(false);
    const [selectedInterviewSupportModalErrMsg, setSelectedInterviewSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const selectedInterviewSupportModalDisplayErrMsg = (errorMessage) => {
        setSelectedInterviewSupportModalErrMsg(errorMessage);
        setSelectedInterviewSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedInterviewSupportModalErrMsg("");
            setSelectedInterviewSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const selectedInterviewSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setSelectedInterviewSupportModalErrMsg(errorMessage);
        setSelectedInterviewSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedInterviewSupportModalErrMsg("");
            setSelectedInterviewSupportModalErrMsgDiv(false);
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
        <div className='candidate-interview-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {candidateInterviewSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Interview Support Booking"}</Card.Title>
                            <div style={{ display: 'flex' }}>
                                <button
                                    className='cancel-booking-button'
                                    onClick={() => handleCancelBookingButton(item.interviewSupportBookingDto.interviewSupportBookingId)}
                                >
                                    Cancel Booking
                                </button>
                                {item.interviewSupportBookingDto.adminStatus === Constants.CONFIRMED && (
                                    <button
                                        className='reschedule-booking-button'
                                        onClick={() => handleRescheduleInterviewSupportClick(item)}
                                    >
                                        Reschedule
                                    </button>
                                )}
                            </div>
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
                                    {item.interviewSupportBookingDto.adminStatus === Constants.HOLD && (
                                        <button
                                            className='booking-status-pending-button'
                                        >
                                            <i class="fas fa-hourglass-half"></i>
                                            Pending
                                        </button>
                                    )}
                                    {item.interviewSupportBookingDto.adminStatus === Constants.CONFIRMED && (
                                        <button
                                            className='booking-status-confirmed-button'
                                        >
                                            <i class="fas fa-check-circle"></i>
                                            Confirmed
                                        </button>
                                    )}
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
                        {item.interviewSupportBookingDto.rescheduledStatus !== '' && (
                            <Card.Footer>
                                <label>Rescheduled Status : </label><span>{item.interviewSupportBookingDto.rescheduledStatus === 'HOLD' ? ('PENDING') : item.interviewSupportBookingDto.rescheduledStatus}</span>
                            </Card.Footer>
                        )}
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
                <Modal className='view-selected-reschedule-interview-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Reschedule Booking
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='interview-support-and-interview-supporter-data'>
                                <div className='interview-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Supporter Data</label> <br />
                                    <label>Interview Supporter-Name : </label> <span>{selectedInterviewSupport.interviewer.userFirstname + " " + selectedInterviewSupport.interviewer.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{selectedInterviewSupport.interviewer.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{selectedInterviewSupport.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={selectedInterviewSupport.interviewSupportDto.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className='select-date mt-3'>
                                        <label>Select Date to Book Available slots for Interview Support <strong>(You can select from current date to next 7 days)</strong></label>
                                        <Datetime
                                            value={selectedInterviewSupportDate}
                                            onChange={handleSelectedInterviewSupportDate}
                                            isValidDate={isValidDate}
                                            inputProps={{
                                                placeholder: 'Select Date',
                                                readOnly: true,
                                            }}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                {timeSlotList.length !== 0 && (
                                    <div className='time-slots mt-3'>
                                        <div className="label-container">
                                            <label>Select Available Time Slots</label>
                                            <div className="reload-container" onClick={handleTimeSlotReload}>
                                                <FaRedo className="reload-icon" />
                                                <span className="reload-text">Uncheck All Slots</span>
                                            </div>
                                        </div>
                                        <div className="time-slot-container" >
                                            {timeSlotList.map((item, index) => (
                                                <div>
                                                    <button
                                                        key={index}
                                                        type='button'
                                                        className={`time-slot-button ${selectedSlots.includes(item) ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSlotClick(item)}
                                                        disabled={item.isBooked}
                                                        title={item.isBooked ? 'Slot is Booked' : ''}
                                                    >
                                                        {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className='mt-2'>
                                    {selectedInterviewSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{selectedInterviewSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        {timeSlotList.length !== 0 && (
                            <Modal.Footer>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        className='modal-button'
                                        onClick={handleRescheduleBooking}
                                    >
                                        Reschedule Booking
                                    </button>
                                </div>
                            </Modal.Footer>
                        )}
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CandidateInterviewSupportBookings; 