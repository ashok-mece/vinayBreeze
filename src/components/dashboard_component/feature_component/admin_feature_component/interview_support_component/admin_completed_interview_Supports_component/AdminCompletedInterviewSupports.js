import { useState } from 'react';
import './AdminCompletedInterviewSupports.css';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import { CDBDataTable } from 'cdbreact';
import { Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function AdminCompletedInterviewSupports() {

    const [loadingBar, setLoadingBar] = useState(false);

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCompletedInterviewSupportsErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [selectedMonth, setSelectedMonth] = useState(null);
    const handleDateChange = (date) => {
        setSelectedMonth(date);
    };

    const [completedInterviewSupports, setCompletedInterviewSupports] = useState([]);
    const handleMonthlySearch = async () => {
        if (selectedMonth === null) {
            getCompletedInterviewSupportsErrMsg('Please select a month');
        } else {
            setLoadingBar(true);
            console.log(selectedMonth);
            const formData = new FormData();
            formData.append('selectedMonth', selectedMonth);
            try {
                const responseData = await AdminService.monthlyCompletedInterviewSupportBookings(formData);
                console.log(responseData);
                if (responseData.length === 0) {
                    getCompletedInterviewSupportsErrMsg('Completed Interview Supports are not found for Selected Month');
                    setCompletedInterviewSupports([]);
                } else {
                    setCompletedInterviewSupports(responseData);
                }
            } catch (error) {
                console.log(error.message);
                handleMonthlyCompletedInterviewSupportsErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleMonthlyCompletedInterviewSupportsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCompletedInterviewSupportsErrMsg("Selected Month is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCompletedInterviewSupportsErrMsg("Sorry, Our service is down");
        else
            getCompletedInterviewSupportsErrMsg("Could not process your request");
    }

    const completedInterviewSupportsDataTableData = () => {
        const moreInfo = (interviewSupportBookingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleBookingDataClicked(interviewSupportBookingId)}
                        >
                            View
                        </button>
                    </div>
                    <div className='mt-1'>
                        {viewMoreInfoInterviewSupportId === interviewSupportBookingId &&
                            <div style={customCssForMsg}>
                                <label>{viewMoreInfoErrMsg}</label>
                            </div>}
                    </div>
                </div>
            );
        };
        const columns = [
            { label: 'Booking Id', field: 'bookingId', width: 70 },
            { label: 'Interviewer Name', field: 'interviewerName', width: 70 },
            { label: 'Interviewer Mail', field: 'interviewerMail', width: 70 },
            { label: 'Interviewer Phone', field: 'interviewerPhone', width: 70 },
            { label: 'Candidate Name', field: 'candidateName', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 70, formatter: moreInfo },
        ];
        const rows = completedInterviewSupports.map((each => {
            return {
                'bookingId': each.interviewSupportBookingDto.interviewSupportBookingId,
                'interviewerName': each.interviewer.userFirstname + " " + each.interviewer.userLastname,
                'interviewerMail': each.interviewer.username,
                'interviewerPhone': each.interviewer.phoneNumberWithCountryCode,
                'candidateName': each.candidate.userFirstname + " " + each.candidate.userLastname,
                'moreInfo': moreInfo(each.interviewSupportBookingDto.interviewSupportBookingId),
            }
        }));
        return { columns, rows };
    };

    const [viewMoreInfoModal, setViewMoreInfoModal] = useState(false);
    const [viewMoreInfo, setViewMoreInfo] = useState(null);
    const handleViewMoreInfoModalClose = () => {
        setViewMoreInfoModal(false);
        setViewMoreInfo(null);
    }
    const handleBookingDataClicked = async (interviewSupportBookingId) => {
        setLoadingBar(true);
        console.log(interviewSupportBookingId);
        const viewMoreInfoRequest = {
            interviewSupportBookingId: interviewSupportBookingId,
        }
        try {
            const responseData = await AdminService.viewMoreCompletedInterviewSupportInfo(viewMoreInfoRequest);
            console.log(responseData);
            setViewMoreInfo(responseData);
            setViewMoreInfoModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewMoreCompletedInterviewSupportInfoErrors(error.message, interviewSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreCompletedInterviewSupportInfoErrors = (errorStatus, interviewSupportBookingId) => {
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
    const [viewMoreInfoInterviewSupportId, setViewMoreInfoInterviewSupportId] = useState(0);
    const [viewMoreInfoErrMsg, setViewMoreInfoErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoDisplayErrMsg = (errorMessage, interviewSupportBookingId) => {
        setViewMoreInfoErrMsg(errorMessage);
        setViewMoreInfoInterviewSupportId(interviewSupportBookingId);
        setTimeout(() => {
            setViewMoreInfoErrMsg('');
            setViewMoreInfoInterviewSupportId(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-completed-interview-supports'>
            {loadingBar && <LoadingBar />}
            <label>Select Month</label> <br />
            <div style={{ display: 'flex' }}>
                <Datetime
                    value={selectedMonth}
                    onChange={handleDateChange}
                    dateFormat="MM/YYYY"
                    timeFormat={false}
                    inputProps={{
                        placeholder: 'Select Month',
                        readOnly: true,
                    }}
                    className='w-75'
                />
                <button
                    style={{ marginLeft: '10px' }}
                    className='monthly-search-btn'
                    onClick={handleMonthlySearch}
                >
                    Search
                </button>
            </div>
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
            <div style={{ overflowX: 'auto', fontSize: '13px', maxHeight: 'calc(100vh - 100px)', marginTop: '6px' }}>
                {completedInterviewSupports.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10]}
                        entries={5}
                        pagesAmount={4}
                        data={completedInterviewSupportsDataTableData()}
                        // scrollX
                        materialSearch={true}
                        responsive={true}
                        small={true}
                        style={{ textAlign: 'center' }}
                        className='cdb-datatable'
                    />
                )}
            </div>
            {viewMoreInfoModal && (
                <Modal className='view-more-completed-interview-support-info-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Interview Support Booking Info & Status
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='booking-data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Supporter Data</label> <br />
                                    <label>Interview Supporter-Name : </label> <span>{viewMoreInfo.interviewer.userFirstname + " " + viewMoreInfo.interviewer.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{viewMoreInfo.interviewer.userExperience}</span> <br />
                                    <label>Interview Supporter-Mail : </label> <span>{viewMoreInfo.interviewer.username}</span> <br />
                                    <label>Interview Supporter-Phone : </label> <span>{viewMoreInfo.interviewer.phoneNumberWithCountryCode}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Average Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={viewMoreInfo.interviewSupportDto.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span> <br />
                                    </div>
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Candidate Data</label> <br />
                                    <label>Candidate-Name : </label> <span>{viewMoreInfo.candidate.userFirstname + " " + viewMoreInfo.candidate.userLastname}</span> <br />
                                    <label>Candidate-Mail : </label> <span>{viewMoreInfo.candidate.username}</span> <br />
                                    <label>Candidate-Phone : </label> <span>{viewMoreInfo.candidate.phoneNumberWithCountryCode}</span> <br />
                                    <label>Candidate-Rating : </label> <span>{viewMoreInfo.interviewSupportBookingDto.rating === 0 ? 'Not Rated' : viewMoreInfo.interviewSupportBookingDto.rating}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Support Booking Data</label> <br />
                                    <label>Booking-Id : </label> <span>{viewMoreInfo.interviewSupportBookingDto.interviewSupportBookingId}</span> <br />
                                    <label>Technical-Stack : </label> <span>{viewMoreInfo.interviewSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Booking Status : </label> <span>{viewMoreInfo.interviewSupportBookingDto.bookingStatus}</span> <br />
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
                                </div>
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default AdminCompletedInterviewSupports;