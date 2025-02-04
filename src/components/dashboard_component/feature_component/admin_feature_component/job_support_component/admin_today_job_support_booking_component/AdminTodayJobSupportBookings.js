import { useEffect, useState } from 'react';
import './AdminTodayJobSupportBookings.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { CDBDataTable } from 'cdbreact';
import { Container, Modal } from 'react-bootstrap';

function AdminTodayJobSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTodayJobSupportBookingsErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        handleTodayJobSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [todayJobSupportBookings, setTodayJobSupportBookings] = useState([]);
    const handleTodayJobSupportBookings = async () => {
        setLoadingBar(true);
        try {
            const responseData = await AdminService.getTodayJobSupportBookings();
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayJobSupportBookingsErrMsg('Bookings are not found For Today');
            } else {
                setTodayJobSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTodayJobSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayJobSupportBookingsErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayJobSupportBookingsErrMsg("Sorry, Our service is down");
        else
            getTodayJobSupportBookingsErrMsg("Could not process your request");
    }

    const todayJobSupportBookingsDataTableData = () => {
        const moreInfo = (jobSupportBookingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleViewButtonClicked(jobSupportBookingId)}
                        >
                            View
                        </button>
                    </div>
                    <div className='mt-1'>
                        {viewMoreInfoBookingId === jobSupportBookingId &&
                            <div style={customCssForMsg}>
                                <label>{viewMoreInfoErrMsg}</label>
                            </div>}
                    </div>
                </div>
            );
        };
        const columns = [
            { label: 'Booking Id', field: 'bookingId', width: 70 },
            { label: 'Technical Stack', field: 'techStack', width: 250 },
            { label: 'Start Date', field: 'startDate', width: 70 },
            { label: 'End Date', field: 'endDate', width: 70 },
            { label: 'Start Time', field: 'startTime', width: 70 },
            { label: 'End Time', field: 'endTime', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 70, formatter: moreInfo },
        ];
        const rows = todayJobSupportBookings.map((each => {
            return {
                'bookingId': each.jobSupportBookingDto.jobSupportBookingId,
                'techStack': each.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', '),
                'startDate': (Constants.convertUserTimezoneDateTime(each.jobSupportBookingDto.startDate)).date,
                'endDate': (Constants.convertUserTimezoneDateTime(each.jobSupportBookingDto.endDate)).date,
                'startTime': Constants.formatTime(Constants.convertUserTimezoneTime(
                    each.jobSupportBookingDto.timeSlotList.reduce((earliest, slot) => {
                        return earliest < slot.slotStartTime ? earliest : slot.slotStartTime;
                    }, each.jobSupportBookingDto.timeSlotList[0].slotStartTime)
                )),
                'endTime': Constants.formatTime(Constants.convertUserTimezoneTime(
                    each.jobSupportBookingDto.timeSlotList.reduce((latest, slot) => {
                        return latest > slot.slotEndTime ? latest : slot.slotEndTime;
                    }, each.jobSupportBookingDto.timeSlotList[0].slotEndTime)
                )),
                'moreInfo': moreInfo(each.jobSupportBookingDto.jobSupportBookingId),
            }
        }));
        return { columns, rows };
    };

    const [viewMoreInfoModal, setViewMoreInfoModal] = useState(false);
    const [viewMoreInfo, setViewMoreInfo] = useState(null);
    useEffect(() => {
        // re render component when viewMoreInfo have changes
    }, [viewMoreInfo]);
    const handleViewMoreInfoModalClose = () => {
        setViewMoreInfoModal(false);
        setViewMoreInfo(null);
        window.location.reload();
    }
    const handleViewButtonClicked = async (jobSupportBookingId) => {
        setLoadingBar(true);
        console.log(jobSupportBookingId);
        const viewMoreInfoRequest = {
            jobSupportBookingId: jobSupportBookingId,
        }
        try {
            const responseData = await AdminService.adminViewTodayJobSupportBookingByBookingId(viewMoreInfoRequest);
            console.log(responseData);
            setViewMoreInfo(responseData);
            setViewMoreInfoModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewMoreInfoErrors(error.message, jobSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreInfoErrors = (errorStatus, jobSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoDisplayErrMsg("Booking is invalid", jobSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoDisplayErrMsg("Entity Not Found", jobSupportBookingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoDisplayErrMsg("Sorry, Our service is down", jobSupportBookingId);
        else
            viewMoreInfoDisplayErrMsg("Could not process your request", jobSupportBookingId);
    }

    // view more info err msg
    const [viewMoreInfoBookingId, setViewMoreInfoBookingId] = useState(0);
    const [viewMoreInfoErrMsg, setViewMoreInfoErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoDisplayErrMsg = (errorMessage, jobSupportBookingId) => {
        setViewMoreInfoErrMsg(errorMessage);
        setViewMoreInfoBookingId(jobSupportBookingId);
        setTimeout(() => {
            setViewMoreInfoErrMsg('');
            setViewMoreInfoBookingId(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    // meeting link upload code
    const [meetingLink, setMeetingLink] = useState('');
    const handleMeetingLinkChange = (e) => setMeetingLink(e.target.value);
    const handleUploadMeetingLink = async (jobSupportBookingId) => {
        if (meetingLink === null || meetingLink === '') {
            viewMoreInfoModalDisplayErrMsg('Please Upload Meeting Link');
        } else {
            setLoadingBar(true);
            const uploadMeetingLinkRequest = {
                jobSupportBookingId: jobSupportBookingId,
                meetingLink: meetingLink,
            }
            console.log(uploadMeetingLinkRequest);
            try {
                const responseData = await AdminService.uploadJobSupportMeetingLink(uploadMeetingLinkRequest);
                console.log(responseData);
                viewMoreInfoModalDisplaySucMsg('Successfully Uploaded Meeting Link');
                viewMoreInfo.jobSupportBookingDto.meetingLink = responseData.meetingLink;
            } catch (error) {
                console.log(error.message);
                handleUploadMeetingLinkErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleUploadMeetingLinkErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Input is invalid");
        else if (Constants.EXISTING_MEETING_LINK === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Meeting Link is already taken");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Sorry, Our service is down");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    const handleRemoveMeetingLink = async (jobSupportBookingId) => {
        setLoadingBar(true);
        const removeMeetingLinkRequest = {
            jobSupportBookingId: jobSupportBookingId,
        }
        console.log(removeMeetingLinkRequest);
        try {
            const responseData = await AdminService.removeJobSupportMeetingLink(removeMeetingLinkRequest);
            console.log(responseData);
            viewMoreInfoModalDisplaySucMsg('Successfully Removed Meeting Link');
            viewMoreInfo.jobSupportBookingDto.meetingLink = responseData.meetingLink;
            setMeetingLink(viewMoreInfo.jobSupportBookingDto.meetingLink);
        } catch (error) {
            console.log(error.message);
            handleRemoveMeetingLinkErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleRemoveMeetingLinkErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Job Support id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Sorry, Our service is down");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    // view more info modal err msg
    const [viewMoreInfoModalErrMsgDiv, setViewMoreInfoModalErrMsgDiv] = useState(false);
    const [viewMoreInfoModalErrMsg, setViewMoreInfoModalErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoModalDisplayErrMsg = (errorMessage) => {
        setViewMoreInfoModalErrMsg(errorMessage);
        setViewMoreInfoModalErrMsgDiv(true);
        setTimeout(() => {
            setViewMoreInfoModalErrMsg("");
            setViewMoreInfoModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const viewMoreInfoModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setViewMoreInfoModalErrMsg(errorMessage);
        setViewMoreInfoModalErrMsgDiv(true);
        setTimeout(() => {
            setViewMoreInfoModalErrMsg("");
            setViewMoreInfoModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [confirmStopModal, setConfirmStopModal] = useState(false);
    const [stopSupportBookingId, setStopSupportBookingId] = useState(0);
    const handleConfirmStopModalClose = () => {
        setConfirmStopModal(false);
        setStopSupportBookingId(0);
    }

    const handleStopButton = (bookingId) => {
        setStopSupportBookingId(bookingId);
        setConfirmStopModal(true);
    }

    const handleConfirmStopButton = async () => {
        setLoadingBar(true);
        const request = {
            jobSupportBookingId: stopSupportBookingId,
        }
        console.log(request);
        try {
            const responseData = await AdminService.stopJobSupport(request);
            console.log(responseData);
            handleConfirmStopModalClose();
            viewMoreInfoModalDisplaySucMsg('Successfully Stopped Job Support');
            setTimeout(() => {
                handleViewMoreInfoModalClose();
            },3000);
        } catch (error) {
            console.log(error.message);
            handleConfirmStopErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleConfirmStopErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Job Support id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Sorry, Our service is down");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-today-job-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div style={{ overflowX: 'auto', fontSize: '13px', maxHeight: 'calc(100vh - 100px)' }}>
                {todayJobSupportBookings.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10, 15]}
                        entries={5}
                        pagesAmount={4}
                        data={todayJobSupportBookingsDataTableData()}
                        // scrollX
                        materialSearch={true}
                        responsive={true}
                        small={true}
                        style={{ textAlign: 'center' }}
                        className='cdb-datatable'
                    />
                )}
            </div>
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
            {viewMoreInfoModal && (
                <Modal className='view-today-job-support-booking-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Booking Info & Status
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Name : </label> <span>{viewMoreInfo.jobSupporter.userFirstname + " " + viewMoreInfo.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{viewMoreInfo.jobSupporter.userExperience}</span> <br />
                                    <label>Job Supporter-Mail : </label> <span>{viewMoreInfo.jobSupporter.username}</span> <br />
                                    <label>Job Supporter-Phone : </label> <span>{viewMoreInfo.jobSupporter.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Candidate Data</label> <br />
                                    <label>Candidate-Name : </label> <span>{viewMoreInfo.candidate.userFirstname + " " + viewMoreInfo.candidate.userLastname}</span> <br />
                                    <label>Candidate-Mail : </label> <span>{viewMoreInfo.candidate.username}</span> <br />
                                    <label>Candidate-Phone : </label> <span>{viewMoreInfo.candidate.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Support Booking Data</label> <br />
                                    <label>Booking-Id : </label> <span>{viewMoreInfo.jobSupportBookingDto.jobSupportBookingId}</span> <br />
                                    <label>Technical-Stack : </label> <span>{viewMoreInfo.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewMoreInfo.jobSupportBookingDto.startDate)).date}</span> <br />
                                    <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewMoreInfo.jobSupportBookingDto.endDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label>
                                        <div className='time-slot-container'>
                                            {viewMoreInfo.jobSupportBookingDto.timeSlotList.map((item, index) => (
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
                                    <div>
                                        <label>Project Description(PD) : </label> <span className='project-description'>{viewMoreInfo.jobSupportBookingDto.projectDescription ? viewMoreInfo.jobSupportBookingDto.projectDescription : ('Not Provided')}</span> <br />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label>Upload Meeting Link</label><br /> 
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            className='form-control w-75'
                                            value={viewMoreInfo.jobSupportBookingDto.meetingLink !== '' ? viewMoreInfo.jobSupportBookingDto.meetingLink : meetingLink}
                                            onChange={handleMeetingLinkChange}
                                            disabled={viewMoreInfo.jobSupportBookingDto.meetingLink !== ''}
                                            placeholder='Meeting Link'
                                        />
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='upload-meeting-link-btn'
                                            onClick={() => handleUploadMeetingLink(viewMoreInfo.jobSupportBookingDto.jobSupportBookingId)}
                                            disabled={viewMoreInfo.jobSupportBookingDto.meetingLink !== ''}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='remove-meeting-link-btn'
                                            onClick={() => handleRemoveMeetingLink(viewMoreInfo.jobSupportBookingDto.jobSupportBookingId)}
                                            disabled={viewMoreInfo.jobSupportBookingDto.meetingLink === ''}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            style={{ marginLeft: '25px' }}
                                            className='stop-btn'
                                            onClick={() => handleStopButton(viewMoreInfo.jobSupportBookingDto.jobSupportBookingId)}
                                        >
                                            Stop
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    {viewMoreInfoModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{viewMoreInfoModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
            {confirmStopModal && (
                <Modal className='stop-job-support-booking-modal' size='md' show={confirmStopModal} onHide={handleConfirmStopModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Confirm Stopping Job Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label style={{fontSize:'14px'}}>Click on Confirm Stop to Confirm Stopping Job Support.</label>                            
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                className='stop-btn'
                                onClick={() => handleConfirmStopButton()}
                            >
                                Confirm Stop
                            </button>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default AdminTodayJobSupportBookings;