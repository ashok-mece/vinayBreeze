import { useEffect, useState } from 'react';
import './CandidateCompletedTrainings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import { Card, Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CandidateCompletedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCompletedTrainingDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getCompletedTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [completedTrainings, setCompletedTrainings] = useState([]);
    const getCompletedTrainings = async () => {
        setLoadingBar(true);
        const completedTrainingRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const completedTrainingResponse = await CandidateService.candidateCompletedTrainings(completedTrainingRequest);
            console.log(completedTrainingResponse);
            if (completedTrainingResponse.length === 0) {
                getCompletedTrainingDisplayErrMsg('Completed Trainings are not found');
                setCompletedTrainings([]);
            } else {
                setCompletedTrainings(completedTrainingResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleCompletedTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCompletedTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCompletedTrainingDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCompletedTrainingDisplayErrMsg('Sorry, Our service is down');
        else
            getCompletedTrainingDisplayErrMsg("Could not process your request");
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setRating(0);
        setRateTrainingModalData(null);
    };
    const [rateTrainingModalData, setRateTrainingModalData] = useState(null);
    const [rating, setRating] = useState(0)
    const handleRatingChange = (rate) => {
        setRating(rate)
    }
    const handleRateTrainingModal = (item) => {
        console.log(item);
        setRateTrainingModalData(item);
        setShowModal(true);
    }

    const [isRatingButtonDisabled, setIsRatingButtonDisabled] = useState(false);
    const handleRate = async (trainingId) => {
        if (rating === 0) {
            handleRatingTrainingModalErrMsg('Please, Provide Your Rating');
        } else {
            setLoadingBar(true);
            setIsRatingButtonDisabled(true); 
            const ratingRequest = {
                candidateId: localStorage.getItem('breezeUserId'),
                trainingId: trainingId,
                rating: rating,
            }
            console.log(ratingRequest);
            try {
                const responseData = await CandidateService.rateTraining(ratingRequest);
                console.log(responseData);
                handleRatingTrainingModalSucMsg('Successfully Rated for Training');
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
            handleRatingTrainingModalErrMsg('Inputs are invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleRatingTrainingModalErrMsg('Sorry, Our service is down');
        else
            handleRatingTrainingModalErrMsg("Could not process your request");
    }

    const [ratingModalErrDiv, setRatingModalErrDiv] = useState(false);
    const [ratingModalErr, setRatingModalErr] = useState('');
    const handleRatingTrainingModalErrMsg = (errorMessage) => {
        setRatingModalErr(errorMessage);
        setRatingModalErrDiv(true);
        setTimeout(() => {
            setRatingModalErr('');
            setRatingModalErrDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const handleRatingTrainingModalSucMsg = (errorMessage) => {
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
        <div className="candidate-completed-training-list">
            { loadingBar && <LoadingBar /> }
            <div className='mt-1' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {completedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                            {item.trainingCandidate.rating === 0 && (
                                <button
                                    className='rate-btn'
                                    onClick={() => handleRateTrainingModal(item)}
                                >
                                    Rate
                                </button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Trainer : </label> <span>{item.trainer.userFirstname + " " + item.trainer.userLastname}</span> <br />
                                <label>Experience : </label> <span>{item.trainer.userExperience}</span> <br />
                                <label>Course : </label> <span>{item.training.courseName}</span> <br />
                                <label>Technical-Stack : </label> <span>{item.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Course Duration : </label> <span>{item.training.courseDuration + " days"}</span>
                                    </div>
                                    <div>
                                        <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).date}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Session Duration : </label> <span>{item.training.sessionDuration}</span>
                                    </div>
                                    <div>
                                        <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).time)}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Status : </label> <span>{item.trainingCandidate.trainingStatus}</span>
                                    </div>
                                    <div>
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseEndDate)).date}</span>
                                    </div>
                                </div>
                                {item.trainingCandidate.rating !== 0 && (
                                    <div className='mt-2'> 
                                        <label style={{ verticalAlign: 'middle' }}>Your Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.trainingCandidate.rating}
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
                <Modal className='rate-training-modal' size='md' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Rate Training
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='trainer-and-training-data'>
                                <div className='training-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Training Data</label> <br />
                                    <label>Trainer-Name : </label> <span>{rateTrainingModalData.trainer.userFirstname + " " + rateTrainingModalData.trainer.userLastname}</span> <br />
                                    <label>Experience : </label> <span>{rateTrainingModalData.trainer.userExperience}</span> <br />
                                    <label>Course : </label> <span>{rateTrainingModalData.training.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{rateTrainingModalData.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Course Duration : </label> <span>{rateTrainingModalData.training.courseDuration + " days"}</span> <br />
                                    <label>Course Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(rateTrainingModalData.training.courseStartDateAndTime)).date}</span> <br />
                                    <label>Course Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(rateTrainingModalData.training.courseStartDateAndTime)).time)}</span> <br />
                                    <label>Course End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(rateTrainingModalData.training.courseEndDate)).date}</span> <br />
                                    <label>Session Duration : </label> <span>{rateTrainingModalData.training.sessionDuration}</span> <br />
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
                                onClick={() => handleRate(rateTrainingModalData.training.trainingId)}
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

export default CandidateCompletedTrainings; 