import { useEffect, useState } from 'react';
import './AdminStoppedJobSupport.css';
import Constants from '../../../../../Constants';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card, Container, Modal } from 'react-bootstrap';

function AdminStoppedJobSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 9;

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

        //await getHoldStoppedJobSupportingsOnPage();

    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg 
    const stoppedJobSupportWithJobSupporterDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }
    //JS for to display success msg
    const stoppedJobSupportWithJobSupporterDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [stoppedJobSupportWithJobSupporter, setStoppedJobSupportWithJobSupporter] = useState([]);
    const getHoldStoppedJobSupportingsOnPage = async () => {
        setLoadingBar(true);
        const request = {
            page: page,
            size: size,
        }

        try {
            const responseData = await AdminService.getHoldStoppedJobSupportingsOnPage(request);
            console.log(responseData);

            setIsLastPage(responseData.isLastPage);
            setStoppedJobSupportWithJobSupporter(responseData.list);
            if (responseData.list.length === 0) {
                stoppedJobSupportWithJobSupporterDisplayErrMsg('Stopped Job Supports are not found');
            }
        } catch (error) {
            console.log(error.message);
            handleGetHoldStoppedJobSupportWithJobSupporterErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleGetHoldStoppedJobSupportWithJobSupporterErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            stoppedJobSupportWithJobSupporterDisplayErrMsg("Sorry, Our service is down");
        else
            stoppedJobSupportWithJobSupporterDisplayErrMsg("Could not process your request");
    }

    useEffect(() => {
        getHoldStoppedJobSupportingsOnPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [viewClicked, setViewClicked] = useState(0);
    const [viewClickedErrMsg, setViewClickedErrMsg] = useState('');
    const [viewData, setViewData] = useState(null);
    const handleViewHoldStoppedJobSupporting = async (jobSupportBookingId) => {
        setLoadingBar(true);
        console.log(jobSupportBookingId);
        const request = {
            jobSupportBookingId: jobSupportBookingId,
        }

        try {
            const responseData = await AdminService.viewHoldStoppedJobSupport(request);
            console.log(responseData);
            setViewData(responseData);
            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewHoldJobSupportingErrors(error.message, jobSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleViewHoldJobSupportingErrors = (errorStatus, jobSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleViewHoldStoppedJobSupportingErrMsg("Job Support Booking id is invalid", jobSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleViewHoldStoppedJobSupportingErrMsg("Job Support Booking is Not Found", jobSupportBookingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleViewHoldStoppedJobSupportingErrMsg("Sorry, Our service is down", jobSupportBookingId);
        else
            handleViewHoldStoppedJobSupportingErrMsg("Could not process your request", jobSupportBookingId);
    }

    const handleViewHoldStoppedJobSupportingErrMsg = (errorMessage, jobSupportBookingId) => {
        setViewClickedErrMsg(errorMessage);
        setViewClicked(jobSupportBookingId);
        setTimeout(() => {
            setViewClickedErrMsg('');
            setViewClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setViewData(null);
    };

    const handleChangeAdminStatus = async (stopStatus, jobSupportBookingId) => {
        
        const changeAdminStatusRequest = {
            jobSupportBookingId: jobSupportBookingId,
            stopStatus: stopStatus,
        }

        setLoadingBar(true);
        try {
            const responseData = await AdminService.confirmOrWithdrawStoppedJobSupport(changeAdminStatusRequest);
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
            changeAdminStatusDisplayErrMsg("Job Support Booking is Not Found");
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
        <div className='admin-stopped-job-supports' style={{ fontSize: '14px' }}>
            {loadingBar && <LoadingBar />}
            <div className='mt-1' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {stoppedJobSupportWithJobSupporter.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='job-support'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Support Booking</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='view-button'
                                            onClick={() => handleViewHoldStoppedJobSupporting(item.jobSupportBookingId)}
                                        >
                                            View
                                        </button>
                                    </div>
                                    <label>Job Supporter-Id : </label> <span>{item.jobSupporterId}</span> <br />
                                    <label>Job Supporter-Name : </label> <span>{item.jobSupporterName}</span> <br />
                                    <label>Candidate-Name : </label> <span>{item.candidateName}</span> <br />
                                    <label>Technical Stack : </label> <span>{item.technologyList.map(tech => tech.technologyName).join(', ')}</span>
                                </div>
                                {viewClicked === item.jobSupportBookingId && (
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
            {stoppedJobSupportWithJobSupporter.length !== 0 && (
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
                <Modal className='view-hold-stopped-job-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Job Support Booking
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-and-job-supporter-data'>
                                <div className='job-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Id : </label> <span>{viewData.jobSupporter.userId}</span> <br />
                                    <label>Job Supporter-Name : </label> <span>{viewData.jobSupporter.userFirstname + " " + viewData.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{viewData.jobSupporter.userExperience}</span> <br />
                                    <label>Job Supporter-Mail : </label> <span>{viewData.jobSupporter.username}</span> <br />
                                    <label>Job Supporter-Phone : </label> <span>{viewData.jobSupporter.phoneNumberWithCountryCode}</span>
                                </div>
                                <div className='candidate-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Candidate Data</label> <br />
                                    <label>Candidate-Id : </label> <span>{viewData.candidate.userId}</span> <br />
                                    <label>Candidate-Name : </label> <span>{viewData.candidate.userFirstname + " " + viewData.candidate.userLastname}</span> <br />
                                    <label>Candidate-Mail : </label> <span>{viewData.candidate.username}</span> <br />
                                    <label>Candidate-Phone : </label> <span>{viewData.candidate.phoneNumberWithCountryCode}</span><br />
                                    <label>Candidate-Project Description(PD) : </label> <span className='project-description'>{viewData.jobSupportBookingDto.projectDescription ? viewData.jobSupportBookingDto.projectDescription : ('Not Provided')}</span><br />
                                </div>
                                <div className='job-support-booking-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Booking Data</label> <br />
                                    <label>Technical-Stack : </label> <span>{viewData.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewData.jobSupportBookingDto.startDate)).date}</span> <br />
                                    <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewData.jobSupportBookingDto.endDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label> 
                                        <div className='time-slot-container'>
                                            {viewData.jobSupportBookingDto.timeSlotList.map((item, index) => (
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
                                    onClick={() => handleChangeAdminStatus(Constants.CONFIRMED, viewData.jobSupportBookingDto.jobSupportBookingId)}
                                >
                                    Confirm
                                </button>
                                <button
                                    className='modal-button'
                                    onClick={() => handleChangeAdminStatus(Constants.WITHDRAW, viewData.jobSupportBookingDto.jobSupportBookingId)}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div> 
    );
}

export default AdminStoppedJobSupport;