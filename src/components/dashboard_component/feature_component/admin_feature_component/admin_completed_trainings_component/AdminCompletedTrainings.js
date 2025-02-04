import { useEffect, useState } from 'react';
import './AdminCompletedTrainings.css';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import AdminService from '../../../../../Services/admin_service/AdminService';
import { CDBDataTable } from 'cdbreact';
import Constants from '../../../../Constants';
import { Container, Modal } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';

function AdminCompletedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCompletedTrainingsErrMsg = (errorMessage) => {
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

    const [completedTrainings, setCompletedTrainings] = useState([]);
    const handleMonthlySearch = async () => {
        if (selectedMonth === null) {
            getCompletedTrainingsErrMsg('Please select a month');
        } else {
            setLoadingBar(true); 
            console.log(selectedMonth);
            const formData = new FormData();
            formData.append('selectedMonth', selectedMonth);
            try {
                const responseData = await AdminService.monthlyCompletedTrainings(formData);
                console.log(responseData);
                if (responseData.length === 0) {
                    getCompletedTrainingsErrMsg('Completed trainings are not found for Selected Month');
                    setCompletedTrainings([]);
                } else {
                    setCompletedTrainings(responseData);
                }
            } catch (error) {
                console.log(error.message);
                handleMonthlyCompletedTrainingsErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleMonthlyCompletedTrainingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCompletedTrainingsErrMsg("Selected Month is Invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCompletedTrainingsErrMsg("Sorry, Our service is down");
        else
            getCompletedTrainingsErrMsg("Could not process your request");
    }

    const completedrainingsDataTableData = () => {
        const moreInfo = (trainingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleTrainerDataClicked(trainingId)}
                        >
                            Trainer
                        </button>
                        <button
                            className='view-btn'
                            onClick={() => handleEnrollCandidateForTraining(trainingId)}
                            style={{ marginLeft: '6px' }}
                        >
                            Candidates
                        </button>
                    </div>
                    <div className='mt-1'>
                        {viewMoreInfoTrainingId === trainingId &&
                            <div style={customCssForMsg}>
                                <label>{viewMoreInfoErrMsg}</label>
                            </div>}
                    </div>
                </div>
            );
        };
        const columns = [
            { label: 'Training Id', field: 'trainingId', width: 70 },
            { label: 'Trainer Name', field: 'trainerName', width: 70 },
            { label: 'Trainer Mail', field: 'trainerMail', width: 70 },
            { label: 'Trainer Phone', field: 'trainerPhone', width: 70 },
            { label: 'Course', field: 'course', width: 70 },
            { label: 'Start Date', field: 'courseStartDate', width: 70 },
            { label: 'Start Time', field: 'courseStartTime', width: 70 },
            { label: 'End Date', field: 'courseEndDate', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 140, formatter: moreInfo },
        ];
        const rows = completedTrainings.map((each => {
            return {
                'trainingId': each.training.trainingId,
                'trainerName': each.trainer.userFirstname + " " + each.trainer.userLastname,
                'trainerMail': each.trainer.username,
                'trainerPhone': each.trainer.phoneNumberWithCountryCode,
                'course': each.training.courseName,
                'courseStartDate': (Constants.convertUserTimezoneDateTime(each.training.courseStartDateAndTime)).date,
                'courseStartTime': Constants.formatTime((Constants.convertUserTimezoneDateTime(each.training.courseStartDateAndTime)).time),
                'courseEndDate': (Constants.convertUserTimezoneDateTime(each.training.courseEndDate)).date,
                'moreInfo': moreInfo(each.training.trainingId),
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
    const handleTrainerDataClicked = async (trainingId) => {
        setLoadingBar(true);
        console.log(trainingId);
        const viewMoreInfoRequest = {
            trainingId: trainingId,
        }
        try {
            const responseData = await AdminService.viewMoreStartedTrainingInfo(viewMoreInfoRequest);
            console.log(responseData);
            setViewMoreInfo(responseData);
            setViewMoreInfoModal(true);
        } catch (error) {
            console.log(error.message);
            handleViewMoreStartedtrainingInfoErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreStartedtrainingInfoErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoDisplayErrMsg("Training is Invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoDisplayErrMsg("Entity Not Found", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoDisplayErrMsg("Sorry, Our service is down", trainingId);
        else
            viewMoreInfoDisplayErrMsg("Could not process your request", trainingId);
    }

    // view enrolled candidates modal with datatable code
    const [enrolledCandidates, setEnrolledCandidates] = useState([]);
    const [showEnrolledCandidates, setShowEnrolledCandidates] = useState(false);
    const handleEnrolledCandidatesModalClose = () => {
        setShowEnrolledCandidates(false);
        setEnrolledCandidates([]);
    }
    const handleEnrollCandidateForTraining = async (trainingId) => {
        setLoadingBar(true);
        const viewEnrolledCandidatesByTrainingIdRequest = {
            trainingId: trainingId,
        }
        try {
            const responseData = await AdminService.viewEnrolledCandidatesForCompletedTraining(viewEnrolledCandidatesByTrainingIdRequest);
            console.log(responseData);
            if (responseData.length === 0) {
                viewMoreInfoDisplayErrMsg('Candidates are not found');
                setEnrolledCandidates(responseData);
            } else {
                setEnrolledCandidates(responseData);
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
            viewMoreInfoDisplayErrMsg("Selected training is invalid", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoDisplayErrMsg("Sorry, Our service is down", trainingId);
        else
            viewMoreInfoDisplayErrMsg("Could not process your request", trainingId);
    }

    const enrolledCandidatesDataTableData = () => {
        const columns = [
            { label: 'First Name', field: 'userFirstname', width: 150 },
            { label: 'Last Name', field: 'userLastname', width: 150 },
            { label: 'Email', field: 'username', width: 200 },
            { label: 'Phone', field: 'phoneNumberWithCountryCode', width: 150 },
            { label: 'Gender', field: 'gender', width: 100 },
            { label: 'Rating', field: 'rating', width: 100 },
        ];
        const rows = enrolledCandidates.map((each => {
            return {
                'userFirstname': each.userDto.userFirstname,
                'userLastname': each.userDto.userLastname,
                'username': each.userDto.username,
                'phoneNumberWithCountryCode': each.userDto.phoneNumberWithCountryCode,
                'gender': each.userDto.gender,
                'rating': each.rating === 0 ? 'Not Rated' : each.rating,
            }
        }));
        return { columns, rows };
    };

    // view more info err msg
    const [viewMoreInfoTrainingId, setViewMoreInfoTrainingId] = useState(0);
    const [viewMoreInfoErrMsg, setViewMoreInfoErrMsg] = useState("");
    //JS for to display err msg
    const viewMoreInfoDisplayErrMsg = (errorMessage, trainingId) => {
        setViewMoreInfoErrMsg(errorMessage);
        setViewMoreInfoTrainingId(trainingId);
        setTimeout(() => {
            setViewMoreInfoErrMsg('');
            setViewMoreInfoTrainingId(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-completed-trainings'>
            { loadingBar && <LoadingBar />}
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
                {completedTrainings.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10]}
                        entries={5}
                        pagesAmount={4}
                        data={completedrainingsDataTableData()}
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
                <Modal className='view-more-info-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Training Info & Status
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='training-data'>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Trainer Data</label> <br />
                                    <label>Trainer Name : </label> <span>{viewMoreInfo.trainer.userFirstname + " " + viewMoreInfo.trainer.userLastname}</span> <br />
                                    <label>Experience : </label> <span>{viewMoreInfo.trainer.userExperience}</span> <br />
                                    <label>Trainer Mail : </label> <span>{viewMoreInfo.trainer.username}</span> <br />
                                    <label>Trainer Phone : </label> <span>{viewMoreInfo.trainer.phoneNumberWithCountryCode}</span> <br />
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Training Data</label> <br />
                                    <label>Course : </label> <span>{viewMoreInfo.training.courseName}</span> <br />
                                    <label>Technical-Stack : </label> <span>{viewMoreInfo.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <label>Course Duration : </label> <span>{viewMoreInfo.training.courseDuration + " days"}</span> <br />
                                    <label>Course Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewMoreInfo.training.courseStartDateAndTime)).date}</span> <br />
                                    <label>Course End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(viewMoreInfo.training.courseEndDate)).date}</span> <br />
                                    <label>Course Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(viewMoreInfo.training.courseStartDateAndTime)).time)}</span> <br />
                                    <label>Session Duration : </label> <span>{viewMoreInfo.training.sessionDuration}</span> <br />
                                    <label>Training Status : </label> <span>{'Completed'}</span>
                                </div>
                                <div className='mt-2'>
                                    <label style={{ verticalAlign: 'middle' }}>Average Rating : &nbsp;</label>
                                    <span>
                                        <Rating
                                            size={20}
                                            initialValue={viewMoreInfo.training.rating}
                                            allowFraction
                                            fillColor='#1b4962'
                                            readonly={true}
                                        />
                                    </span>
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
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default AdminCompletedTrainings;