import { useEffect, useState } from 'react';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import './AdminTodayInterviewSupportBookings.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import { CDBDataTable } from 'cdbreact';
import { Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';

function AdminTodayInterviewSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTodayInterviewSupportBookingsErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        handleTodayInterviewSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [todayInterviewSupportBookings, setTodayInterviewSupportBookings] = useState([]);
    const handleTodayInterviewSupportBookings = async () => {
        setLoadingBar(true);
        try {
            const responseData = await AdminService.getTodayInterviewSupportBookings();
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayInterviewSupportBookingsErrMsg('Bookings are not found for Today');
            } else {
                setTodayInterviewSupportBookings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTodayInterviewSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayInterviewSupportBookingsErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayInterviewSupportBookingsErrMsg("Sorry, Our service is down");
        else
            getTodayInterviewSupportBookingsErrMsg("Could not process your request");
    }

    const todayInterviewSupportBookingsDataTableData = () => {
        const moreInfo = (interviewSupportBookingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleViewButtonClicked(interviewSupportBookingId)}
                        >
                            View
                        </button>
                    </div>
                    <div className='mt-1'>
                        {viewMoreInfoBookingId === interviewSupportBookingId &&
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
            { label: 'Booked Date', field: 'bookedDate', width: 70 },
            { label: 'Start Time', field: 'startTime', width: 70 },
            { label: 'End Time', field: 'endTime', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 70, formatter: moreInfo },
        ];
        const rows = todayInterviewSupportBookings.map((each => {
            return {
                'bookingId': each.interviewSupportBookingDto.interviewSupportBookingId,
                'techStack': each.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', '),
                'bookedDate': (Constants.convertUserTimezoneDateTime(each.interviewSupportBookingDto.bookedDate)).date,
                'startTime': Constants.formatTime(Constants.convertUserTimezoneTime(
                    each.interviewSupportBookingDto.timeSlotList.reduce((earliest, slot) => {
                        return earliest < slot.slotStartTime ? earliest : slot.slotStartTime;
                    }, each.interviewSupportBookingDto.timeSlotList[0].slotStartTime)
                )),
                'endTime': Constants.formatTime(Constants.convertUserTimezoneTime(
                    each.interviewSupportBookingDto.timeSlotList.reduce((latest, slot) => {
                        return latest > slot.slotEndTime ? latest : slot.slotEndTime;
                    }, each.interviewSupportBookingDto.timeSlotList[0].slotEndTime)
                )),
                'moreInfo': moreInfo(each.interviewSupportBookingDto.interviewSupportBookingId),
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
    const handleViewButtonClicked = async (interviewSupportBookingId) => {
        setLoadingBar(true);
        console.log(interviewSupportBookingId);
        const viewMoreInfoRequest = {
            interviewSupportBookingId: interviewSupportBookingId,
        }
        try {
            const responseData = await AdminService.adminViewTodayInterviewSupportBookingByBookingId(viewMoreInfoRequest);
            console.log(responseData);
            setViewMoreInfo(responseData);
            setViewMoreInfoModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewMoreInfoErrors(error.message, interviewSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreInfoErrors = (errorStatus, interviewSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoDisplayErrMsg("Booking is invalid", interviewSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoDisplayErrMsg("Entity Not Found", interviewSupportBookingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoDisplayErrMsg("Sorry, Our service is down", interviewSupportBookingId);
        else
            viewMoreInfoDisplayErrMsg("Could not process your request", interviewSupportBookingId);
    }

    // view more info err msg
    const [viewMoreInfoBookingId, setViewMoreInfoBookingId] = useState(0);
    const [viewMoreInfoErrMsg, setViewMoreInfoErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoDisplayErrMsg = (errorMessage, interviewSupportBookingId) => {
        setViewMoreInfoErrMsg(errorMessage);
        setViewMoreInfoBookingId(interviewSupportBookingId);
        setTimeout(() => {
            setViewMoreInfoErrMsg('');
            setViewMoreInfoBookingId(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    // open Resume code
    const [resumeUrl, setResumeUrl] = useState('');
    useEffect(() => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        }
    }, [resumeUrl]);
    const handleOpenResume = async (path) => {
        setLoadingBar(true);
        console.log(path);
        try {
            const resumeRequest = {
                courseContent: path,
            }
            const resumeResponse = await GlobalService.getCourseContentByPath(resumeRequest);
            console.log(resumeResponse);
            const resumeFile = new Blob([resumeResponse.data], { type: resumeResponse.headers['content-type'] });
            const resumeFileUrl = URL.createObjectURL(resumeFile);
            setResumeUrl(resumeFileUrl);
        } catch (error) {
            console.error('Error fetching data for path:', path, error);
            handleResumeErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleResumeErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Resume Path is invalid");
        else if (Constants.FILES_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("File Not Found");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    // meeting link upload code
    const [meetingLink, setMeetingLink] = useState('');
    const handleMeetingLinkChange = (e) => setMeetingLink(e.target.value);
    const handleUploadMeetingLink = async (interviewSupportBookingId) => {
        if (meetingLink === null || meetingLink === '') {
            viewMoreInfoModalDisplayErrMsg('Please Upload Meeting Link');
        } else {
            setLoadingBar(true);
            const uploadMeetingLinkRequest = {
                interviewSupportBookingId: interviewSupportBookingId,
                meetingLink: meetingLink,
            }
            console.log(uploadMeetingLinkRequest);
            try {
                const responseData = await AdminService.uploadInterviewSupportMeetingLink(uploadMeetingLinkRequest);
                console.log(responseData);
                viewMoreInfoModalDisplaySucMsg('Successfully Uploaded Meeting Link');
                viewMoreInfo.interviewSupportBookingDto.meetingLink = responseData.meetingLink;
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

    const handleRemoveMeetingLink = async (interviewSupportBookingId) => {
        setLoadingBar(true);
        const removeMeetingLinkRequest = {
            interviewSupportBookingId: interviewSupportBookingId,
        }
        console.log(removeMeetingLinkRequest);
        try {
            const responseData = await AdminService.removeInterviewSupportMeetingLink(removeMeetingLinkRequest);
            console.log(responseData);
            viewMoreInfoModalDisplaySucMsg('Successfully Removed Meeting Link');
            viewMoreInfo.interviewSupportBookingDto.meetingLink = responseData.meetingLink;
            setMeetingLink(viewMoreInfo.interviewSupportBookingDto.meetingLink);
        } catch (error) {
            console.log(error.message);
            handleRemoveMeetingLinkErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleRemoveMeetingLinkErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Interview Support id is invalid");
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

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-today-interview-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div style={{ overflowX: 'auto', fontSize: '13px', maxHeight: 'calc(100vh - 100px)' }}>
                {todayInterviewSupportBookings.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10, 15]}
                        entries={5}
                        pagesAmount={4}
                        data={todayInterviewSupportBookingsDataTableData()}
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
                <Modal className='view-today-interview-support-booking-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Booking Info & Status
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Supporter Data</label> <br />
                                    <label>Interview Supporter-Name : </label> <span>{viewMoreInfo.interviewer.userFirstname + " " + viewMoreInfo.interviewer.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{viewMoreInfo.interviewer.userExperience}</span> <br />
                                    <label>Interview Supporter-Mail : </label> <span>{viewMoreInfo.interviewer.username}</span> <br />
                                    <label>Interview Supporter-Phone : </label> <span>{viewMoreInfo.interviewer.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Candidate Data</label> <br />
                                    <label>Candidate-Name : </label> <span>{viewMoreInfo.candidate.userFirstname + " " + viewMoreInfo.candidate.userLastname}</span> <br />
                                    <label>Candidate-Mail : </label> <span>{viewMoreInfo.candidate.username}</span> <br />
                                    <label>Candidate-Phone : </label> <span>{viewMoreInfo.candidate.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Support Booking Data</label> <br />
                                    <label>Booking-Id : </label> <span>{viewMoreInfo.interviewSupportBookingDto.interviewSupportBookingId}</span> <br />
                                    <label>Technical-Stack : </label> <span>{viewMoreInfo.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Booked Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewMoreInfo.interviewSupportBookingDto.bookedDate)).date}</span> <br />
                                    <div className='time-slots'>
                                        <label>Booked Slots : </label>
                                        <div className='time-slot-container'>
                                            {viewMoreInfo.interviewSupportBookingDto.timeSlotList.map((item, index) => (
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
                                        {/* <label>Resume Link : </label>
                                        <span>
                                            {viewMoreInfo.interviewSupportBookingDto.resume ? (
                                                <button
                                                    onClick={() => handleOpenResume(viewMoreInfo.interviewSupportBookingDto.resume)}
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
                                        </span><br /> */}
                                        <label>Job Description(JD) : </label> <span className='job-description'>{viewMoreInfo.interviewSupportBookingDto.jobDescription ? viewMoreInfo.interviewSupportBookingDto.jobDescription : ('Not Provided')}</span> <br />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label>Upload Meeting Link</label><br /> 
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            className='form-control w-75'
                                            value={viewMoreInfo.interviewSupportBookingDto.meetingLink !== '' ? viewMoreInfo.interviewSupportBookingDto.meetingLink : meetingLink}
                                            onChange={handleMeetingLinkChange}
                                            disabled={viewMoreInfo.interviewSupportBookingDto.meetingLink !== ''}
                                            placeholder='Meeting Link'
                                        />
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='upload-meeting-link-btn'
                                            onClick={() => handleUploadMeetingLink(viewMoreInfo.interviewSupportBookingDto.interviewSupportBookingId)}
                                            disabled={viewMoreInfo.interviewSupportBookingDto.meetingLink !== ''}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='remove-meeting-link-btn'
                                            onClick={() => handleRemoveMeetingLink(viewMoreInfo.interviewSupportBookingDto.interviewSupportBookingId)}
                                            disabled={viewMoreInfo.interviewSupportBookingDto.meetingLink === ''}
                                        >
                                            Remove
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
        </div>
    );
}

export default AdminTodayInterviewSupportBookings; 