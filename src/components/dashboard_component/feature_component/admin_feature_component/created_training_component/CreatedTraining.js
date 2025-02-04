import { useEffect, useState } from 'react';
import './CreatedTraining.css';
import { Card, Container, Modal } from "react-bootstrap";
import AdminService from '../../../../../Services/admin_service/AdminService';
import Constants from '../../../../Constants';
import { Rating } from 'react-simple-star-rating';
import GlobalService from '../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';

function CreatedTraining() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 9;

    const disablePrevious = page === 0;
    const disableNext = isLastPage;

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setTrainerAndTrainingData(null);
        setCourseContentUrl('');
        setIntroVideoUrl('');
        setRating(0);
        setDescription('');
    };

    const handlePreviousNext = async (event) => {
        const buttonId = event.target.id;
        if (buttonId === 'prevBtn') {
            if (page > 0) {
                setPage(page - 1);
            }
        } else {
            setPage(page + 1);
        }

        //await getHoldTrainingsOnPage();

    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const trainingsWithTrainersDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }
    //JS for to display success msg
    const trainingsWithTrainersDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [trainingsWithTrainers, setTrainingsWithTrainers] = useState([]);
    const getHoldTrainingsOnPage = async () => {
        setLoadingBar(true);
        const request = {
            page: page,
            size: size,
        }

        try {
            const responseData = await AdminService.getHoldTrainingsOnPage(request);
            console.log(responseData);

            setIsLastPage(responseData.isLastPage);
            setTrainingsWithTrainers(responseData.trainingWithTrainerList);
            if (responseData.trainingWithTrainerList.length === 0) {
                trainingsWithTrainersDisplayErrMsg('Trainings were not Created');
            }
        } catch (error) {
            console.log(error.message);
            handletrainingsWithTrainersErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const handletrainingsWithTrainersErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            trainingsWithTrainersDisplayErrMsg("Sorry, Our service is down");
        else
            trainingsWithTrainersDisplayErrMsg("Could not process your request");
    }

    useEffect(() => {
        getHoldTrainingsOnPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [viewClicked, setViewClicked] = useState(0);
    const [viewClickedErrMsg, setViewClickedErrMsg] = useState('');
    const [trainerAndTrainingData, setTrainerAndTrainingData] = useState(null);
    const [courseContentUrl, setCourseContentUrl] = useState('');
    const handleOpenCourseContent = (event) => {
        event.preventDefault();
        window.open(courseContentUrl, '_blank');
    };
    const [introVideoUrl, setIntroVideoUrl] = useState('');
    const handleViewHoldTraining = async (trainingId) => {
        setLoadingBar(true);
        console.log(trainingId);
        const request = {
            trainingId: trainingId,
        }

        try {
            const responseData = await AdminService.viewHoldTraining(request);
            console.log(responseData);
            setTrainerAndTrainingData(responseData);

            const courseContentRequest = {
                courseContent: responseData?.training.courseContent,
            }
            const courseContentResponse = await GlobalService.getCourseContentByPath(courseContentRequest);
            console.log(courseContentResponse);
            const courseContentFile = new Blob([courseContentResponse.data], { type: courseContentResponse.headers['content-type'] });
            const courseContentFileUrl = URL.createObjectURL(courseContentFile);
            setCourseContentUrl(courseContentFileUrl);

            const introVideoRequest = {
                introVideo: responseData?.training.introVideo,
            }
            const introVideoResponse = await GlobalService.getIntroVideoByPath(introVideoRequest);
            console.log(introVideoResponse);
            const introVideoFileUrl = URL.createObjectURL(introVideoResponse.data);
            setIntroVideoUrl(introVideoFileUrl);

            if (responseData && courseContentResponse && introVideoResponse) {
                setShowModal(true);
            }
        } catch (error) {
            console.log(error.message);
            handleViewHoldTrainingErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleViewHoldTrainingErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleViewHoldTrainingErrMsg("Training id is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleViewHoldTrainingErrMsg("Training Not Found", trainingId);
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            handleViewHoldTrainingErrMsg("Files Not Exist", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleViewHoldTrainingErrMsg("Sorry, Our service is down", trainingId);
        else
            handleViewHoldTrainingErrMsg("Could not process your request", trainingId);
    }

    const handleViewHoldTrainingErrMsg = (errorMessage, trainingId) => {
        setViewClickedErrMsg(errorMessage);
        setViewClicked(trainingId);
        setTimeout(() => {
            setViewClickedErrMsg('');
            setViewClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [rating, setRating] = useState(0)
    const handleDefaultRating = (rate) => {
        setRating(rate)
    }
    const [ratingErrMsgDiv, setRatingErrMsgDiv] = useState(false);
    const [ratingErrMsg, setRatingErrMsg] = useState("");
    //JS for to display err msg
    const ratingDisplayErrMsg = (errorMessage) => {
        setRatingErrMsg(errorMessage);
        setRatingErrMsgDiv(true);
        setTimeout(() => {
            setRatingErrMsg("");
            setRatingErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [description, setDescription] = useState('')
    const handleDescription = (event) => {
        setDescription(event.target.value);
    }
    const [descriptionErrMsgDiv, setDescriptionErrMsgDiv] = useState(false);
    const [descriptionErrMsg, setDescriptionErrMsg] = useState("");
    //JS for to display err msg
    const descriptionDisplayErrMsg = (errorMessage) => {
        setDescriptionErrMsg(errorMessage);
        setDescriptionErrMsgDiv(true);
        setTimeout(() => {
            setDescriptionErrMsg("");
            setDescriptionErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const handleChangeAdminStatus = async (adminStatus, trainingId) => {
        
        const changeAdminStatusRequest = {
            trainingId: trainingId,
            adminStatus: adminStatus,
            rating: rating,
            description: description,
        }

        if (adminStatus === Constants.APPROVED) {
            console.log('approve');
            if (rating === 0) {
                ratingDisplayErrMsg('default rating is mandatory to approve');
                return;
            }
            changeAdminStatusRequest.description = '';
        } else if (adminStatus === Constants.REJECTED) {
            console.log('reject');
            if (description.trim() === '') {
                descriptionDisplayErrMsg('description is mandatory to reject');
                return;
            }
            changeAdminStatusRequest.rating = 0;
        }
        setLoadingBar(true);
        try {
            const responseData = await AdminService.changeAdminStatus(changeAdminStatusRequest);
            console.log(responseData);
            changeAdminStatusDisplaySucMsg('Admin Changed Status Succesfully');
        } catch (error) {
            console.log(error.message);
            handleChangeAdminStatusError(error.message);
        } finally {
            setLoadingBar(false);
        }

    }

    const handleChangeAdminStatusError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            changeAdminStatusDisplayErrMsg("please give valid inputs");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            changeAdminStatusDisplayErrMsg("Training Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            changeAdminStatusDisplayErrMsg("Sorry, Our service is down");
        else
            changeAdminStatusDisplayErrMsg("Could not process your request");
    }

    const [changeAdminStatusErrMsgDiv, setChangeAdminStatusErrMsgDiv] = useState(false);
    const [changeAdminStatusErrMsg, setChangeAdminStatusErrMsg] = useState("");
    //JS for to display err msg
    const changeAdminStatusDisplayErrMsg = (errorMessage) => {
        setChangeAdminStatusErrMsg(errorMessage);
        setChangeAdminStatusErrMsgDiv(true);
        setTimeout(() => {
            setChangeAdminStatusErrMsg("");
            setChangeAdminStatusErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const changeAdminStatusDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setChangeAdminStatusErrMsg(errorMessage);
        setChangeAdminStatusErrMsgDiv(true);
        setTimeout(() => {
            setChangeAdminStatusErrMsg("");
            setChangeAdminStatusErrMsgDiv(false);
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

    return ( //maxHeight: 'calc(100vh - 150px)' trainer training 17rem
        <div className="created-trainings" style={{ fontSize: '14px' }}>
            { loadingBar && <LoadingBar /> }
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {trainingsWithTrainers.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='training'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Training</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='view-button'
                                            onClick={() => handleViewHoldTraining(item.training.trainingId)}
                                        >
                                            View
                                        </button>
                                    </div>
                                    <label>Trainer-Id : </label> <span>{item.trainer.userId}</span> <br />
                                    <label>Trainer-Name : </label> <span>{item.trainer.userFirstname + " " + item.trainer.userLastname}</span> <br />
                                    <label>Course : </label> <span>{item.training.courseName}</span>
                                </div>
                                {viewClicked === item.training.trainingId && (
                                    <div style={customCssForMsg}>
                                        <label>{viewClickedErrMsg}</label>
                                    </div>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                <div>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
            </div>
            {trainingsWithTrainers.length !== 0 && (
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
            {showModal && (
                <Modal className='view-hold-training-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Trainer And Training Data
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='trainer-and-training-data'>
                                <div className='trainer-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Trainer Data</label> <br />
                                    <label>Trainer-Id : </label> <span>{trainerAndTrainingData.trainer.userId}</span> <br />
                                    <label>Trainer-Name : </label> <span>{trainerAndTrainingData.trainer.userFirstname + " " + trainerAndTrainingData.trainer.userLastname}</span> <br />
                                    <label>Trainer-Mail : </label> <span>{trainerAndTrainingData.trainer.username}</span> <br />
                                    <label>Trainer-Phone : </label> <span>{trainerAndTrainingData.trainer.phoneNumberWithCountryCode}</span> <br />
                                    <label>Trainer-Experience : </label> <span>{trainerAndTrainingData.trainer.userExperience + ' years'}</span> <br />
                                    <label>Trainer-Technical-Stack : </label> <span>{trainerAndTrainingData.trainer.technologyList.map(tech => tech.technologyName).join(', ')}</span>
                                </div>
                                <div className='training-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Training Data</label> <br />
                                    <label>Course : </label> <span>{trainerAndTrainingData.training.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{trainerAndTrainingData.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Course Duration : </label> <span>{trainerAndTrainingData.training.courseDuration+" days"}</span> <br />
                                    <label>Course Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(trainerAndTrainingData.training.courseStartDateAndTime)).date}</span> <br />
                                    <label>Course Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(trainerAndTrainingData.training.courseStartDateAndTime)).time)}</span> <br />
                                    <label>Session Duration : </label> <span>{trainerAndTrainingData.training.sessionDuration}</span> <br />
                                    <label>Course Content Link : </label>
                                    <span>
                                        <button
                                            onClick={handleOpenCourseContent}
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
                                    </span> <br /> {/**<a href="#" onClick={handleOpenCourseContent}>Open Course Content</a> */}
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        {introVideoUrl && (
                                            <div className="file-preview-container">
                                                <label>Intro Video :</label>
                                                <div className="embed-responsive embed-responsive-16by9">
                                                    <video src={introVideoUrl} className='responsive-video embed-responsive-item' controls autoPlay muted />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='default-rating col-md-6 col-12'>
                                        <label>Default Rating</label> <br />
                                        <Rating
                                            allowFraction
                                            transition
                                            fillColor='#1b4962'
                                            allowHover={false}
                                            size={25}
                                            showTooltip={true}
                                            onClick={handleDefaultRating}
                                        />
                                        <div>
                                            {ratingErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{ratingErrMsg}</label>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className='description col-md-6 col-12'>
                                        <label>Description</label>
                                        <textarea
                                            className='form-control'
                                            value={description}
                                            onChange={handleDescription}
                                            placeholder="Type description..."
                                        >
                                        </textarea>
                                        <div>
                                            {descriptionErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{descriptionErrMsg}</label>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {changeAdminStatusErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{changeAdminStatusErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    className='modal-button'
                                    onClick={() => handleChangeAdminStatus(Constants.APPROVED, trainerAndTrainingData.training.trainingId)}
                                >
                                    Approve
                                </button>
                                <button
                                    className='modal-button'
                                    onClick={() => handleChangeAdminStatus(Constants.REJECTED, trainerAndTrainingData.training.trainingId)}
                                >
                                    Reject
                                </button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );

}

export default CreatedTraining;

/**
 * <div className="row mt-3">
                                    <div className="col-md-6 col-12">
                                        {courseContentUrl && (
                                            <div className="file-preview-container">
                                                <label>Course Content</label> <br />
                                                <iframe src={courseContentUrl} title="Course Content Preview" className='responsive-iframe' />
                                                <button onClick={handleOpenCourseContent} className='dashboard-button'>Open PDF In New Tab</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12">
                                        {introVideoUrl && (
                                            <div className="file-preview-container">
                                                <label>Intro Video</label>
                                                <video src={introVideoUrl} className='responsive-video' controls autoPlay muted />
                                            </div>
                                        )}
                                    </div>
                                </div>
 */

/**
 * <div className='d-flex mt-3'>
                                    <div style={{ width: '49%', height: '200px' }}>
                                        {courseContentUrl && (
                                            <div>
                                                <label>Course Content</label> <br />
                                                <iframe src={courseContentUrl} title="File Preview" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ width: '50%', height: '200px' }}>
                                        {introVideoUrl && (
                                            <div>
                                                <label>Intro Video</label>
                                                <video src={introVideoUrl} width={'100%'} height={'170px'} controls autoPlay muted />
                                            </div>
                                        )}
                                    </div>
                                </div>
 */

/**
 * /* <Card.Link href="#">Course Content</Card.Link>
                            <Card.Link href="#">Intro Video</Card.Link>
 */

/**
 * {/* <div className='training mt-2'>
                                    <label style={{ textDecoration: 'underline',fontSize: '16px' }}>Training</label> <br />
                                    <label>Course : </label> <span>{item.training.courseName}</span> <br />
                                    <label>Technical Stack : </label> <span>{item.training.technologyList.map(tech => tech.technologyName).join(', ')}</span>
                                </div> */
/* <div style={{display:'flex',justifyContent:'flex-end'}}>
    <button
        style={{fontSize:'10px !important'}}
        className='dashboard-button'
    >
        View
    </button>
</div>
*/

/**
 * <div className="created-trainins">
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {trainingList.map((item, index) => (
                    <Card key={index} style={{ width: '23rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Title>{item.firstname + " " + item.lastname}</Card.Title>
                            <Card.Subtitle className=" text-muted">Subtitle</Card.Subtitle>
                            <Card.Text>
                                Technical Stack: {item.technicalStack} <br />
                                Years of Exp: {item.yearsOfExp}
                            </Card.Text>
                            <Card.Link href="#">Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className='prev-next-div'>
                <button className='dashboard-button' 
                        id='prevBtn'
                        onClick={handlePreviousNext} 
                        disabled={disablePrevious}
                >
                    previous
                </button>
                <button className='dashboard-button' 
                        id='nextBtn'
                        style={{ marginLeft: '20px' }} 
                        onClick={handlePreviousNext} 
                        disabled={disableNext}
                >
                    next
                </button>
            </div>
        </div>
 */