import { useState } from 'react';
import './AdminCompletedJobSupports.css';
import AdminService from '../../../../../../Services/admin_service/AdminService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { CDBDataTable } from 'cdbreact';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function AdminCompletedJobSupports() {

    const [loadingBar, setLoadingBar] = useState(false);

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCompletedJobSupportsErrMsg = (errorMessage) => {
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

    const [completedJobSupports, setCompletedJobSupports] = useState([]);
    const handleMonthlySearch = async () => {
        if (selectedMonth === null) {
            getCompletedJobSupportsErrMsg('Please select a month');
        } else {
            setLoadingBar(true);
            console.log(selectedMonth);
            const formData = new FormData();
            formData.append('selectedMonth', selectedMonth);
            try {
                const responseData = await AdminService.monthlyCompletedJobSupportBookings(formData);
                console.log(responseData);
                if (responseData.length === 0) {
                    getCompletedJobSupportsErrMsg('Completed Job Supports are not found for Selected Month');
                    setCompletedJobSupports([]);
                } else {
                    setCompletedJobSupports(responseData);
                }
            } catch (error) {
                console.log(error.message);
                handleMonthlyCompletedJobSupportsErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleMonthlyCompletedJobSupportsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCompletedJobSupportsErrMsg("Selected Month is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCompletedJobSupportsErrMsg("Sorry, Our service is down");
        else
            getCompletedJobSupportsErrMsg("Could not process your request");
    }

    const completedJobSupportsDataTableData = () => {
        const moreInfo = (jobSupportBookingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleBookingDataClicked(jobSupportBookingId)}
                        >
                            View
                        </button>
                    </div>
                    <div className='mt-1'>
                        {viewMoreInfoJobSupportId === jobSupportBookingId &&
                            <div style={customCssForMsg}>
                                <label>{viewMoreInfoErrMsg}</label>
                            </div>}
                    </div>
                </div>
            );
        };
        const columns = [
            { label: 'Booking Id', field: 'bookingId', width: 70 },
            { label: 'Job Supporter Name', field: 'jobSupporterName', width: 70 },
            { label: 'Job Supporter Mail', field: 'jobSupporterMail', width: 70 },
            { label: 'Job Supporter Phone', field: 'jobSupporterPhone', width: 70 },
            { label: 'Candidate Name', field: 'candidateName', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 70, formatter: moreInfo },
        ];
        const rows = completedJobSupports.map((each => {
            return {
                'bookingId': each.jobSupportBookingDto.jobSupportBookingId,
                'jobSupporterName': each.jobSupporter.userFirstname + " " + each.jobSupporter.userLastname,
                'jobSupporterMail': each.jobSupporter.username,
                'jobSupporterPhone': each.jobSupporter.phoneNumberWithCountryCode,
                'candidateName': each.candidate.userFirstname + " " + each.candidate.userLastname,
                'moreInfo': moreInfo(each.jobSupportBookingDto.jobSupportBookingId),
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
    const handleBookingDataClicked = async (jobSupportBookingId) => {
        setLoadingBar(true);
        console.log(jobSupportBookingId);
        const viewMoreInfoRequest = {
            jobSupportBookingId: jobSupportBookingId,
        }
        try {
            const responseData = await AdminService.viewMoreCompletedJobSupportInfo(viewMoreInfoRequest);
            console.log(responseData);
            setViewMoreInfo(responseData);
            setViewMoreInfoModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewMoreCompletedJobSupportInfoErrors(error.message, jobSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreCompletedJobSupportInfoErrors = (errorStatus, jobSupportBookingId) => {
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
    const [viewMoreInfoJobSupportId, setViewMoreInfoJobSupportId] = useState(0);
    const [viewMoreInfoErrMsg, setViewMoreInfoErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoDisplayErrMsg = (errorMessage, jobSupportBookingId) => {
        setViewMoreInfoErrMsg(errorMessage);
        setViewMoreInfoJobSupportId(jobSupportBookingId);
        setTimeout(() => {
            setViewMoreInfoErrMsg('');
            setViewMoreInfoJobSupportId(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-completed-job-supports'>
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
                {completedJobSupports.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10]}
                        entries={5}
                        pagesAmount={4}
                        data={completedJobSupportsDataTableData()}
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
                <Modal className='view-more-completed-job-support-info-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Job Support Booking Info & Status
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='booking-data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Name : </label> <span>{viewMoreInfo.jobSupporter.userFirstname + " " + viewMoreInfo.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{viewMoreInfo.jobSupporter.userExperience}</span> <br />
                                    <label>Job Supporter-Mail : </label> <span>{viewMoreInfo.jobSupporter.username}</span> <br />
                                    <label>Job Supporter-Phone : </label> <span>{viewMoreInfo.jobSupporter.phoneNumberWithCountryCode}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Average Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={viewMoreInfo.jobSupportDto.rating}
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
                                    <label>Candidate-Rating : </label> <span>{viewMoreInfo.jobSupportBookingDto.rating === 0 ? 'Not Rated' : viewMoreInfo.jobSupportBookingDto.rating}</span> <br />
                                </div>
                                <div className='mt-2' style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Support Booking Data</label> <br />
                                    <label>Booking-Id : </label> <span>{viewMoreInfo.jobSupportBookingDto.jobSupportBookingId}</span> <br />
                                    <label>Technical-Stack : </label> <span>{viewMoreInfo.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Booking Status : </label> <span>{viewMoreInfo.jobSupportBookingDto.bookingStatus}</span> <br />
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
                                </div>
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default AdminCompletedJobSupports;