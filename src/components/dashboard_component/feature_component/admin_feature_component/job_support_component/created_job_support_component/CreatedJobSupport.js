import './CreatedJobSupport.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import { Card, Container, Modal } from 'react-bootstrap';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Rating } from 'react-simple-star-rating';
import { useEffect, useState } from 'react';

function CreatedJobSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 12;

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

        //await getHoldJobSupportingsOnPage();

    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg 
    const jobSupportWithJobSupporterDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }
    //JS for to display success msg
    const jobSupportWithJobSupporterDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [jobSupportWithJobSupporter, setJobSupportWithJobSupporter] = useState([]);
    const getHoldJobSupportingsOnPage = async () => {
        setLoadingBar(true);
        const request = {
            page: page,
            size: size,
        }

        try {
            const responseData = await AdminService.getHoldJobSupportingsOnPage(request);
            console.log(responseData);

            setIsLastPage(responseData.isLastPage);
            setJobSupportWithJobSupporter(responseData.jobSupportWithJobSupporterList);
            if (responseData.jobSupportWithJobSupporterList.length === 0) {
                jobSupportWithJobSupporterDisplayErrMsg('Job Supports are not found');
            }
        } catch (error) {
            console.log(error.message);
            handleJobSupportWithJobSupporterErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleJobSupportWithJobSupporterErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            jobSupportWithJobSupporterDisplayErrMsg("Sorry, Our service is down");
        else
            jobSupportWithJobSupporterDisplayErrMsg("Could not process your request");
    }

    useEffect(() => {
        getHoldJobSupportingsOnPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [viewClicked, setViewClicked] = useState(0);
    const [viewClickedErrMsg, setViewClickedErrMsg] = useState('');
    const [jobSupportWithJobSupporterData, setJobSupportWithJobSupporterData] = useState(null);
    const handleViewHoldJobSupporting = async (jobSupportId) => {
        setLoadingBar(true);
        console.log(jobSupportId);
        const request = {
            jobSupportId: jobSupportId,
        }

        try {
            const responseData = await AdminService.viewHoldJobSupporting(request);
            console.log(responseData);
            setJobSupportWithJobSupporterData(responseData);
            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewHoldJobSupportingErrors(error.message, jobSupportId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleViewHoldJobSupportingErrors = (errorStatus, jobSupportId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleViewHoldJobSupportingErrMsg("Job Support id is invalid", jobSupportId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleViewHoldJobSupportingErrMsg("Job Support is Not Found", jobSupportId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleViewHoldJobSupportingErrMsg("Sorry, Our service is down", jobSupportId);
        else
            handleViewHoldJobSupportingErrMsg("Could not process your request", jobSupportId);
    }

    const handleViewHoldJobSupportingErrMsg = (errorMessage, jobSupportId) => {
        setViewClickedErrMsg(errorMessage);
        setViewClicked(jobSupportId);
        setTimeout(() => {
            setViewClickedErrMsg('');
            setViewClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setJobSupportWithJobSupporterData(null);
        setRating(0);
        setDescription('');
    };

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

    const handleChangeAdminStatus = async (adminStatus, jobSupportId) => {
        
        const changeAdminStatusRequest = {
            jobSupportId: jobSupportId,
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
            const responseData = await AdminService.changeAdminStatusForJobSupport(changeAdminStatusRequest);
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
            changeAdminStatusDisplayErrMsg("Job Support is Not Found");
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

    return (
        <div className='created-job-supports' style={{ fontSize: '14px' }}>
            { loadingBar && <LoadingBar /> }
            <div className='mt-4' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {jobSupportWithJobSupporter.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='job-support'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Support</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='view-button'
                                            onClick={() => handleViewHoldJobSupporting(item.jobSupport.jobSupportId)}
                                        >
                                            View
                                        </button>
                                    </div>
                                    <label>Job Supporter-Id : </label> <span>{item.jobSupporter.userId}</span> <br />
                                    <label>Job Supporter-Name : </label> <span>{item.jobSupporter.userFirstname + " " + item.jobSupporter.userLastname}</span> <br />
                                    <label>Technical Stack : </label> <span>{item.jobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span>
                                </div>
                                {viewClicked === item.jobSupport.jobSupportId && (
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
            {jobSupportWithJobSupporter.length !== 0 && (
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
                <Modal className='view-hold-job-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                            Job Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-and-job-supporter-data'>
                                <div className='job-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Id : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.userId}</span> <br />
                                    <label>Job Supporter-Name : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.userFirstname + " " + jobSupportWithJobSupporterData.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Mail : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.username}</span> <br />
                                    <label>Job Supporter-Phone : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.phoneNumberWithCountryCode}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.userExperience + ' years'}</span> <br />
                                    <label>Job Supporter-Technical-Stack : </label> <span>{jobSupportWithJobSupporterData.jobSupporter.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                </div>
                                <div className='job-support-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Support Data</label> <br />
                                    <label>Technical-Stack : </label> <span>{jobSupportWithJobSupporterData.jobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {jobSupportWithJobSupporterData.jobSupport.timeSlotList.map((item, index) => (
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
                                <div className='row mt-2'>
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
                                    onClick={() => handleChangeAdminStatus(Constants.APPROVED, jobSupportWithJobSupporterData.jobSupport.jobSupportId)}
                                >
                                    Approve
                                </button>
                                <button
                                    className='modal-button'
                                    onClick={() => handleChangeAdminStatus(Constants.REJECTED, jobSupportWithJobSupporterData.jobSupport.jobSupportId)}
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

export default CreatedJobSupport;