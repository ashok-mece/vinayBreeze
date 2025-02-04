import { useEffect, useState } from 'react';
import './CandidateStartedTraining.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import { Card, Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CandidateStartedTraining() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getStartedTrainingDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getStartedTrainings();
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
                getStartedTrainingDisplayErrMsg('Started Trainings are not found');
                setStartedTrainings([]);
            } else {
                setStartedTrainings(startedTrainingResponse);
                if (!(startedTrainingResponse.some(item => item.training.meetingLink !== ''))) {
                    console.log('meeting link is not there');
                    setTimeout(() => {
                        getStartedTrainings();
                    }, 60000);
                }
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

    // open course content code
    const [courseContentUrl, setCourseContentUrl] = useState('');
    useEffect(() => {
        if (courseContentUrl) {
            window.open(courseContentUrl, '_blank');
        }
    }, [courseContentUrl]);
    const handleOpenCourseContent = async (path, trainingId) => {
        setLoadingBar(true);
        console.log(path);
        try {
            const courseContentRequest = {
                courseContent: path,
            }
            const courseContentResponse = await GlobalService.getCourseContentByPath(courseContentRequest);
            console.log(courseContentResponse);
            const courseContentFile = new Blob([courseContentResponse.data], { type: courseContentResponse.headers['content-type'] });
            const courseContentFileUrl = URL.createObjectURL(courseContentFile);
            setCourseContentUrl(courseContentFileUrl);
        } catch (error) {
            console.error('Error fetching data for path:', path, error);
            handleCourseContentErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCourseContentErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleTrainingCardErrMsg("Course Content Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleTrainingCardErrMsg("File Not Found", trainingId);
        else
            handleTrainingCardErrMsg("Could not process your request", trainingId);
    }

    // open intro video code
    const [showIntroVideoModal, setShowIntroVideoModal] = useState(false);
    const handleIntroVideoModalClose = () => {
        setShowIntroVideoModal(false);
        setIntroVideoUrl('');
    };
    const [introVideoUrl, setIntroVideoUrl] = useState('');
    useEffect(() => {
        if (introVideoUrl) {
            setShowIntroVideoModal(true);
        }
    }, [introVideoUrl]);
    const handleOpenIntroVideo = async (path, trainingId) => {
        setLoadingBar(true);
        console.log(path);
        try {
            const introVideoRequest = {
                introVideo: path,
            }
            const introVideoResponse = await GlobalService.getIntroVideoByPath(introVideoRequest);
            console.log(introVideoResponse);
            const introVideoFileUrl = URL.createObjectURL(introVideoResponse.data);
            setIntroVideoUrl(introVideoFileUrl);
        } catch (error) {
            console.error('Error fetching data for path:', path, error);
            handleIntroVideoErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    };
    const handleIntroVideoErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleTrainingCardErrMsg("Intro Video Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleTrainingCardErrMsg("File Not Found", trainingId);
        else
            handleTrainingCardErrMsg("Could not process your request", trainingId);
    }

    const [trainingCard, setTrainingCard] = useState(0);
    const [trainingCardErr, setTrainingCardErr] = useState('');
    const handleTrainingCardErrMsg = (errorMessage, trainingId) => {
        setTrainingCardErr(errorMessage);
        setTrainingCard(trainingId);
        setTimeout(() => {
            setTrainingCardErr('');
            setTrainingCard(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className="candidate-started-training-list">
            { loadingBar && <LoadingBar /> }
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {startedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor }}>
                            <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
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
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.training.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                    <div> 
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseEndDate)).date}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Card.Link
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleOpenCourseContent(item.training.courseContent, item.training.trainingId)}
                                        >
                                            Course Content
                                        </Card.Link>
                                        <Card.Link
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleOpenIntroVideo(item.training.introVideo, item.training.trainingId)}
                                        >
                                            Intro Video
                                        </Card.Link>
                                    </div>
                                    <div>
                                        <button
                                            className='join-meeting-button'
                                            onClick={() => window.open(item.training.meetingLink, '_blank')}
                                            disabled={item.training.meetingLink === ''}
                                        >
                                            Join Zoom Meeting
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {trainingCard === item.training.trainingId && (
                                        <div style={customCssForMsg}>
                                            <label>{trainingCardErr}</label>
                                        </div>
                                    )}
                                </div>
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
            {showIntroVideoModal && (
                <Modal className='intro-video-modal' size='md' show={showIntroVideoModal} onHide={handleIntroVideoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Intro Video
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col">
                                    {introVideoUrl && (
                                        <div className="intro-video-container">
                                            <div style={{ maxWidth: '100%', height: 'auto', position: 'relative', overflow: 'hidden', paddingTop: '56.25%' }}>
                                                <video src={introVideoUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} controls autoPlay muted />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CandidateStartedTraining; 