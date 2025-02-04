import { useEffect, useState } from 'react';
import './CandidateHome.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import { Button, Card, Modal } from 'react-bootstrap';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CandidateHome({ candidateTrainingFlow, candidateInterviewSupportFlow, candidateJobSupportFlow }) {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    const userFullName = localStorage.getItem("breezeUserFullName");

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getStartedTrainingDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        const fetchData = async () => {
            await getStartedTrainings();
            await getTodayCandidateInterviewSupportBookings();
            await getTodayCandidateJobSupportBookings();
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [startedTrainings, setStartedTrainings] = useState([]);
    const getStartedTrainings = async () => {
        setLoadingBar(true);
        const startedTrainingRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const startedTrainingResponse = await CandidateService.candidateStartedTrainings(startedTrainingRequest);
            console.log(startedTrainingResponse);
            if (startedTrainingResponse.length === 0) {
                getStartedTrainingDisplayErrMsg('Trainings are not Found for Today');
                setStartedTrainings([]);
            } else {
                setStartedTrainings(startedTrainingResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleStartedTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleStartedTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getStartedTrainingDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getStartedTrainingDisplayErrMsg('Sorry, Our service is down');
        else
            getStartedTrainingDisplayErrMsg("Could not process your request");
    }

    // interview Support code
    const [errMsgDivForInterviewSupport, setErrMsgDivForInterviewSupport] = useState(false);
    const [errMsgForInterviewSupport, setErrMsgForInterviewSupport] = useState("");
    //JS for to display err msg
    const getTodayCandidateInterviewSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsgForInterviewSupport(errorMessage);
        setErrMsgDivForInterviewSupport(true);
        setTimeout(() => {
            setErrMsgForInterviewSupport("");
            setErrMsgDivForInterviewSupport(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

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

    // job Support code
    const [errMsgDivForJobSupport, setErrMsgDivForJobSupport] = useState(false);
    const [errMsgForJobSupport, setErrMsgForJobSupport] = useState("");
    //JS for to display err msg
    const getTodayCandidateJobSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsgForJobSupport(errorMessage);
        setErrMsgDivForJobSupport(true);
        setTimeout(() => {
            setErrMsgForJobSupport("");
            setErrMsgDivForJobSupport(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [todayCandidateJobSupportBookings, setTodayCandidateJobSupportBookings] = useState([]);
    const getTodayCandidateJobSupportBookings = async () => {
        setLoadingBar(true);
        const request = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const responseData = await CandidateService.getTodayCandidateJobSupportBookingByCandidateId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayCandidateJobSupportBookingsDisplayErrMsg('Job Support Bookings are not found');
                setTodayCandidateJobSupportBookings([]);
            } else {
                setTodayCandidateJobSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTodayCandidateJobSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayCandidateJobSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTodayCandidateJobSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayCandidateJobSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getTodayCandidateJobSupportBookingsDisplayErrMsg("Could not process your request");
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    // quotations code
    // const [currentQuotationIndexForTraining, setCurrentQuotationIndexForTraining] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentQuotationIndexForTraining((prevIndex) => (prevIndex + 1) % candidateTrainingFlow.length);
    //     }, 30000); // Slide every 30 seconds

    //     return () => clearInterval(interval);
    // }, [candidateTrainingFlow.length]);

    // const [currentQuotationIndexForInterviewSupport, setCurrentQuotationIndexForInterviewSupport] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentQuotationIndexForInterviewSupport((prevIndex) => (prevIndex + 1) % candidateInterviewSupportFlow.length);
    //     }, 30000); // Slide every 30 seconds

    //     return () => clearInterval(interval);
    // }, [candidateInterviewSupportFlow.length]);

    // const [currentQuotationIndexForJobSupport, setCurrentQuotationIndexForJobSupport] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentQuotationIndexForJobSupport((prevIndex) => (prevIndex + 1) % candidateJobSupportFlow.length);
    //     }, 30000); // Slide every 30 seconds

    //     return () => clearInterval(interval);
    // }, [candidateJobSupportFlow.length]);

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

    const [activeFlow, setActiveFlow] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [show, setShow] = useState(false);

    const handleShowModal = (flow, title) => {
        setActiveFlow(flow);
        setModalTitle(title);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setActiveFlow(null);
        setModalTitle("");
    };

    return (
        <div>
            {loadingBar && <LoadingBar />}
            <div className="slider-container">
                <h5>Hello {userFullName}</h5>
                <h5>{greeting}</h5>
                {/* <div>
                    <h6 style={{ textDecoration: 'underline' }} >Candidate Training Flow :</h6>
                    <div className="quotation-slider">
                        {candidateTrainingFlow.map((quotation, index) => (
                            <div
                                key={index}
                                className={`quotation ${index === currentQuotationIndexForTraining ? 'active' : ''}`}
                                style={{ transform: `translateX(-${currentQuotationIndexForTraining * 100}%)` }}
                            >
                                {quotation}
                            </div>
                        ))}
                    </div>
                </div> */}
                {/* <div className='mt-3'>
                    <h6 style={{ textDecoration: 'underline' }} >Candidate Interview Support Flow :</h6>
                    <div className="quotation-slider">
                        {candidateInterviewSupportFlow.map((quotation, index) => (
                            <div
                                key={index}
                                className={`quotation ${index === currentQuotationIndexForInterviewSupport ? 'active' : ''}`}
                                style={{ transform: `translateX(-${currentQuotationIndexForInterviewSupport * 100}%)` }}
                            >
                                {quotation}
                            </div>
                        ))}
                    </div>
                </div> */}
                {/* <div className='mt-3'>
                    <h6 style={{ textDecoration: 'underline' }} >Candidate Job Support Flow :</h6>
                    <div className="quotation-slider">
                        {candidateJobSupportFlow.map((quotation, index) => (
                            <div
                                key={index}
                                className={`quotation ${index === currentQuotationIndexForJobSupport ? 'active' : ''}`}
                                style={{ transform: `translateX(-${currentQuotationIndexForJobSupport * 100}%)` }}
                            >
                                {quotation}
                            </div>
                        ))}
                    </div>
                </div> */}
                <div className="candidate-flows-container">
                    <Button variant="link" className="candidate-flow-popup-link" onClick={() => handleShowModal('training', 'Candidate Training Flow')}>
                        Candidate Training Flow
                    </Button>
                    <Button variant="link" className="candidate-flow-popup-link" onClick={() => handleShowModal('interviewSupport', 'Candidate Interview Support Flow')}>
                        Candidate Interview Support Flow
                    </Button>
                    <Button variant="link" className="candidate-flow-popup-link" onClick={() => handleShowModal('jobSupport', 'Candidate Job Support Flow')}>
                        Candidate Job Support Flow
                    </Button>
                    <Modal show={show} onHide={handleClose} centered size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {activeFlow === 'training' && candidateTrainingFlow.map((item, index) => (
                                <div key={index} style={{marginBottom:'10px'}}>
                                    {item}
                                </div>
                            ))}
                            {activeFlow === 'interviewSupport' && candidateInterviewSupportFlow.map((item, index) => (
                                <div key={index} style={{marginBottom:'10px'}}>
                                    {item}
                                </div>
                            ))}
                            {activeFlow === 'jobSupport' && candidateJobSupportFlow.map((item, index) => (
                                <div key={index} style={{marginBottom:'10px'}}>
                                    {item}
                                </div>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <div className='mt-3' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                <Card style={{ width: '100%', fontSize: '13px' }} className='card'>
                    <Card.Header style={{ backgroundColor: childColor }}>
                        <Card.Title style={{ fontSize: '15px' }}>Today Trainings</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {startedTrainings.map((item, index) => (
                            <Card key={index} style={{ width: '20rem', margin: '1rem', fontSize: '13px' }} className='card'>
                                <Card.Header style={{ backgroundColor: childColor }}>
                                    <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <label>Trainer : </label> <span>{item.trainer.userFirstname + " " + item.trainer.userLastname}</span> <br />
                                        <label>Course : </label> <span>{item.training.courseName}</span> <br />
                                        <label>Technical-Stack : </label> <span>{item.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                        <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).date}</span> <br />
                                        <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).time)}</span> <br />
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseEndDate)).date}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {startedTrainings.length === 0 && (
                            <div style={{ width: '100%' }}>
                                <h5 style={{ textAlign: 'center' }}>You have No Trainings Today</h5>
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
            <div className='candidate-home-interview-support-bookings mt-3' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                <Card style={{ width: '100%', fontSize: '13px' }} className='card'>
                    <Card.Header style={{ backgroundColor: childColor }}>
                        <Card.Title style={{ fontSize: '15px' }}>Today Interview Support Bookings</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {todayCandidateInterviewSupportBookings.map((item, index) => (
                            <Card key={index} style={{ width: '20rem', margin: '1rem', fontSize: '13px' }} className='card'>
                                <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Card.Title style={{ fontSize: '15px' }}>{"Interview Support Booking"}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <label>Interview Supporter-Name : </label> <span>{item.interviewer.userFirstname + " " + item.interviewer.userLastname}</span> <br />
                                        <label>Interview Supporter-Experience : </label> <span>{item.interviewer.userExperience}</span> <br />
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
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {todayCandidateInterviewSupportBookings.length === 0 && (
                            <div style={{ width: '100%' }}>
                                <h5 style={{ textAlign: 'center' }}>You have No Interview Support Bookings Today</h5>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
            <div className=''>
                {errMsgDivForInterviewSupport &&
                    <div style={customCssForMsg}>
                        <label>{errMsgForInterviewSupport}</label>
                    </div>}
            </div>
            <div className='candidate-home-job-support-bookings mt-3' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                <Card style={{ width: '100%', fontSize: '13px' }} className='card'>
                    <Card.Header style={{ backgroundColor: childColor }}>
                        <Card.Title style={{ fontSize: '15px' }}>Today Job Support Bookings</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {todayCandidateJobSupportBookings.map((item, index) => (
                            <Card key={index} style={{ width: '20rem', margin: '1rem', fontSize: '13px' }} className='card'>
                                <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Card.Title style={{ fontSize: '15px' }}>{"Job Support Booking"}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <label>Job Supporter-Name : </label> <span>{item.jobSupporter.userFirstname + " " + item.jobSupporter.userLastname}</span> <br />
                                        <label>Job Supporter-Experience : </label> <span>{item.jobSupporter.userExperience}</span> <br />
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
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {todayCandidateJobSupportBookings.length === 0 && (
                            <div style={{ width: '100%' }}>
                                <h5 style={{ textAlign: 'center' }}>You have No Job Support Bookings Today</h5>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
            <div className=''>
                {errMsgDivForJobSupport &&
                    <div style={customCssForMsg}>
                        <label>{errMsgForJobSupport}</label>
                    </div>}
            </div>
        </div>
    );
}

export default CandidateHome;