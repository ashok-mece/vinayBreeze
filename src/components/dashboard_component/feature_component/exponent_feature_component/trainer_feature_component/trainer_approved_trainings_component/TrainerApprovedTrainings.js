import './TrainerApprovedTrainings.css';
import { Card, Container, Modal } from 'react-bootstrap';
import Constants from '../../../../../Constants';
import { useEffect, useState } from 'react';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import "react-datetime/css/react-datetime.css";
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function TrainerApprovedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTrainerApprovedTrainingErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        handleTrainerApprovedTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [approvedTrainings, setApprovedTrainings] = useState([]);
    const handleTrainerApprovedTrainings = async () => {
        setLoadingBar(true);
        const trainerApprovedTrainingRequest = {
            exponentId: localStorage.getItem('breezeUserId'),
        }
        try {
            const responseData = await TrainerService.getApprovedTrainingByExponentId(trainerApprovedTrainingRequest);
            console.log(responseData);
            if (responseData.length === 0) {
                getTrainerApprovedTrainingErrMsg('Approved Trainings are not found');
                setApprovedTrainings([]);
            } else {
                setApprovedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTrainerApprovedTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTrainerApprovedTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTrainerApprovedTrainingErrMsg("Your Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTrainerApprovedTrainingErrMsg("Sorry, Our service is down");
        else
            getTrainerApprovedTrainingErrMsg("Could not process your request");
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

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='trainer-approved-trainings'>
            { loadingBar && <LoadingBar /> }
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {approvedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor }}>
                            <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ width: '33%', textAlign: 'left' }}>
                                        <label>Enrolled : </label> <span>{item.enrolledCandidatesCount}</span>
                                    </div>
                                    <div style={{ width: '33%', textAlign: 'center' }}>
                                        <label>Confirmed : </label> <span>{item.confirmedCandidatesCount}</span>
                                    </div>
                                    <div style={{ width: '33%', textAlign: 'right' }}>
                                        <label>Pending : </label> <span>{item.pendingCandidatesCount}</span>
                                    </div>
                                </div>
                                <div className='mt-1'>
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
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
        </div>
    );
}

export default TrainerApprovedTrainings; 