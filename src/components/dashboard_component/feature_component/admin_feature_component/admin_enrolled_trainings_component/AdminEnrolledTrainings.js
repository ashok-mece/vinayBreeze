import './AdminEnrolledTrainings.css';
import { useEffect, useState } from "react";
import AdminService from "../../../../../Services/admin_service/AdminService";
import { Rating } from 'react-simple-star-rating';
import { Card, Container, Modal } from 'react-bootstrap';
import GlobalService from "../../../../../Services/global_service/GlobalService";
import Constants from "../../../../Constants";
import { CDBDataTable } from 'cdbreact';
import Datetime from 'react-datetime';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';

function AdminEnrolledTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getAdminEnrolledTrainingErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
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

        //await handleAdminEnrolledTrainings();

    }
    const [enrolledTrainings, setEnrolledTrainings] = useState([]);
    useEffect(() => {

    }, [enrolledTrainings]);
    const handleAdminEnrolledTrainings = async () => {
        setLoadingBar(true);
        const adminEnrolledTrainingRequest = {
            page: page,
            size: size,
        }
        try {
            const responseData = await AdminService.enrolledTrainings(adminEnrolledTrainingRequest);
            console.log(responseData);
            setIsLastPage(responseData.isLastPage);
            if (responseData.trainingWithTrainerList.length === 0) {
                getAdminEnrolledTrainingErrMsg('Enrolled trainings are not found');
                setEnrolledTrainings([]);
            } else {
                setEnrolledTrainings(responseData.trainingWithTrainerList);
            }
        } catch (error) {
            console.log(error.message);
            handleAdminEnrolledTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleAdminEnrolledTrainingErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getAdminEnrolledTrainingErrMsg("Sorry, Our service is down");
        else
            getAdminEnrolledTrainingErrMsg("Could not process your request");
    }

    useEffect(() => {
        handleAdminEnrolledTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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

    // view enrolled candidates modal with datatable code
    const [enrolledCandidates, setEnrolledCandidates] = useState([]);
    useEffect(() => {

    }, [enrolledCandidates]);
    const [selectedTraining, setSelectedTraining] = useState(0);
    const [showEnrolledCandidates, setShowEnrolledCandidates] = useState(false);
    const handleEnrolledCandidatesModalClose = () => {
        handleAdminEnrolledTrainings();
        setShowEnrolledCandidates(false);
        setSelectedTraining(0);
        setEnrolledCandidates([]);
    }
    const handleEnrollCandidateForTraining = async (trainingId) => {
        setLoadingBar(true);
        const viewEnrolledCandidatesByTrainingIdRequest = {
            trainingId: trainingId,
        }
        try {
            const responseData = await AdminService.viewEnrolledCandidatesByTrainingId(viewEnrolledCandidatesByTrainingIdRequest);
            console.log(responseData);
            if (responseData.length === 0) {
                getEnrolledCandidateModalErrMsg('Candidates are not found');
                setEnrolledCandidates(responseData);
            } else {
                setEnrolledCandidates(responseData);
                setSelectedTraining(trainingId);
                setShowEnrolledCandidates(true);
            }
        } catch (error) {
            console.log(error.message);
            handleViewEnrolledCandidatesErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewEnrolledCandidatesErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleTrainingCardErrMsg("Selected training is invalid", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleTrainingCardErrMsg("Sorry, Our service is down", trainingId);
        else
            handleTrainingCardErrMsg("Could not process your request", trainingId);
    }
    const enrolledCandidatesDataTableData = () => {
        const adminEnrolledCandidateAction = (candidateData) => {
            return (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className='enroll-status-confirmed-button'
                        onClick={() => handleAdminActionOnEnrolledCandidate(Constants.CONFIRMED, candidateData)}
                    >
                        Confirm
                    </button>
                    <button
                        className='enroll-status-withdraw-button'
                        onClick={() => handleAdminActionOnEnrolledCandidate(Constants.WITHDRAW, candidateData)}
                    >
                        Withdraw
                    </button>
                </div>
            );
        };
        const columns = [
            { label: 'First Name', field: 'userFirstname', width: 150 },
            { label: 'Last Name', field: 'userLastname', width: 150 },
            { label: 'Email', field: 'username', width: 200 },
            { label: 'Phone', field: 'phoneNumberWithCountryCode', width: 150 },
            { label: 'Gender', field: 'gender', width: 100 },
            { label: 'Action', field: 'admiAction', width: 150, formatter: adminEnrolledCandidateAction },
        ];
        const rows = enrolledCandidates.map(candidate => ({
            ...candidate,
            admiAction: adminEnrolledCandidateAction(candidate)
        }));
        return { columns, rows };
    };
    const handleAdminActionOnEnrolledCandidate = async (action, candidateData) => {
        setLoadingBar(true);
        console.log(candidateData);
        console.log(action);
        console.log(selectedTraining);
        const adminActionOnEnrolledCandidateRequest = {
            adminStatus: action,
            candidateId: candidateData.userId,
            trainingId: selectedTraining,
        }
        console.log(adminActionOnEnrolledCandidateRequest);
        try {
            const responseData = await AdminService.confirmOrWithdrawEnrolledCandidate(adminActionOnEnrolledCandidateRequest);
            console.log(responseData);
            if (Constants.CONFIRMED === action) {
                getEnrolledCandidateModalSucMsg('Successfully Confirmed Candidate');
            } else if (Constants.WITHDRAW === action) {
                getEnrolledCandidateModalSucMsg('Successfully Withdrawn Candidate');
            }
        } catch (error) {
            console.log(error.message);
            handleAdminActionOnEnrolledCandidateErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleAdminActionOnEnrolledCandidateErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getEnrolledCandidateModalErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            getEnrolledCandidateModalErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getEnrolledCandidateModalErrMsg("Sorry, Our service is down");
        else
            getEnrolledCandidateModalErrMsg("Could not process your request");
    }

    const [enrolledCandidateModalErrMsgDiv, setEnrolledCandidateModalErrMsgDiv] = useState(false);
    const [enrolledCandidateModalErrMsg, setEnrolledCandidateModalErrMsg] = useState("");
    //JS for to display err msg
    const getEnrolledCandidateModalErrMsg = (errorMessage) => {
        setEnrolledCandidateModalErrMsg(errorMessage);
        setEnrolledCandidateModalErrMsgDiv(true);
        setTimeout(() => {
            setEnrolledCandidateModalErrMsg("");
            setEnrolledCandidateModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const getEnrolledCandidateModalSucMsg = (errorMessage) => {
        setMessageColor('green');
        setEnrolledCandidateModalErrMsg(errorMessage);
        setEnrolledCandidateModalErrMsgDiv(true);
        setTimeout(() => {
            setEnrolledCandidateModalErrMsg("");
            setEnrolledCandidateModalErrMsgDiv(false);
            setMessageColor('#be3144');
            handleEnrollCandidateForTraining(selectedTraining);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    // update date and time modal code
    const [courseStartDateAndTime, setCourseStartDateAndTime] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate());
    const isValidDate = (current) => {
        return current.isAfter(minDate);
    };
    const handleCourseStartDateChange = (date) => {
        setCourseStartDateAndTime(date);
    };
    const [updateDateModal, setUpdateDateModal] = useState(false);
    const handleUpdateDateModalClose = () => {
        setUpdateDateModal(false);
        setTrainingWithTrainer(null);
        setCourseStartDateAndTime(null);
    }
    const [trainingWithTrainer, setTrainingWithTrainer] = useState(null);
    const handleUpdateDateButton = (trainingWithTrainer) => {
        setTrainingWithTrainer(trainingWithTrainer);
        setUpdateDateModal(true);
    }
    const handleUpdateDate = async (trainingId) => {
        console.log(trainingId);
        console.log(courseStartDateAndTime);
        if (courseStartDateAndTime === null) {
            updateDateModalDisplayErrMsg('please, select a date and time to update');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('trainingId', trainingId);
            formData.append('courseStartDateAndTimeString', courseStartDateAndTime);
            console.log(formData);
            try {
                const responseData = await AdminService.updateDateForTraining(formData);
                console.log(responseData);
                updateDateModalDisplaySucMsg('Succesfully Updated Date');
            } catch (error) {
                console.error('Error fetching data for path:', error);
                handleUpdateDateForTrainingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleUpdateDateForTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateDateModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateDateModalDisplayErrMsg("Training is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateDateModalDisplayErrMsg("Sorry, Our service is down");
        else
            updateDateModalDisplayErrMsg("Could not process your request");
    }

    const [updateDateModalErrMsgDiv, setUpdateDateModalErrMsgDiv] = useState(false);
    const [updateDateModalErrMsg, setUpdateDateModalErrMsg] = useState("");
    //JS for to display err msg
    const updateDateModalDisplayErrMsg = (errorMessage) => {
        setUpdateDateModalErrMsg(errorMessage);
        setUpdateDateModalErrMsgDiv(true);
        setTimeout(() => {
            setUpdateDateModalErrMsg("");
            setUpdateDateModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateDateModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateDateModalErrMsg(errorMessage);
        setUpdateDateModalErrMsgDiv(true);
        setTimeout(() => {
            setUpdateDateModalErrMsg("");
            setUpdateDateModalErrMsgDiv(false);
            setMessageColor('#be3144');
            handleUpdateDateModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [stopEnrollmentModal, setStopEnrollmentModal] = useState(false);
    const [stopEnrollmentTrainingId, setStopEnrollmentTrainingId] = useState(0);
    const handleStopEnrollmentModalClose = () => {
        setStopEnrollmentTrainingId(0);
        setStopEnrollmentModal(false);
    }
    const handleStopEnroll = (trainingId) => {
        console.log(trainingId);
        setStopEnrollmentTrainingId(trainingId);
        setStopEnrollmentModal(true);
    }
    const handleStopEnrollmentConfirm = async () => {
        setLoadingBar(true);
        console.log(stopEnrollmentTrainingId);
        const stopEnrollmentRequest = {
            trainingId: stopEnrollmentTrainingId,
        }
        try {
            const responseData = await AdminService.stopEnrollmentForTraining(stopEnrollmentRequest);
            console.log(responseData);
            stopEnrollmentModalDisplaySucMsg('Successfully Stopped Enrollment');
        } catch (error) {
            console.log(error.message);
            handleStopEnrollmentErros(error.message);          
        } finally {
            setLoadingBar(false);
        }
    }
    const handleStopEnrollmentErros = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            stopEnrollmentModalDisplayErrMsg("Training id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            stopEnrollmentModalDisplayErrMsg("Training is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            stopEnrollmentModalDisplayErrMsg("Sorry, Our service is down");
        else
            stopEnrollmentModalDisplayErrMsg("Could not process your request");
    }

    const [stopEnrollmentModalErrMsgDiv, setstopEnrollmentModalErrMsgDiv] = useState(false);
    const [stopEnrollmentModalErrMsg, setStopEnrollmentModalErrMsg] = useState("");
    //JS for to display err msg
    const stopEnrollmentModalDisplayErrMsg = (errorMessage) => {
        setStopEnrollmentModalErrMsg(errorMessage);
        setstopEnrollmentModalErrMsgDiv(true);
        setTimeout(() => {
            setStopEnrollmentModalErrMsg("");
            setstopEnrollmentModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const stopEnrollmentModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setStopEnrollmentModalErrMsg(errorMessage);
        setstopEnrollmentModalErrMsgDiv(true);
        setTimeout(() => {
            setStopEnrollmentModalErrMsg("");
            setstopEnrollmentModalErrMsgDiv(false);
            setMessageColor('#be3144');
            handleStopEnrollmentModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-enrolled-training-list' style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            { loadingBar && <LoadingBar /> }
            <div>
                <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {enrolledTrainings.map((item, index) => (
                        <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                            <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                                <div>
                                    <button
                                        className='update-date-button'
                                        onClick={() => handleUpdateDateButton(item)}
                                    >
                                        Update Date
                                    </button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label>Trainer : </label> <span>{item.trainer.userFirstname + " " + item.trainer.userLastname}</span>
                                        </div>
                                        <div>
                                            <label>Experience : </label> <span>{item.trainer.userExperience}</span>
                                        </div>
                                    </div>
                                    <label>Trainer Mail : </label> <span>{item.trainer.username}</span> <br />
                                    <label>Trainer Phone : </label> <span>{item.trainer.phoneNumberWithCountryCode}</span> <br />
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
                                            <label>Confirmed : </label> <span>{item.confirmedCandidatesCount}</span>
                                        </div>
                                        <div>
                                            <label>Pending : </label> <span>{item.pendingCandidatesCount}</span>
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
                                        <Card.Link
                                            style={{ cursor: 'pointer', fontSize: '11px' }}
                                            onClick={() => handleOpenCourseContent(item.training.courseContent, item.training.trainingId)}
                                        >
                                            Course Content
                                        </Card.Link>
                                        <Card.Link
                                            style={{ cursor: 'pointer', fontSize: '11px' }}
                                            onClick={() => handleOpenIntroVideo(item.training.introVideo, item.training.trainingId)}
                                        >
                                            Intro Video
                                        </Card.Link>
                                        <button
                                            className='enrolled-count-button'
                                            onClick={() => handleEnrollCandidateForTraining(item.training.trainingId)}
                                            disabled={item.pendingCandidatesCount === 0}
                                        >
                                            {item.enrolledCandidatesCount}
                                            - Enrolled
                                        </button>
                                        <button
                                            className='stop-enrolled-button'
                                            onClick={() => handleStopEnroll(item.training.trainingId)}
                                            disabled={!(item.pendingCandidatesCount === 0 && item.enrolledCandidatesCount !== 0)}
                                        >
                                            Stop Enroll
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
            </div>
            {enrolledTrainings.length !== 0 && (
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
            {showEnrolledCandidates && (
                <Modal className='enrolled-candidates-for-training-modal' size='xl' show={showEnrolledCandidates} onHide={handleEnrolledCandidatesModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Enrolled Candidates</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                {/* <CDBContainer> */}
                                {/* <CDBCard> */}
                                {/* <CDBCardBody> */}
                                <CDBDataTable
                                    striped
                                    bordered
                                    hover
                                    entriesOptions={[5, 10, 20, 25]}
                                    entries={5}
                                    pagesAmount={4}
                                    data={enrolledCandidatesDataTableData()}
                                    // scrollX
                                    materialSearch={true}
                                    responsive={true}
                                    className='cdb-datatable'
                                />
                                {/* </CDBCardBody> */}
                                {/* </CDBCard> */}
                                {/* </CDBContainer> */}
                            </div>
                        </Modal.Body>
                    </Container>
                    <div className='my-2' style={{ textAlign: 'center' }}>
                        {enrolledCandidateModalErrMsgDiv &&
                            <div style={customCssForMsg}>
                                <label>{enrolledCandidateModalErrMsg}</label>
                            </div>}
                    </div>
                </Modal>
            )}
            {updateDateModal && (
                <Modal className='update-date-modal' size='lg' show={updateDateModal} onHide={handleUpdateDateModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Update Date
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='training-data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Trainer Data</label> <br />
                                    <label>Trainer Name : </label> <span>{trainingWithTrainer.trainer.userFirstname + " " + trainingWithTrainer.trainer.userLastname}</span> <br />
                                    <label>Experience : </label> <span>{trainingWithTrainer.trainer.userExperience}</span> <br />
                                    <label>Trainer Mail : </label> <span>{trainingWithTrainer.trainer.username}</span> <br />
                                    <label>Trainer Phone : </label> <span>{trainingWithTrainer.trainer.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Training Data</label> <br />
                                    <label>Course : </label> <span>{trainingWithTrainer.training.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{trainingWithTrainer.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Course Duration : </label> <span>{trainingWithTrainer.training.courseDuration + " days"}</span> <br />
                                    <label>Course Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(trainingWithTrainer.training.courseStartDateAndTime)).date}</span> <br />
                                    <label>Course Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(trainingWithTrainer.training.courseStartDateAndTime)).time)}</span> <br />
                                    <label>Session Duration : </label> <span>{trainingWithTrainer.training.sessionDuration}</span> <br />
                                </div>
                                <div className='date-time mt-2'>
                                    <label>Update Training Start Date and Time</label>
                                    <Datetime
                                        value={courseStartDateAndTime}
                                        onChange={handleCourseStartDateChange}
                                        isValidDate={isValidDate}
                                        inputProps={{
                                            placeholder: 'Update Date and Time',
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                                <div className='mt-2'>
                                    {updateDateModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{updateDateModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    className='update-date-modal-button'
                                    onClick={() => handleUpdateDate(trainingWithTrainer.training.trainingId)}
                                >
                                    Update Date
                                </button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
            {stopEnrollmentModal && (
                <Modal className='stop-enrollment-modal' style={{fontSize:'13px'}} size='md' show={stopEnrollmentModal} onHide={handleStopEnrollmentModalClose} centered backdrop="static">
                    <Container className='px-3'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '15px' }}>
                                Confirm Stopping Enrollment
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <label><span style={{color:'red'}}>*</span>Once Enrollment is Stopped, Candidates cannot Enroll for Training.</label><br />
                                <label><span style={{color:'red'}}>*</span>And Once Enrollment Stopped cannot Start Enrollment Again.</label><br />
                            </div>
                            <div className='mt-2'>
                                    {stopEnrollmentModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{stopEnrollmentModalErrMsg}</label>
                                        </div>}
                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{display:'flex', gap:'10px'}}>
                                <button
                                    className='confirm-button'
                                    onClick={handleStopEnrollmentConfirm}
                                >
                                    Confirm
                                </button>
                                <button
                                    className='cancel-button'
                                    onClick={handleStopEnrollmentModalClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Modal.Footer>
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

export default AdminEnrolledTrainings;