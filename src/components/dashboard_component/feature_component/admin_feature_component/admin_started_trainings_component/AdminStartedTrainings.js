import { CDBDataTable } from 'cdbreact';
import './AdminStartedTrainings.css';
import { useEffect, useState } from 'react';
import AdminService from '../../../../../Services/admin_service/AdminService';
import Constants from '../../../../Constants';
import { Container, Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';


function AdminStartedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getStartedTrainingErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        handleStartedTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [startedTrainings, setStartedTrainings] = useState([]);
    const handleStartedTrainings = async () => {
        setLoadingBar(true);
        try {
            const responseData = await AdminService.getStartedTrainings();
            console.log(responseData);
            if (responseData.length === 0) {
                getStartedTrainingErrMsg('Started trainings are not found');
            } else {
                setStartedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleStartedTrainingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleStartedTrainingsErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getStartedTrainingErrMsg("Sorry, Our service is down");
        else
            getStartedTrainingErrMsg("Could not process your request");
    }

    const startedTrainingsDataTableData = () => {
        const moreInfo = (trainingId) => {
            return (
                <div>
                    <div>
                        <button
                            className='view-btn'
                            onClick={() => handleViewButtonClicked(trainingId)}
                        >
                            View
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
            { label: 'Mail-Id', field: 'trainerMail', width: 70 },
            { label: 'Contact Number', field: 'trainerPhone', width: 70 },
            { label: 'Course', field: 'course', width: 70 },
            { label: 'Start Date', field: 'courseStartDate', width: 70 },
            { label: 'Start Time', field: 'courseStartTime', width: 70 },
            { label: 'End Date', field: 'courseEndDate', width: 70 },
            { label: 'More Info', field: 'moreInfo', width: 70, formatter: moreInfo },
        ];
        const rows = startedTrainings.map((each => {
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
    useEffect(() => {
        // re render component when viewMoreInfo have changes
    }, [viewMoreInfo]);
    const handleViewMoreInfoModalClose = () => {
        setViewMoreInfoModal(false);
        setViewMoreInfo(null);
        setMeetingLink('');
        setCourseEndDate(null);
        setCourseStartDateAndTime(null);
        window.location.reload();
    }
    const handleViewButtonClicked = async (trainingId) => {
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
            setCourseStartDateAndTime(new Date(responseData.training.courseStartDate));
        } catch (error) {
            console.log(error.message);
            handleViewMoreStartedtrainingInfoErrors(error.message, trainingId);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleViewMoreStartedtrainingInfoErrors = (errorStatus, trainingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoDisplayErrMsg("Training is invalid", trainingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoDisplayErrMsg("Entity Not Found", trainingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoDisplayErrMsg("Sorry, Our service is down", trainingId);
        else
            viewMoreInfoDisplayErrMsg("Could not process your request", trainingId);
    }

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

    // meeting link upload code
    const [meetingLink, setMeetingLink] = useState('');
    const handleMeetingLinkChange = (e) => setMeetingLink(e.target.value);
    const handleUploadMeetingLink = async (trainingId) => {
        if (meetingLink === null || meetingLink === '') {
            viewMoreInfoModalDisplayErrMsg('Please Upload Meeting Link');
        } else {
            setLoadingBar(true);
            const uploadMeetingLinkRequest = {
                trainingId: trainingId,
                meetingLink: meetingLink,
            }
            console.log(uploadMeetingLinkRequest);
            try {
                const responseData = await AdminService.uploadMeetingLink(uploadMeetingLinkRequest);
                console.log(responseData);
                viewMoreInfoModalDisplaySucMsg('Successfully Uploaded Meeting Link');
                viewMoreInfo.training.meetingLink = responseData.meetingLink;
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

    const handleRemoveMeetingLink = async (trainingId) => {
        setLoadingBar(true);
        const removeMeetingLinkRequest = {
            trainingId: trainingId,
        }
        console.log(removeMeetingLinkRequest);
        try {
            const responseData = await AdminService.removeMeetingLink(removeMeetingLinkRequest);
            console.log(responseData);
            viewMoreInfoModalDisplaySucMsg('Successfully Removed Meeting Link');
            viewMoreInfo.training.meetingLink = responseData.meetingLink;
            setMeetingLink(viewMoreInfo.training.meetingLink);
        } catch (error) {
            console.log(error.message);
            handleRemoveMeetingLinkErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleRemoveMeetingLinkErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Training id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Sorry, Our service is down");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    // update date and time modal code
    const [courseStartDateAndTime, setCourseStartDateAndTime] = useState(null);
    const timeOnlyPicker = {
        dateFormat: false, // Disable date selection
        timeFormat: true, // Enable time selection
    };
    const handleCourseStartDateChange = (date) => {
        let newDate;
        if (date && typeof date.toDate === 'function') {
            // If `date` is a moment.js object, convert it to a JavaScript Date
            newDate = date.toDate();
        } else if (date instanceof Date) {
            // If `date` is already a JavaScript Date
            newDate = date;
        }
        if (courseStartDateAndTime) {
            // Update only the time part of the current date
            const updatedDate = new Date(courseStartDateAndTime);
            updatedDate.setHours(newDate.getHours());
            updatedDate.setMinutes(newDate.getMinutes());
            updatedDate.setSeconds(newDate.getSeconds());
            setCourseStartDateAndTime(updatedDate);
        }
    };
    const handleUpdateStartTime = async (trainingId) => {
        console.log(trainingId);
        console.log(courseStartDateAndTime);
        if (courseStartDateAndTime === null) {
            viewMoreInfoModalDisplayErrMsg('please, select time to update');
        } else {
            setLoadingBar(true);
            // Convert the date to a string and remove the time zone name
            let formattedDate = courseStartDateAndTime.toString();
            formattedDate = formattedDate.replace(/\s\([^)]+\)$/, '');
            const formData = new FormData();
            formData.append('trainingId', trainingId);
            formData.append('courseStartDateAndTimeString', formattedDate);
            console.log(formData);
            try {
                const responseData = await AdminService.updateDateForTraining(formData);
                console.log(responseData);
                viewMoreInfoModalDisplaySucMsg('Succesfully Updated Time');
                viewMoreInfo.training.courseStartDateAndTime = responseData.courseStartDateAndTime;
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
            viewMoreInfoModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Training is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Sorry, Our service is down");
        else
            viewMoreInfoModalDisplayErrMsg("Could not process your request");
    }

    // update date and time modal code
    const [courseEndDate, setCourseEndDate] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate());
    const isValidDate = (current) => {
        return current.isAfter(minDate);
    };
    const handleCourseEndDateChange = (date) => {
        setCourseEndDate(date);
    };
    const handleUpdateEndDate = async (trainingId) => {
        if (courseEndDate === null) {
            viewMoreInfoModalDisplayErrMsg('Please Select End Date');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('trainingId', trainingId);
            formData.append('courseEndDateString', courseEndDate);
            console.log(formData);
            try {
                const responseData = await AdminService.updateEndDateForTraining(formData);
                console.log(viewMoreInfo.training.courseEndDate + '  ' + responseData.courseEndDate);
                viewMoreInfoModalDisplaySucMsg('Successfully Updated End Date');
                viewMoreInfo.training.courseEndDate = responseData.courseEndDate;
            } catch (error) {
                console.error('Error fetching data for path:', error);
                handleUpdateEndDateErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleUpdateEndDateErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            viewMoreInfoModalDisplayErrMsg("Inputs are invalid");
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
            setMessageColor('#be3144');
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-started-training'>
            {loadingBar && <LoadingBar />}
            <div style={{ overflowX: 'auto', fontSize: '13px', maxHeight: 'calc(100vh - 100px)' }}>
                {startedTrainings.length !== 0 && (
                    <CDBDataTable
                        striped
                        bordered
                        hover
                        entriesOptions={[5, 10, 15]}
                        entries={5}
                        pagesAmount={4}
                        data={startedTrainingsDataTableData()}
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
                <Modal className='update-date-modal' size='lg' show={viewMoreInfoModal} onHide={handleViewMoreInfoModalClose} centered backdrop="static">
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
                                </div>
                                <div className='mt-2'>
                                    <label>Upload Meeting Link</label><br />
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            className='form-control w-75'
                                            value={viewMoreInfo.training.meetingLink !== '' ? viewMoreInfo.training.meetingLink : meetingLink}
                                            onChange={handleMeetingLinkChange}
                                            disabled={viewMoreInfo.training.meetingLink !== ''}
                                            placeholder='Meeting Link'
                                        />
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='upload-meeting-link-btn'
                                            onClick={() => handleUploadMeetingLink(viewMoreInfo.training.trainingId)}
                                            disabled={viewMoreInfo.training.meetingLink !== ''}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='remove-meeting-link-btn'
                                            onClick={() => handleRemoveMeetingLink(viewMoreInfo.training.trainingId)}
                                            disabled={viewMoreInfo.training.meetingLink === ''}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className='date-time mt-2'>
                                    <label>Update Training Start Time</label>
                                    <div style={{ display: 'flex' }}>
                                        <Datetime
                                            value={courseStartDateAndTime}
                                            onChange={handleCourseStartDateChange}
                                            {...timeOnlyPicker}
                                            inputProps={{
                                                placeholder: 'Update Time',
                                                readOnly: true,
                                            }}
                                            className='w-75'
                                        />
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='update-start-time-btn'
                                            onClick={() => handleUpdateStartTime(viewMoreInfo.training.trainingId)}
                                        >
                                            Update Start Time
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label>Update Course End Date</label><br />
                                    <div style={{ display: 'flex' }}>
                                        <Datetime
                                            value={courseEndDate}
                                            onChange={handleCourseEndDateChange}
                                            isValidDate={isValidDate}
                                            inputProps={{
                                                placeholder: 'Update End Date',
                                                readOnly: true,
                                            }}
                                            timeFormat={false}
                                            className='w-75'
                                        />
                                        <button
                                            style={{ marginLeft: '10px' }}
                                            className='update-end-date-btn'
                                            onClick={() => handleUpdateEndDate(viewMoreInfo.training.trainingId)}
                                        >
                                            Update End Date
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

export default AdminStartedTrainings;