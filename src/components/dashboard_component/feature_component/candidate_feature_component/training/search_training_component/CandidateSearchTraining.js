import './CandidateSearchTraining.css';
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import { Rating } from 'react-simple-star-rating';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CandidateSearchTraining() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    // const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

    // course code
    const [courses, setCourses] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const onSelectCourse = (selectedList, selectedItem) => {
        setCourses([...selectedList]);
        console.log(selectedItem);
    }
    const onRemoveCourse = (selectedList, removedItem) => {
        setCourses([...selectedList]);
        console.log(courses);
        console.log(removedItem);
    }

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getAllCourseDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        getAllCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllCourse = async () => {
        setLoadingBar(true);
        try {
            const responseData = await GlobalService.getAllCourse();
            console.log(responseData);
            if (responseData.length === 0) {
                getAllCourseDisplayErrMsg('Courses are not found');
            } else {
                setCoursesList(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleGetAllCourseErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    };

    const handleGetAllCourseErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getAllCourseDisplayErrMsg("Sorry, Our service is down");
        else
            getAllCourseDisplayErrMsg("Could not process your request");
    }

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 6;
    const disablePrevious = page === 0;
    const disableNext = isLastPage;
    const handlePreviousNext = async (event) => {
        const buttonId = event.target.id;
        if (buttonId === 'prevBtn') {
            if (page > 0) {
                setPage(page - 1);
            }
        } else {
            setPage(page + 1);
        }
    }

    useEffect(() => {
        handleSearchTrainingsByCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [approvedTrainings, setApprovedTrainings] = useState([]);
    const handleSearchTrainingsByCourses = async () => {
        console.log(courses);
        if (!Array.isArray(courses) || courses.length === 0) {
            getAllCourseDisplayErrMsg("please select atleast one course to search trainings");
            setApprovedTrainings([]); 
        } else {
            setLoadingBar(true);
            const request = {
                courseList: courses,
                page: page,
                size: size,
            }
            try {
                const responseData = await GlobalService.searchTrainingsByCourses(request);
                console.log(responseData);
                setIsLastPage(responseData.isLastPage);
                if (responseData.trainingWithTrainerList.length === 0) {
                    getAllCourseDisplayErrMsg('Trainings are not found');
                    setApprovedTrainings([]);
                } else {
                    setApprovedTrainings(responseData.trainingWithTrainerList);
                }
            } catch (error) {
                console.log(error.message); 
                // handleGetAllCourseErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
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

    const handleEnrollCandidateForTraining = async (trainingId, courseId) => {
        setLoadingBar(true);
        console.log(trainingId+" "+courseId);
        try {
            const enrollCandidateForTrainingRequest = {
                candidateId: localStorage.getItem('breezeUserId'),
                trainingId: trainingId,
                courseId: courseId,
            } 
            console.log(enrollCandidateForTrainingRequest);
            const enrollCandidateForTrainingResponse = await CandidateService.enrollCandidateForTraining(enrollCandidateForTrainingRequest);
            console.log(enrollCandidateForTrainingResponse);
            handleTrainingCardSucMsg('Enrolled, Admin will confirm with you', trainingId);    
        } catch (error) {
            console.log(error);
            handleEnrollCandidateForTrainingErrors(error.message, trainingId);      
        } finally {
            setLoadingBar(false);
        }
    }
    const handleEnrollCandidateForTrainingErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleTrainingCardErrMsg("Sorry, inputs are not valid", trainingId);
        else if (Constants.ALREADY_ENROLLED_FOR_SELECTED_COURSE === errorStatus)
            handleTrainingCardErrMsg("You have already enrolled for this course", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleTrainingCardErrMsg("Sorry, Our service is down", trainingId);
        else
            handleTrainingCardErrMsg("Could not process your request", trainingId); 
    }

    const handleTrainingCardSucMsg = (errorMessage, trainingId) => {
        setMessageColor('green');
        setTrainingCardErr(errorMessage); 
        setTrainingCard(trainingId);
        setTimeout(() => {
            setTrainingCardErr(''); 
            setTrainingCard(0);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className="training-list">
            { loadingBar && <LoadingBar /> }
            <div className='course-multiselect' style={{ fontSize: '13px' }}>
                <label>Select Courses</label>
                <Row className='d-flex justify-content-between flex-wrap'>
                    <Col xs={12} sm={8} className='mb-2'>
                        <Multiselect
                            id='course'
                            options={coursesList}
                            onSelect={onSelectCourse}
                            onRemove={onRemoveCourse}
                            displayValue="courseName"
                            placeholder="Select Course"
                            avoidHighlightFirstOption={true}
                            style={{
                                chips: {
                                    background: childColor,
                                },
                            }}
                        />
                    </Col>
                    <Col xs={12} sm={4} className='mb-2'>
                        <Button
                            className='search-button-horizontal'
                            onClick={handleSearchTrainingsByCourses}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
                <div className=''>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
            </div>
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {approvedTrainings.map((item, index) => (
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
                                        <label>Course Duration : </label> <span>{item.training.courseDuration+" days"}</span>
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
                                <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                <span>
                                    <Rating
                                        size={20}
                                        initialValue={item.training.rating}
                                        allowFraction
                                        fillColor='#1b4962'
                                        readonly={true}
                                    />
                                </span> <br />
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
                                    <button 
                                        className='enroll-button'
                                        onClick={() => handleEnrollCandidateForTraining(item.training.trainingId, item.training.courseId)}
                                    >
                                        Enroll
                                    </button>
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
            {approvedTrainings.length !== 0 && (
                <div className='prev-next-div'>
                    <button className='dashboard-button'
                        id='prevBtn'
                        onClick={handlePreviousNext}
                        disabled={disablePrevious}
                    >
                        {'< '}previous
                    </button>
                    <button className='dashboard-button'
                        id='nextBtn'
                        style={{ marginLeft: '20px' }}
                        onClick={handlePreviousNext}
                        disabled={disableNext}
                    >
                        next{' >'}
                    </button>
                </div>
            )}
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

export default CandidateSearchTraining;


/**======================================================================================== */


/**
 * import './CandidateSearchTraining.css';
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import { Rating } from 'react-simple-star-rating';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CandidateSearchTraining() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    // const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

    // technology code
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        setTechnologies([...selectedList]);
        console.log(selectedItem);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
        console.log(removedItem);
    }

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getAllTechnologyDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        getAllTechnology();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllTechnology = async () => {
        setLoadingBar(true);
        try {
            const responseData = await GlobalService.getAllTechnology();
            console.log(responseData);
            if (responseData.length === 0) {
                getAllTechnologyDisplayErrMsg('Technologies are not found');
            } else {
                setTechnologiesList(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleGetAllTechnologyErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    };

    const handleGetAllTechnologyErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getAllTechnologyDisplayErrMsg("Sorry, Our service is down");
        else
            getAllTechnologyDisplayErrMsg("Could not process your request");
    }

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 6;
    const disablePrevious = page === 0;
    const disableNext = isLastPage;
    const handlePreviousNext = async (event) => {
        const buttonId = event.target.id;
        if (buttonId === 'prevBtn') {
            if (page > 0) {
                setPage(page - 1);
            }
        } else {
            setPage(page + 1);
        }
    }

    useEffect(() => {
        handleSearchTrainingsByTechnologies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [approvedTrainings, setApprovedTrainings] = useState([]);
    const handleSearchTrainingsByTechnologies = async () => {
        console.log(technologies);
        if (!Array.isArray(technologies) || technologies.length === 0) {
            getAllTechnologyDisplayErrMsg("please select atleast one technology to search trainings");
            setApprovedTrainings([]); 
        } else {
            setLoadingBar(true);
            const request = {
                technologyList: technologies,
                page: page,
                size: size,
            }
            try {
                const responseData = await GlobalService.searchTrainingsByTechnologies(request);
                console.log(responseData);
                setIsLastPage(responseData.isLastPage);
                if (responseData.trainingWithTrainerList.length === 0) {
                    getAllTechnologyDisplayErrMsg('Trainings are not found');
                } else {
                    setApprovedTrainings(responseData.trainingWithTrainerList);
                }
            } catch (error) {
                console.log(error.message); 
                // handleGetAllTechnologyErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
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

    const handleEnrollCandidateForTraining = async (trainingId, courseId) => {
        setLoadingBar(true);
        console.log(trainingId+" "+courseId);
        try {
            const enrollCandidateForTrainingRequest = {
                candidateId: localStorage.getItem('breezeUserId'),
                trainingId: trainingId,
                courseId: courseId,
            } 
            console.log(enrollCandidateForTrainingRequest);
            const enrollCandidateForTrainingResponse = await CandidateService.enrollCandidateForTraining(enrollCandidateForTrainingRequest);
            console.log(enrollCandidateForTrainingResponse);
            handleTrainingCardSucMsg('Enrolled, Admin will confirm with you', trainingId);    
        } catch (error) {
            console.log(error);
            handleEnrollCandidateForTrainingErrors(error.message, trainingId);      
        } finally {
            setLoadingBar(false);
        }
    }
    const handleEnrollCandidateForTrainingErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleTrainingCardErrMsg("Sorry, inputs are not valid", trainingId);
        else if (Constants.ALREADY_ENROLLED_FOR_SELECTED_COURSE === errorStatus)
            handleTrainingCardErrMsg("You have already enrolled for this course", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleTrainingCardErrMsg("Sorry, Our service is down", trainingId);
        else
            handleTrainingCardErrMsg("Could not process your request", trainingId); 
    }

    const handleTrainingCardSucMsg = (errorMessage, trainingId) => {
        setMessageColor('green');
        setTrainingCardErr(errorMessage); 
        setTrainingCard(trainingId);
        setTimeout(() => {
            setTrainingCardErr(''); 
            setTrainingCard(0);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className="training-list">
            { loadingBar && <LoadingBar /> }
            <div className='technology-multiselect' style={{ fontSize: '13px' }}>
                <label>Select Technologies</label>
                <Row className='d-flex justify-content-between flex-wrap'>
                    <Col xs={12} sm={8} className='mb-2'>
                        <Multiselect
                            id='technology'
                            options={technologiesList}
                            onSelect={onSelectTechnology}
                            onRemove={onRemoveTechnology}
                            displayValue="technologyName"
                            placeholder="Technical Stack"
                            avoidHighlightFirstOption={true}
                            style={{
                                chips: {
                                    background: childColor,
                                },
                            }}
                        />
                    </Col>
                    <Col xs={12} sm={4} className='mb-2'>
                        <Button
                            className='search-button-horizontal'
                            onClick={handleSearchTrainingsByTechnologies}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
                <div className=''>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
            </div>
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {approvedTrainings.map((item, index) => (
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
                                        <label>Course Duration : </label> <span>{item.training.courseDuration+" days"}</span>
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
                                <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                <span>
                                    <Rating
                                        size={20}
                                        initialValue={item.training.rating}
                                        allowFraction
                                        fillColor='#1b4962'
                                        readonly={true}
                                    />
                                </span> <br />
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
                                    <button 
                                        className='enroll-button'
                                        onClick={() => handleEnrollCandidateForTraining(item.training.trainingId, item.training.courseId)}
                                    >
                                        Enroll
                                    </button>
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
            {approvedTrainings.length !== 0 && (
                <div className='prev-next-div'>
                    <button className='dashboard-button'
                        id='prevBtn'
                        onClick={handlePreviousNext}
                        disabled={disablePrevious}
                    >
                        {'< '}previous
                    </button>
                    <button className='dashboard-button'
                        id='nextBtn'
                        style={{ marginLeft: '20px' }}
                        onClick={handlePreviousNext}
                        disabled={disableNext}
                    >
                        next{' >'}
                    </button>
                </div>
            )}
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

export default CandidateSearchTraining;
 */