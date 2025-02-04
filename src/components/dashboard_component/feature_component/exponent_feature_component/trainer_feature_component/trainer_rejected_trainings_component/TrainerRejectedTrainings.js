import { useEffect, useState } from 'react';
import './TrainerRejectedTrainings.css';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function TrainerRejectedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [rejectedTrainings, setRejectedTrainings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getRejectedTrainingByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await TrainerService.getRejectedTrainingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                rejectedTrainingsDisplayErrMsg('Rejected Trainings are not Available');
            } else {
                setRejectedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTrainerRejectedTrainingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getRejectedTrainingByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTrainerRejectedTrainingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            rejectedTrainingsDisplayErrMsg("Trainer Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            rejectedTrainingsDisplayErrMsg("Sorry, Our service is down");
        else
            rejectedTrainingsDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const rejectedTrainingsDisplayErrMsg = (errorMessage) => {
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
    };
    const handleCourseContentErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleOpenFilesErrMsg("Course Content Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("File Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

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
            handleOpenFilesErrMsg("Intro Video Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("File Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

    const [fileClicked, setFileClicked] = useState(0);
    const [openFilesErr, setOpenFilesErr] = useState('');
    const handleOpenFilesErrMsg = (errorMessage, trainingId) => {
        setOpenFilesErr(errorMessage);
        setFileClicked(trainingId);
        setTimeout(() => {
            setOpenFilesErr('');
            setFileClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //update button clicked code
    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    const [showUpdateTrainingModal, setShowUpdateTrainingModal] = useState(false);
    const handleUpdateTrainingModalClose = () => {
        setShowUpdateTrainingModal(false);
        setTrainingId(0);
        setTechnologies([]);
        setCourseContent(null);
        setIntroVideo(null);
        setTechnologiesList([]);
        setDefaultCourse([]);
        setDefaultTechnologyList([]);
        setCourseDuration(0);
        setCourseStartDateAndTime(null);
    }
    // course code
    const [defaultCourse, setDefaultCourse] = useState([]);
    // technology code
    const [trainingId, setTrainingId] = useState(0);
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const [defaultTechnologyList, setDefaultTechnologyList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        console.log(selectedList);
        setTechnologies([...selectedList]);
        console.log(technologies);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
    }
    // corse duration
    const [courseDuration, setCourseDuration] = useState(0);
    const handleCourseDurationChange = (event) => {
        setCourseDuration(event.target.value);
    }

    // date and time
    const [courseStartDateAndTime, setCourseStartDateAndTime] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 17);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleCourseStartDateChange = (date) => {
        setCourseStartDateAndTime(date);
    };
    // updated course content and intro video file
    const [courseContent, setCourseContent] = useState(null);
    const handleCourseContentFile = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCourseContent(file);
        } else {
            alert('Please select a PDF or Word document');
            event.target.value = ''; // Clear the file input
            setCourseContent(null);
        }
    };
    const [introVideo, setIntroVideo] = useState(null);
    const handleIntroVideoFile = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setIntroVideo(file);
        } else {
            alert('Please select a video file');
            event.target.value = ''; // Clear the file input
            setIntroVideo(null);
        }
    };
    // update button onclick
    const handleUpdateTrainingBtnClick = async (training) => {
        setLoadingBar(true);
        setTrainingId(training.trainingId);
        setDefaultCourse({ courseName: training.courseName });
        // setDefaultTechnologyList(training.technologyList);
        // setTechnologies(training.technologyList);

        const techStackRequest = {
            userId: training.exponentId,
        }

        try {
            const responseData = await GlobalService.getTechStackByExponentId(techStackRequest);
            console.log(responseData);
            const jsonResponseData = responseData.map((item, index) => {
                return { technologyName: item }
            });
            console.log(jsonResponseData);
            setTechnologiesList(jsonResponseData);
            if (technologiesList) {
                // setCourseDuration(training.courseDuration);
                setShowUpdateTrainingModal(true);
            }
        } catch (error) {
            console.log(error.message);
            handleTechnicalStackErrors(error.message, training.trainingId);
        } finally {
            setLoadingBar(false);
        }
        console.log(training.technologyList);
    }
    const handleTechnicalStackErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleOpenFilesErrMsg("Trainer Id is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("Entity Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

    const handleUpdateTraining = async () => {
        console.log(trainingId);
        console.log(technologies);
        console.log(technologies.map(tech => tech.technologyName));
        console.log(courseDuration);
        console.log(courseStartDateAndTime);
        console.log(!courseContent);
        console.log(!introVideo);

        if (courseDuration !== 0 && (courseDuration > 120 || courseDuration < 30)) {
            updateTrainingDisplayErrMsg('Please give course duration between 30 to 120 (in days)');
        } else if (courseContent && courseContent.size > 5 * 1024 * 1024) { 
            updateTrainingDisplayErrMsg('Course content file size exceeds the maximum limit of 5MB');
        } else if (introVideo && introVideo.size > 5 * 1024 * 1024) { 
            updateTrainingDisplayErrMsg('Intro video file size exceeds the maximum limit of 5MB');
        } else if ((technologies === null || technologies.length === 0) && courseDuration === 0 && courseStartDateAndTime === null && !courseContent && !introVideo) { 
            updateTrainingDisplayErrMsg('Please select any field to update');
        } else {
            setLoadingBar(true);
            // Update FormData object 
            const formData = new FormData();
            formData.append('trainingId', trainingId);
            formData.append('technologyList', (technologies.map(tech => tech.technologyName)));
            formData.append('courseContentFile', courseContent);
            formData.append('introVideoFile', introVideo);
            formData.append('courseDuration', courseDuration);
            formData.append('courseStartDateAndTime', courseStartDateAndTime);
            formData.append('sessionDuration', Constants.SESSION_DURATION);
            console.log(formData);
            try {
                const responseData = await TrainerService.updateTrainingByTrainingId(formData);
                console.log(responseData);
                updateTrainingDisplaySucMsg('Training Updated Successfully');
            } catch (error) {
                handleUpdateTrianingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }

    }

    const handleUpdateTrianingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateTrainingDisplayErrMsg("Trainer Id is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateTrainingDisplayErrMsg("Entity Not Found", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateTrainingDisplayErrMsg("Sorry, Our service is down");
        else if (Constants.FILES_NOT_UPLOADED === errorStatus)
            updateTrainingDisplayErrMsg("Files not uploaded, please try again");
        else
            updateTrainingDisplayErrMsg("Could not process your request", trainingId);
    }

    const [updateTraingErrMsgDiv, setUpdateTraingErrMsgDiv] = useState(false);
    const [updateTraingErrMsg, setUpdateTraingErrMsg] = useState("");
    //JS for to display err msg
    const updateTrainingDisplayErrMsg = (errorMessage) => {
        setUpdateTraingErrMsg(errorMessage);
        setUpdateTraingErrMsgDiv(true);
        setTimeout(() => {
            setUpdateTraingErrMsg("");
            setUpdateTraingErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateTrainingDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateTraingErrMsg(errorMessage);
        setUpdateTraingErrMsgDiv(true);
        setTimeout(() => {
            setUpdateTraingErrMsg("");
            setUpdateTraingErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateTrainingModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    return (
        <div className="trainer-rejected-trainings" style={{ fontSize: '13px' }}>
            { loadingBar && <LoadingBar /> }
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {rejectedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='rejected-training'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{item.courseName + ' Training'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateTrainingBtnClick(item)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Course : </label> <span>{item.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label>Course Duration : </label> <span>{item.courseDuration + " days"}</span>
                                        </div>
                                        <div>
                                            <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.courseStartDateAndTime)).date}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label>Session Duration : </label> <span>{item.sessionDuration}</span>
                                        </div>
                                        <div>
                                            <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.courseStartDateAndTime)).time)}</span>
                                        </div>
                                    </div>
                                    <label>Course Content : </label>
                                    <span>
                                        <button
                                            onClick={() => handleOpenCourseContent(item.courseContent, item.trainingId)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                color: '#1b4962',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Open Course Content
                                        </button>
                                    </span> <br />
                                    <label>Intro Video : </label>
                                    <span>
                                        <button
                                            onClick={() => handleOpenIntroVideo(item.introVideo, item.trainingId)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                color: '#1b4962',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Play Intro Video
                                        </button>
                                    </span>
                                </div>
                                <div>
                                    {fileClicked === item.trainingId && (
                                        <div style={customCssForMsg}>
                                            <label>{openFilesErr}</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div>
                                <label>Status : </label> <span><strong>{item.adminStatus}</strong></span> <br />
                                <label>Reason : </label> <span><strong>{item.description}</strong></span>
                            </div>
                        </Card.Footer>
                    </Card>
                ))}
                <div>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
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
            {showUpdateTrainingModal && (
                <Modal className='update-training-modal' size='lg' show={showUpdateTrainingModal} onHide={handleUpdateTrainingModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Training</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="update-training" style={{ fontSize: '14px' }}>
                                <div className="training-form">
                                    <form>
                                        <div className='course'>
                                            <label>Selected Course</label>
                                            <Select
                                                getOptionLabel={(options) => {
                                                    return options["courseName"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["courseName"];
                                                }}
                                                value={defaultCourse}
                                                isDisabled={true}
                                            />
                                        </div>
                                        <div className='technology-multiselect mt-3'>
                                            <label>Update Technical Stack</label>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
                                                // selectedValues={defaultTechnologyList}
                                                onSelect={onSelectTechnology}
                                                onRemove={onRemoveTechnology}
                                                displayValue="technologyName" //technologyName
                                                placeholder="Your Technical Stack"
                                                avoidHighlightFirstOption={true}
                                                style={{
                                                    chips: {
                                                        background: childColor,
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className='course-duration mt-3'>
                                            <label>Course Duration <strong>(Number of days)</strong></label>
                                            <input
                                                type='number'
                                                min={30}
                                                max={120}
                                                className='form-control'
                                                placeholder='Duration'
                                                value={courseDuration}
                                                onChange={handleCourseDurationChange}
                                            />
                                        </div>
                                        <div className='date-time mt-3'>
                                            <label>Select Training Start Date and Time <strong>(You can select after 3 days to current date)</strong></label>
                                            <Datetime
                                                value={courseStartDateAndTime}
                                                onChange={handleCourseStartDateChange}
                                                isValidDate={isValidDate}
                                                inputProps={{ 
                                                    placeholder: 'Select Date and Time',
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                        <div className="course-content-file mt-3">
                                            <label>Upload Course Content <strong>(max size is 5MB)</strong></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="courseContentFile"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCourseContentFile}
                                            />
                                        </div>
                                        <div className='intro-video-file mt-3'>
                                            <label>Upload Your Intro Video <strong>(1 minute) (max size is 5MB)</strong></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="introVideoFile"
                                                accept="video/*"
                                                onChange={handleIntroVideoFile}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            {updateTraingErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateTraingErrMsg}</label>
                                                </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='update-training-button'>
                                <Button
                                    className='dashboard-button'
                                    onClick={handleUpdateTraining}
                                >
                                    Update
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );

}

export default TrainerRejectedTrainings;


/**==================================================================================================== */

/**
 * import { useEffect, useState } from 'react';
import './TrainerRejectedTrainings.css';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function TrainerRejectedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [rejectedTrainings, setRejectedTrainings] = useState([]);
    const userId = localStorage.getItem("breezeUserId");
    const getRejectedTrainingByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await TrainerService.getRejectedTrainingByExponentId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                rejectedTrainingsDisplayErrMsg('Rejected Trainings are not Available');
            } else {
                setRejectedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTrainerRejectedTrainingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getRejectedTrainingByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTrainerRejectedTrainingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            rejectedTrainingsDisplayErrMsg("Trainer Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            rejectedTrainingsDisplayErrMsg("Sorry, Our service is down");
        else
            rejectedTrainingsDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const rejectedTrainingsDisplayErrMsg = (errorMessage) => {
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
    };
    const handleCourseContentErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleOpenFilesErrMsg("Course Content Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("File Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

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
            handleOpenFilesErrMsg("Intro Video Path is invalid", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("File Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

    const [fileClicked, setFileClicked] = useState(0);
    const [openFilesErr, setOpenFilesErr] = useState('');
    const handleOpenFilesErrMsg = (errorMessage, trainingId) => {
        setOpenFilesErr(errorMessage);
        setFileClicked(trainingId);
        setTimeout(() => {
            setOpenFilesErr('');
            setFileClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //update button clicked code
    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    const [showUpdateTrainingModal, setShowUpdateTrainingModal] = useState(false);
    const handleUpdateTrainingModalClose = () => {
        setShowUpdateTrainingModal(false);
        setTrainingId(0);
        setTechnologies([]);
        setCourseContent(null);
        setIntroVideo(null);
        setTechnologiesList([]);
        setDefaultCourse([]);
        setDefaultTechnologyList([]);
        setCourseDuration(0);
        setCourseStartDateAndTime(null);
    }
    // course code
    const [defaultCourse, setDefaultCourse] = useState([]);
    // technology code
    const [trainingId, setTrainingId] = useState(0);
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const [defaultTechnologyList, setDefaultTechnologyList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        console.log(selectedList);
        setTechnologies([...selectedList]);
        console.log(technologies);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
    }
    // corse duration
    const [courseDuration, setCourseDuration] = useState(0);
    const handleCourseDurationChange = (event) => {
        setCourseDuration(event.target.value);
    }

    // date and time
    const [courseStartDateAndTime, setCourseStartDateAndTime] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 17);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleCourseStartDateChange = (date) => {
        setCourseStartDateAndTime(date);
    };
    // updated course content and intro video file
    const [courseContent, setCourseContent] = useState(null);
    const handleCourseContentFile = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCourseContent(file);
        } else {
            alert('Please select a PDF or Word document');
            event.target.value = ''; // Clear the file input
            setCourseContent(null);
        }
    };
    const [introVideo, setIntroVideo] = useState(null);
    const handleIntroVideoFile = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setIntroVideo(file);
        } else {
            alert('Please select a video file');
            event.target.value = ''; // Clear the file input
            setIntroVideo(null);
        }
    };
    // update button onclick
    const handleUpdateTrainingBtnClick = async (training) => {
        setLoadingBar(true);
        setTrainingId(training.trainingId);
        setDefaultCourse({ courseName: training.courseName });
        setDefaultTechnologyList(training.technologyList);
        setTechnologies(training.technologyList);

        const techStackRequest = {
            userId: training.exponentId,
        }

        try {
            const responseData = await GlobalService.getTechStackByExponentId(techStackRequest);
            console.log(responseData);
            const jsonResponseData = responseData.map((item, index) => {
                return { technologyName: item }
            });
            console.log(jsonResponseData);
            setTechnologiesList(jsonResponseData);
            if (technologiesList) {
                setCourseDuration(training.courseDuration);
                setShowUpdateTrainingModal(true);
            }
        } catch (error) {
            console.log(error.message);
            handleTechnicalStackErrors(error.message, training.trainingId);
        } finally {
            setLoadingBar(false);
        }
        console.log(training.technologyList);
    }
    const handleTechnicalStackErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleOpenFilesErrMsg("Trainer Id is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleOpenFilesErrMsg("Entity Not Found", trainingId);
        else
            handleOpenFilesErrMsg("Could not process your request", trainingId);
    }

    const handleUpdateTraining = async () => {
        console.log(trainingId);
        console.log(technologies);
        console.log(technologies.map(tech => tech.technologyName));
        console.log(courseDuration);
        console.log(courseStartDateAndTime);

        if (technologies === null || technologies.length === 0) { // need to set default technologyList to technologies
            updateTrainingDisplayErrMsg('Please select technologies to train from your technical stack');
        } else if (courseDuration > 120 || courseDuration < 30) {
            updateTrainingDisplayErrMsg('Please give course duration between 30 to 120 (in days)');
        } else if (courseStartDateAndTime === null) {
            updateTrainingDisplayErrMsg('Please select start date and time');
        } else if (!courseContent) {
            updateTrainingDisplayErrMsg('Please upload course content');
        } else if (!introVideo) {
            updateTrainingDisplayErrMsg('Please upload your 1 minute intro video');
        } else if (courseContent.size > 5 * 1024 * 1024) { 
            updateTrainingDisplayErrMsg('Course content file size exceeds the maximum limit of 5MB');
        } else if (introVideo.size > 5 * 1024 * 1024) { 
            updateTrainingDisplayErrMsg('Intro video file size exceeds the maximum limit of 5MB');
        } else {
            setLoadingBar(true);
            // Update FormData object 
            const formData = new FormData();
            formData.append('trainingId', trainingId);
            formData.append('technologyList', (technologies.map(tech => tech.technologyName)));
            formData.append('courseContentFile', courseContent);
            formData.append('introVideoFile', introVideo);
            formData.append('courseDuration', courseDuration);
            formData.append('courseStartDateAndTime', courseStartDateAndTime);
            formData.append('sessionDuration', Constants.SESSION_DURATION);
            console.log(formData);
            try {
                const responseData = await TrainerService.updateTrainingByTrainingId(formData);
                console.log(responseData);
                updateTrainingDisplaySucMsg('Training Updated Successfully');
            } catch (error) {
                handleUpdateTrianingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }

    }

    const handleUpdateTrianingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateTrainingDisplayErrMsg("Trainer Id is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateTrainingDisplayErrMsg("Entity Not Found", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateTrainingDisplayErrMsg("Sorry, Our service is down");
        else if (Constants.FILES_NOT_UPLOADED === errorStatus)
            updateTrainingDisplayErrMsg("Files not uploaded, please try again");
        else
            updateTrainingDisplayErrMsg("Could not process your request", trainingId);
    }

    const [updateTraingErrMsgDiv, setUpdateTraingErrMsgDiv] = useState(false);
    const [updateTraingErrMsg, setUpdateTraingErrMsg] = useState("");
    //JS for to display err msg
    const updateTrainingDisplayErrMsg = (errorMessage) => {
        setUpdateTraingErrMsg(errorMessage);
        setUpdateTraingErrMsgDiv(true);
        setTimeout(() => {
            setUpdateTraingErrMsg("");
            setUpdateTraingErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateTrainingDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateTraingErrMsg(errorMessage);
        setUpdateTraingErrMsgDiv(true);
        setTimeout(() => {
            setUpdateTraingErrMsg("");
            setUpdateTraingErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateTrainingModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    return (
        <div className="trainer-rejected-trainings" style={{ fontSize: '13px' }}>
            { loadingBar && <LoadingBar /> }
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {rejectedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='rejected-training'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{item.courseName + ' Training'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateTrainingBtnClick(item)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Course : </label> <span>{item.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{item.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label>Course Duration : </label> <span>{item.courseDuration + " days"}</span>
                                        </div>
                                        <div>
                                            <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.courseStartDateAndTime)).date}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label>Session Duration : </label> <span>{item.sessionDuration}</span>
                                        </div>
                                        <div>
                                            <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.courseStartDateAndTime)).time)}</span>
                                        </div>
                                    </div>
                                    <label>Course Content : </label>
                                    <span>
                                        <button
                                            onClick={() => handleOpenCourseContent(item.courseContent, item.trainingId)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                color: '#1b4962',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Open Course Content
                                        </button>
                                    </span> <br />
                                    <label>Intro Video : </label>
                                    <span>
                                        <button
                                            onClick={() => handleOpenIntroVideo(item.introVideo, item.trainingId)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                color: '#1b4962',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Play Intro Video
                                        </button>
                                    </span>
                                </div>
                                <div>
                                    {fileClicked === item.trainingId && (
                                        <div style={customCssForMsg}>
                                            <label>{openFilesErr}</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div>
                                <label>Status : </label> <span><strong>{item.adminStatus}</strong></span> <br />
                                <label>Reason : </label> <span><strong>{item.description}</strong></span>
                            </div>
                        </Card.Footer>
                    </Card>
                ))}
                <div>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
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
            {showUpdateTrainingModal && (
                <Modal className='update-training-modal' size='lg' show={showUpdateTrainingModal} onHide={handleUpdateTrainingModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Training</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="update-training" style={{ fontSize: '14px' }}>
                                <div className="training-form">
                                    <form>
                                        <div className='course'>
                                            <label>Selected Course</label>
                                            <Select
                                                getOptionLabel={(options) => {
                                                    return options["courseName"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["courseName"];
                                                }}
                                                value={defaultCourse}
                                                isDisabled={true}
                                            />
                                        </div>
                                        <div className='technology-multiselect mt-3'>
                                            <label>Update Technical Stack</label>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
                                                selectedValues={defaultTechnologyList}
                                                onSelect={onSelectTechnology}
                                                onRemove={onRemoveTechnology}
                                                displayValue="technologyName" //technologyName
                                                placeholder="Your Technical Stack"
                                                avoidHighlightFirstOption={true}
                                                style={{
                                                    chips: {
                                                        background: childColor,
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className='course-duration mt-3'>
                                            <label>Course Duration <strong>(Number of days)</strong></label>
                                            <input
                                                type='number'
                                                min={30}
                                                max={120}
                                                className='form-control'
                                                placeholder='Duration'
                                                value={courseDuration}
                                                onChange={handleCourseDurationChange}
                                            />
                                        </div>
                                        <div className='date-time mt-3'>
                                            <label>Select Training Start Date and Time <strong>(You can select after 3 days to current date)</strong></label>
                                            <Datetime
                                                value={courseStartDateAndTime}
                                                onChange={handleCourseStartDateChange}
                                                isValidDate={isValidDate}
                                                inputProps={{ 
                                                    placeholder: 'Select Date and Time',
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                        <div className="course-content-file mt-3">
                                            <label>Upload Course Content <strong>(max size is 5MB)</strong></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="courseContentFile"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCourseContentFile}
                                            />
                                        </div>
                                        <div className='intro-video-file mt-3'>
                                            <label>Upload Your Intro Video <strong>(1 minute) (max size is 5MB)</strong></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="introVideoFile"
                                                accept="video/*"
                                                onChange={handleIntroVideoFile}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            {updateTraingErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateTraingErrMsg}</label>
                                                </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='update-training-button'>
                                <Button
                                    className='dashboard-button'
                                    onClick={handleUpdateTraining}
                                >
                                    Update
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );

}

export default TrainerRejectedTrainings;
 */