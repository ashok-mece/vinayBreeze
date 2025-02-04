import { useEffect, useState } from 'react';
import './AdminRescheduledInterviewSupports.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card, Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';

function AdminRescheduledInterviewSupports() {

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

        //await getHoldRescheduledInterviewSupportingsOnPage();

    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg 
    const rescheduledInterviewSupportWithInterviewSupporterDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }
    //JS for to display success msg
    const rescheduledInterviewSupportWithInterviewSupporterDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [rescheduledInterviewSupportWithInterviewSupporter, setRescheduledInterviewSupportWithInterviewSupporter] = useState([]);
    const getHoldRescheduledInterviewSupportingsOnPage = async () => {
        setLoadingBar(true);
        const request = {
            page: page,
            size: size,
        }

        try {
            const responseData = await AdminService.getHoldRescheduledInterviewSupportingsOnPage(request);
            console.log(responseData);

            setIsLastPage(responseData.isLastPage);
            setRescheduledInterviewSupportWithInterviewSupporter(responseData.list);
            if (responseData.list.length === 0) {
                rescheduledInterviewSupportWithInterviewSupporterDisplayErrMsg('Rescheduled Interview Supports are not found');
            }
        } catch (error) {
            console.log(error.message);
            handleGetHoldRescheduledInterviewSupportWithInterviewSupporterErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleGetHoldRescheduledInterviewSupportWithInterviewSupporterErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            rescheduledInterviewSupportWithInterviewSupporterDisplayErrMsg("Sorry, Our service is down");
        else
            rescheduledInterviewSupportWithInterviewSupporterDisplayErrMsg("Could not process your request");
    }

    useEffect(() => {
        getHoldRescheduledInterviewSupportingsOnPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [viewClicked, setViewClicked] = useState(0);
    const [viewClickedErrMsg, setViewClickedErrMsg] = useState('');
    const [viewData, setViewData] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const handleOpenResume = (event) => {
        event.preventDefault();
        window.open(resumeUrl, '_blank');
    };
    const handleViewHoldRescheduledInterviewSupporting = async (interviewSupportBookingId) => {
        setLoadingBar(true);
        console.log(interviewSupportBookingId);
        const request = {
            interviewSupportBookingId: interviewSupportBookingId,
        }

        try {
            const responseData = await AdminService.viewHoldRescheduledInterviewSupport(request);
            console.log(responseData);
            setViewData(responseData);

            if (responseData?.interviewSupportBookingDto.resume) {
                const resumeRequest = {
                    courseContent: responseData?.interviewSupportBookingDto.resume,
                }
                const resumeResponse = await GlobalService.getCourseContentByPath(resumeRequest);
                console.log(resumeResponse);
                const resumeFile = new Blob([resumeResponse.data], { type: resumeResponse.headers['content-type'] });
                const resumeFileUrl = URL.createObjectURL(resumeFile);
                setResumeUrl(resumeFileUrl);
            }

            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewHoldInterviewSupportingErrors(error.message, interviewSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleViewHoldInterviewSupportingErrors = (errorStatus, interviewSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleViewHoldRescheduledInterviewSupportingErrMsg("Interview Support Booking id is invalid", interviewSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleViewHoldRescheduledInterviewSupportingErrMsg("Interview Support Booking is Not Found", interviewSupportBookingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleViewHoldRescheduledInterviewSupportingErrMsg("Sorry, Our service is down", interviewSupportBookingId);
        else
            handleViewHoldRescheduledInterviewSupportingErrMsg("Could not process your request", interviewSupportBookingId);
    }

    const handleViewHoldRescheduledInterviewSupportingErrMsg = (errorMessage, interviewSupportBookingId) => {
        setViewClickedErrMsg(errorMessage);
        setViewClicked(interviewSupportBookingId);
        setTimeout(() => {
            setViewClickedErrMsg('');
            setViewClicked(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setViewData(null);
        setResumeUrl('');
    };

    const handleChangeAdminStatus = async (rescheduledStatus, interviewSupportBookingId) => {
        
        const changeAdminStatusRequest = {
            interviewSupportBookingId: interviewSupportBookingId,
            rescheduledStatus: rescheduledStatus,
        }

        setLoadingBar(true);
        try {
            const responseData = await AdminService.confirmOrWithdrawRescheduledInterviewSupport(changeAdminStatusRequest);
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
            changeAdminStatusDisplayErrMsg("Interview Support Booking is Not Found");
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
        <div className='admin-rescheduled-interview-supports' style={{ fontSize: '14px' }}>
            {loadingBar && <LoadingBar />}
            <div className='mt-1' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                {rescheduledInterviewSupportWithInterviewSupporter.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem' }} className="card">
                        <Card.Body>
                            <Card.Text>
                                <div className='interview-support'>
                                    <div className='flex'>
                                        <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Support Booking</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='view-button'
                                            onClick={() => handleViewHoldRescheduledInterviewSupporting(item.interviewSupportBookingId)}
                                        >
                                            View
                                        </button>
                                    </div>
                                    <label>Interview Supporter-Id : </label> <span>{item.interviewSupporterId}</span> <br />
                                    <label>Interview Supporter-Name : </label> <span>{item.interviewSupporterName}</span> <br />
                                    <label>Candidate-Name : </label> <span>{item.candidateName}</span> <br />
                                    <label>Technical Stack : </label> <span>{item.technologyList.map(tech => tech.technologyName).join(', ')}</span>
                                </div>
                                {viewClicked === item.interviewSupportBookingId && (
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
            {rescheduledInterviewSupportWithInterviewSupporter.length !== 0 && (
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
                <Modal className='view-hold-rescheduled-interview-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Interview Support Booking & Reschedule Data
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='interview-support-and-interview-supporter-data'>
                                <div className='interview-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Supporter Data</label> <br />
                                    <label>Interview Supporter-Id : </label> <span>{viewData.interviewer.userId}</span> <br />
                                    <label>Interview Supporter-Name : </label> <span>{viewData.interviewer.userFirstname + " " + viewData.interviewer.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{viewData.interviewer.userExperience}</span> <br />
                                    <label>Interview Supporter-Mail : </label> <span>{viewData.interviewer.username}</span> <br />
                                    <label>Interview Supporter-Phone : </label> <span>{viewData.interviewer.phoneNumberWithCountryCode}</span>
                                </div>
                                <div className='candidate-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Candidate Data</label> <br />
                                    <label>Candidate-Id : </label> <span>{viewData.candidate.userId}</span> <br />
                                    <label>Candidate-Name : </label> <span>{viewData.candidate.userFirstname + " " + viewData.candidate.userLastname}</span> <br />
                                    <label>Candidate-Mail : </label> <span>{viewData.candidate.username}</span> <br />
                                    <label>Candidate-Phone : </label> <span>{viewData.candidate.phoneNumberWithCountryCode}</span><br />
                                    <label>Candidate-Job Description(JD) : </label> <span className='job-description'>{viewData.interviewSupportBookingDto.jobDescription ? viewData.interviewSupportBookingDto.jobDescription : ('Not Provided')}</span><br />
                                    {/* <label>Resume Link : </label>
                                    <span>
                                        {viewData.interviewSupportBookingDto.resume ? (
                                            <button
                                                onClick={handleOpenResume}
                                                style={{
                                                    border: 'none',
                                                    background: 'none',
                                                    padding: '0',
                                                    color: '#1b4962',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Open Resume
                                            </button>
                                        ) : (' Not Provided')}
                                    </span> <br /> */}
                                </div>
                                <div className='interview-support-booking-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Previous Booking Data</label> <br />
                                    <label>Technical-Stack : </label> <span>{viewData.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Booked Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewData.interviewSupportBookingDto.bookedDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label> 
                                        <div className='time-slot-container'>
                                            {viewData.interviewSupportBookingDto.timeSlotList.map((item, index) => (
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
                                <div className='interview-support-rescheduled-data mt-2'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Rescheduled Data</label> <br />
                                    <label>Rescheduled Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewData.interviewSupportBookingDto.rescheduledDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Rescheduled Slots : </label> 
                                        <div className='time-slot-container'>
                                            {viewData.interviewSupportBookingDto.rescheduledTimeSlotList.map((item, index) => (
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
                                    onClick={() => handleChangeAdminStatus(Constants.CONFIRMED, viewData.interviewSupportBookingDto.interviewSupportBookingId)}
                                >
                                    Confirm
                                </button>
                                <button
                                    className='modal-button'
                                    onClick={() => handleChangeAdminStatus(Constants.WITHDRAW, viewData.interviewSupportBookingDto.interviewSupportBookingId)}
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

export default AdminRescheduledInterviewSupports;