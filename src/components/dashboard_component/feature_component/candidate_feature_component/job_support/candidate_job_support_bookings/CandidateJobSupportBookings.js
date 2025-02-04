import { useEffect, useState } from 'react';
import './CandidateJobSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Button, Card, Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { FaBars, FaRedo } from 'react-icons/fa';
import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';
import GlobalService from '../../../../../../Services/global_service/GlobalService';

function CandidateJobSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    let hasOptionsInCardDropdown = false;

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getCandidateJobSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getCandidateJobSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [candidateJobSupportBookings, setCandidateJobSupportBookings] = useState([]);
    const getCandidateJobSupportBookings = async () => {
        setLoadingBar(true);
        const candidateJobSupportBookingsRequest = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const candidateJobSupportBookingsResponse = await CandidateService.getCandidateJobSupportBookingByCandidateId(candidateJobSupportBookingsRequest);
            console.log(candidateJobSupportBookingsResponse);
            if (candidateJobSupportBookingsResponse.length === 0) {
                getCandidateJobSupportBookingsDisplayErrMsg('Job Support Bookings are not found');
            } else {
                setCandidateJobSupportBookings(candidateJobSupportBookingsResponse);
            }
        } catch (error) {
            console.log(error.message);
            handleCandidateJobSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleCandidateJobSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getCandidateJobSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getCandidateJobSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getCandidateJobSupportBookingsDisplayErrMsg("Could not process your request");
    }

    const handleCancelBookingButton = async (jobSupportBookingId) => {
        setLoadingBar(true);
        const cancelBookingRequest = {
            jobSupportBookingId: jobSupportBookingId,
        }

        try {
            const cancelBookingResponse = await CandidateService.cancelJobSupportBooking(cancelBookingRequest);
            console.log(cancelBookingResponse);
            handleJobSupportCardSucMsg('Successfully Cancelled Booking', jobSupportBookingId);
        } catch (error) {
            console.log(error.message);
            handleCancelBookingErrors(error.message, jobSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleCancelBookingErrors = (errorStatus, jobSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleJobSupportCardErrMsg("Request is invalid", jobSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleJobSupportCardErrMsg("Booking is Not Found", jobSupportBookingId);
        else
            handleJobSupportCardErrMsg("Could not process your request", jobSupportBookingId);
    }

    const [jobSupportCard, setJobSupportCard] = useState(0);
    const [jobSupportCardErr, setJobSupportCardErr] = useState('');
    const handleJobSupportCardErrMsg = (errorMessage, jobSupportBookingId) => {
        setJobSupportCardErr(errorMessage);
        setJobSupportCard(jobSupportBookingId);
        setTimeout(() => {
            setJobSupportCardErr('');
            setJobSupportCard(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const handleJobSupportCardSucMsg = (errorMessage, jobSupportBookingId) => {
        setMessageColor('green');
        setJobSupportCardErr(errorMessage);
        setJobSupportCard(jobSupportBookingId);
        setTimeout(() => {
            setJobSupportCardErr('');
            setJobSupportCard(0);
            setMessageColor(Constants.MESSAGE_COLOR);
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [selectedJobSupport, setSelectedJobSupport] = useState(null);
    const handleRescheduleJobSupportClick = async (data) => {
        setLoadingBar(true);
        const request = {
            jobSupportId: data.jobSupportDto.jobSupportId,
        }
        try {
            const timeSlotsResponseData = await CandidateService.loadAvailableSlotsOnJobSupportId(request);
            console.log(timeSlotsResponseData);
            setTimeSlotList(timeSlotsResponseData);
            setSelectedJobSupport(data);
            if (isStartDateLessThanOrEqualToCurrentDate(data.jobSupportBookingDto.startDate)) {
                const backendDateMoment = moment(data.jobSupportBookingDto.startDate, 'YYYY-MM-DD');
                handleSelectedJobSupporStarttDate(backendDateMoment);
            }
            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleRescheduleJobSupportClickErrors(error.message, data.jobSupportBookingDto.jobSupportBookingId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleRescheduleJobSupportClickErrors = (errorStatus, jobSupportBookingId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleJobSupportCardErrMsg("Inputs are invalid", jobSupportBookingId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleJobSupportCardErrMsg("Entity Not Found", jobSupportBookingId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleJobSupportCardErrMsg("Sorry, Our service is down", jobSupportBookingId);
        else
            handleJobSupportCardErrMsg("Could not process your request", jobSupportBookingId);
    }

    const getCurrentDateInYYYYMMDDFormat = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isStartDateLessThanOrEqualToCurrentDate = (startDate) => {
        const currentDate = new Date(getCurrentDateInYYYYMMDDFormat());
        const startDateObj = new Date(startDate);

        if (startDateObj < currentDate) {
            return true;
        } else if (startDateObj > currentDate) {
            return false;
        } else {
            return true;
        }
    };

    const isCurrentDateLessThanStartDate = (startDate) => {
        const currentDate = new Date(getCurrentDateInYYYYMMDDFormat());
        const startDateObj = new Date(startDate);

        if (currentDate < startDateObj) {
            return true;
        } else {
            return false;
        }
    };

    const isCurrentDateGreaterThanStartDate = (startDate) => {
        const currentDate = new Date(getCurrentDateInYYYYMMDDFormat());
        const startDateObj = new Date(startDate);

        if (currentDate > startDateObj) {
            return true;
        } else {
            return false;
        }
    };

    const isEndDateGreaterByOneDayOrTwoDaysOrEqualToCurrentDate = (endDate) => {
        const currentDate = new Date(getCurrentDateInYYYYMMDDFormat());
        const endDateObj = new Date(endDate);

        const oneDayLater = new Date(currentDate);
        oneDayLater.setDate(currentDate.getDate() + 1);

        const twoDaysLater = new Date(currentDate);
        twoDaysLater.setDate(currentDate.getDate() + 2);

        if (currentDate.getTime() === endDateObj.getTime()) {
            return true;
        } else if (oneDayLater.getTime() === endDateObj.getTime()) {
            return true;
        } else if (twoDaysLater.getTime() === endDateObj.getTime()) {
            return true;
        } else {
            return false;
        }
    };

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedJobSupport(null);
        setSelectedJobSupportStartDate(null);
        setSelectedJobSupportEndDate(null);
        setTimeSlotList([]);
        setSelectedSlots([]);
    };

    // date
    const [selectedJobSupportStartDate, setSelectedJobSupportStartDate] = useState(null);
    const [selectedJobSupportEndDate, setSelectedJobSupportEndDate] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate());
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleSelectedJobSupporStarttDate = (date) => {
        setSelectedJobSupportStartDate(date);
        const newDate = moment(date).add((30 - 1), 'days');
        setSelectedJobSupportEndDate(newDate);
    };
    const handleSelectedJobSupportEndDate = (date) => {
        setSelectedJobSupportEndDate(date);
    };

    // time slot code
    const [timeSlotList, setTimeSlotList] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const handleTimeSlotClick = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
        console.log(selectedSlots);
    };
    const handleTimeSlotReload = () => {
        setSelectedSlots([]);
    };

    const handleRescheduleBooking = async () => {
        if (selectedSlots === null || selectedSlots.length === 0) {
            selectedJobSupportModalDisplayErrMsg('select slots to book job support');
        } else if (selectedJobSupportStartDate === null) {
            selectedJobSupportModalDisplayErrMsg('select job support start date');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('jobSupportId', selectedJobSupport.jobSupportDto.jobSupportId);
            formData.append('candidateId', localStorage.getItem('breezeUserId'));
            formData.append('startDateString', selectedJobSupportStartDate);
            formData.append('endDateString', selectedJobSupportEndDate);
            formData.append('timeSlotList', (selectedSlots.map(slot => slot.timeSlotId)));
            console.log(formData);
            try {
                const responseData = await CandidateService.rescheduleJobSupportBooking(formData);
                console.log(responseData);
                selectedJobSupportModalDisplaySucMsg('Your Booking has Rescheduled, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleRescheduleBookingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleRescheduleBookingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            selectedJobSupportModalDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            selectedJobSupportModalDisplayErrMsg("Your Booking is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            selectedJobSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            selectedJobSupportModalDisplayErrMsg("Could not process your request");
    }

    const [selectedJobSupportModalErrMsgDiv, setSelectedJobSupportModalErrMsgDiv] = useState(false);
    const [selectedJobSupportModalErrMsg, setSelectedJobSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const selectedJobSupportModalDisplayErrMsg = (errorMessage) => {
        setSelectedJobSupportModalErrMsg(errorMessage);
        setSelectedJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedJobSupportModalErrMsg("");
            setSelectedJobSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const selectedJobSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setSelectedJobSupportModalErrMsg(errorMessage);
        setSelectedJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedJobSupportModalErrMsg("");
            setSelectedJobSupportModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    // stop booking code
    const [stopBookingId, setStopBookingId] = useState(0);
    const handleStopBooking = (bookingId) => {
        setStopBookingId(bookingId);
        setShowConfirmStopBookingModal(true);
    }

    const [showConfirmStopBookingModal, setShowConfirmStopBookingModal] = useState(false);
    const handleConfirmStopBookingModalClose = () => {
        setShowConfirmStopBookingModal(false);
        setStopBookingId(0);
    };

    const handleConfirmStopBooking = async () => {
        if (stopBookingId === 0) {
            confirmStopJobSupportModalDisplayErrMsg('Booking Id is invalid');
        } else {
            setLoadingBar(true);
            const request = {
                jobSupportBookingId: stopBookingId
            }
            try {
                const responseData = await CandidateService.stopJobSupportBooking(request);
                console.log(responseData);
                confirmStopJobSupportModalDisplaySucMsg('Your Booking has Stopped, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleConfirmStopJobSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleConfirmStopJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            confirmStopJobSupportModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            confirmStopJobSupportModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            confirmStopJobSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            confirmStopJobSupportModalDisplayErrMsg("Could not process your request");
    }

    const [confirmStopJobSupportModalErrMsgDiv, setConfirmStopJobSupportModalErrMsgDiv] = useState(false);
    const [confirmStopJobSupportModalErrMsg, setConfirmStopJobSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const confirmStopJobSupportModalDisplayErrMsg = (errorMessage) => {
        setConfirmStopJobSupportModalErrMsg(errorMessage);
        setConfirmStopJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setConfirmStopJobSupportModalErrMsg("");
            setConfirmStopJobSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const confirmStopJobSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setConfirmStopJobSupportModalErrMsg(errorMessage);
        setConfirmStopJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setConfirmStopJobSupportModalErrMsg("");
            setConfirmStopJobSupportModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleConfirmStopBookingModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    // continue booking code
    const [continueBookingId, setContinueBookingId] = useState(0);
    const [continueEndDate, setContinueEndDate] = useState('');
    const handleContinueBooking = (bookingId, endDate) => {
        setContinueBookingId(bookingId);
        setContinueEndDate(endDate);
        setShowConfirmContinueBookingModal(true);
    }

    const [showConfirmContinueBookingModal, setShowConfirmContinueBookingModal] = useState(false);
    const handleConfirmContinueBookingModalClose = () => {
        setShowConfirmContinueBookingModal(false);
        setContinueBookingId(0);
    };

    const handleConfirmContinueBooking = async () => {
        if (continueBookingId === 0) {
            confirmContinueJobSupportModalDisplayErrMsg('Booking Id is invalid');
        } else {
            setLoadingBar(true);
            const request = {
                jobSupportBookingId: continueBookingId
            }
            try {
                const responseData = await CandidateService.continueJobSupportBooking(request);
                console.log(responseData);
                confirmContinueJobSupportModalDisplaySucMsg('Your Booking has Continued, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleConfirmContinueJobSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleConfirmContinueJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            confirmContinueJobSupportModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            confirmContinueJobSupportModalDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            confirmContinueJobSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            confirmContinueJobSupportModalDisplayErrMsg("Could not process your request");
    }

    const [confirmContinueJobSupportModalErrMsgDiv, setConfirmContinueJobSupportModalErrMsgDiv] = useState(false);
    const [confirmContinueJobSupportModalErrMsg, setConfirmContinueJobSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const confirmContinueJobSupportModalDisplayErrMsg = (errorMessage) => {
        setConfirmContinueJobSupportModalErrMsg(errorMessage);
        setConfirmContinueJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setConfirmContinueJobSupportModalErrMsg("");
            setConfirmContinueJobSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const confirmContinueJobSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setConfirmContinueJobSupportModalErrMsg(errorMessage);
        setConfirmContinueJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setConfirmContinueJobSupportModalErrMsg("");
            setConfirmContinueJobSupportModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleConfirmContinueBookingModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const addDaysToEndDate = (endDateString, daysToAdd) => {
        const date = new Date(endDateString);
        date.setDate(date.getDate() + daysToAdd);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // assign code
    const [previousBookingData, setPreviousBookingData] = useState(null);
    const handleAssignClick = async (data) => {
        setPreviousBookingData(data);
        await getAllTechnology();
        setShowAssignModal(true);
        setApprovedJobSupports([]);
    }

    const [showAssignModal, setShowAssignModal] = useState(false);
    const handleAssignModalClose = () => {
        setShowAssignModal(false);
        setPreviousBookingData(null);
        setTechnologiesList([]);
    };

    // technology code
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        setTechnologies([...selectedList]);
        console.log(selectedItem);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
        console.log(removedItem);
    }

    // assign modal technologies err msg
    const [technologiesErrMsgDiv, setTechnologiesErrMsgDiv] = useState(false);
    const [technologiesErrMsg, setTechnologiesErrMsg] = useState("");
    //JS for to display err msg
    const getAllTechnologyDisplayErrMsg = (errorMessage) => {
        setTechnologiesErrMsg(errorMessage);
        setTechnologiesErrMsgDiv(true);
        setTimeout(() => {
            setTechnologiesErrMsg("");
            setTechnologiesErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const getAllTechnology = async () => {
        setLoadingBar(true);
        try {
            const responseData = await GlobalService.getAllTechnology();
            console.log(responseData);
            if (responseData.length === 0) {
                getAllTechnologyDisplayErrMsg('Technical Stack are not found');
            } else {
                setTechnologiesList(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleGetAllTechnologyErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    };

    const handleGetAllTechnologyErrors = (errorStatus) => {
        if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getAllTechnologyDisplayErrMsg("Sorry, Our service is down");
        else
            getAllTechnologyDisplayErrMsg("Could not process your request");
    }

    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const size = 6;
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
    }

    useEffect(() => {
        handleSearchJobSupportsByTechnologies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [approvedJobSupports, setApprovedJobSupports] = useState([]);
    const handleSearchJobSupportsByTechnologies = async () => {
        console.log(technologies);
        if (!Array.isArray(technologies) || technologies.length === 0) {
            getAllTechnologyDisplayErrMsg("please select technical stack for job support");
            setApprovedJobSupports([]);
        } else {
            setLoadingBar(true);
            const request = {
                technologyList: technologies,
                page: page,
                size: size,
            }
            try {
                const responseData = await GlobalService.searchJobSupportsByTechnologies(request);
                console.log(responseData);
                setIsLastPage(responseData.isLastPage);
                if (responseData.jobSupportWithJobSupporterList.length === 0) {
                    getAllTechnologyDisplayErrMsg('Job Supports are not found');
                    setApprovedJobSupports([]);
                } else {
                    setApprovedJobSupports(responseData.jobSupportWithJobSupporterList);
                }
            } catch (error) {
                console.log(error.message);
                // handleGetAllTechnologyErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const [jobSupportsCard, setJobSupportsCard] = useState(0);
    const [jobSupportsCardErr, setJobSupportsCardErr] = useState('');
    const handleJobSupportsCardErrMsg = (errorMessage, jobSupportId) => {
        setJobSupportsCardErr(errorMessage);
        setJobSupportsCard(jobSupportId);
        setTimeout(() => {
            setJobSupportsCardErr('');
            setJobSupportsCard(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [newJobSupport, setNewJobSupport] = useState(null);
    const handleJobSupportAssignClick = async (jobSupportId) => {
        setLoadingBar(true);
        const request = {
            jobSupportId: jobSupportId,
        }
        try {
            const responseData = await CandidateService.viewCandidateSelectedJobSupport(request);
            console.log(responseData);
            setNewJobSupport(responseData);

            const timeSlotsResponseData = await CandidateService.loadAvailableSlotsOnJobSupportId(request);
            console.log(timeSlotsResponseData);
            setNewTimeSlotList(timeSlotsResponseData);

            setShowNewModal(true);
        } catch (error) {
            console.log(error.message);
            handleJobSupportAssignClickErrors(error.message, jobSupportId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleJobSupportAssignClickErrors = (errorStatus, jobSupportId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleJobSupportsCardErrMsg("Inputs are invalid", jobSupportId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleJobSupportsCardErrMsg("Entity Not Found", jobSupportId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleJobSupportsCardErrMsg("Sorry, Our service is down", jobSupportId);
        else
            handleJobSupportsCardErrMsg("Could not process your request", jobSupportId);
    }

    const [showNewModal, setShowNewModal] = useState(false);
    const handleNewModalClose = () => {
        setShowNewModal(false);
        setNewJobSupport(null);
        setNewTimeSlotList([]);
        setNewSlots([]);
    };

    // time slot code
    const [newTimeSlotList, setNewTimeSlotList] = useState([]);
    const [newSlots, setNewSlots] = useState([]);
    const handleNewTimeSlotClick = (slot) => {
        if (newSlots.includes(slot)) {
            setNewSlots(newSlots.filter(s => s !== slot));
        } else {
            setNewSlots([...newSlots, slot]);
        }
        console.log(newSlots);
    };
    const handleNewTimeSlotReload = () => {
        setNewSlots([]);
    };

    const handleConfirmAssigning = async () => {
        if (newSlots === null || newSlots.length === 0) {
            newJobSupportModalDisplayErrMsg('select slots to book job support');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('jobSupportBookingId', previousBookingData.jobSupportBookingDto.jobSupportBookingId);
            formData.append('newJobSupportId', newJobSupport.jobSupport.jobSupportId);
            formData.append('newTimeSlotsList', (newSlots.map(slot => slot.timeSlotId)));
            console.log(formData);
            try {
                const responseData = await CandidateService.confirmAssignNewJobSupporter(formData);
                console.log(responseData);
                newJobSupportModalDisplaySucMsg('Your Booking has Assigned a New Job Supporter, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleConfirmAssigningErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleConfirmAssigningErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            newJobSupportModalDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            newJobSupportModalDisplayErrMsg("You Job Support Booking is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            newJobSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            newJobSupportModalDisplayErrMsg("Could not process your request");
    }

    const [newJobSupportModalErrMsgDiv, setNewJobSupportModalErrMsgDiv] = useState(false);
    const [newJobSupportModalErrMsg, setNewJobSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const newJobSupportModalDisplayErrMsg = (errorMessage) => {
        setNewJobSupportModalErrMsg(errorMessage);
        setNewJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setNewJobSupportModalErrMsg("");
            setNewJobSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const newJobSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setNewJobSupportModalErrMsg(errorMessage);
        setNewJobSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setNewJobSupportModalErrMsg("");
            setNewJobSupportModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleNewModalClose();
            handleAssignModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='candidate-job-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {candidateJobSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Job Support Booking"}</Card.Title>
                            <Dropdown align="end">
                                <Dropdown.Toggle as="div" style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}>
                                    <FaBars />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {isCurrentDateLessThanStartDate(item.jobSupportBookingDto.startDate) && (
                                        (hasOptionsInCardDropdown = true) &&
                                        <Dropdown.Item
                                            onClick={() => handleCancelBookingButton(item.jobSupportBookingDto.jobSupportBookingId)}
                                        >
                                            Cancel Booking
                                        </Dropdown.Item>
                                    )}
                                    {(item.jobSupportBookingDto.rescheduledStatus !== Constants.HOLD &&
                                        item.jobSupportBookingDto.stopStatus !== Constants.HOLD &&
                                        item.jobSupportBookingDto.continueStatus !== Constants.HOLD &&
                                        item.jobSupportBookingDto.assignedStatus !== Constants.HOLD) && (
                                            <>
                                                {(item.jobSupportBookingDto.adminStatus === Constants.CONFIRMED &&
                                                    !(item.jobSupportBookingDto.rescheduledStatus === Constants.HOLD)) && (
                                                        (hasOptionsInCardDropdown = true) &&
                                                        <Dropdown.Item
                                                            onClick={() => handleRescheduleJobSupportClick(item)}
                                                        >
                                                            Reschedule Booking
                                                        </Dropdown.Item>
                                                    )}
                                                {(isCurrentDateGreaterThanStartDate(item.jobSupportBookingDto.startDate) &&
                                                    !(item.jobSupportBookingDto.stopStatus === Constants.HOLD)) && (
                                                        (hasOptionsInCardDropdown = true) &&
                                                        <Dropdown.Item
                                                            onClick={() => handleStopBooking(item.jobSupportBookingDto.jobSupportBookingId)}
                                                        >
                                                            Stop Booking
                                                        </Dropdown.Item>
                                                    )}
                                                {(isEndDateGreaterByOneDayOrTwoDaysOrEqualToCurrentDate(item.jobSupportBookingDto.endDate) &&
                                                    !(item.jobSupportBookingDto.continueStatus === Constants.HOLD)) && (
                                                        (hasOptionsInCardDropdown = true) &&
                                                        <Dropdown.Item
                                                            onClick={() => handleContinueBooking(item.jobSupportBookingDto.jobSupportBookingId, item.jobSupportBookingDto.endDate)}
                                                        >
                                                            Continue Booking
                                                        </Dropdown.Item>
                                                    )}
                                                {(isCurrentDateGreaterThanStartDate(item.jobSupportBookingDto.startDate) &&
                                                    !(item.jobSupportBookingDto.assignedStatus === Constants.HOLD)) && (
                                                        (hasOptionsInCardDropdown = true) &&
                                                        <Dropdown.Item
                                                            onClick={() => handleAssignClick(item)}
                                                        >
                                                            Assign New Job Supporter
                                                        </Dropdown.Item>
                                                    )}
                                            </>
                                        )}
                                    {!hasOptionsInCardDropdown && (
                                        <Dropdown.Item className='no-options'>
                                            No options
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* <div style={{ display: 'flex', gap: '20px' }}>
                                {isCurrentDateLessThanStartDate(item.jobSupportBookingDto.startDate) && (
                                    <button
                                        className='cancel-booking-button'
                                        onClick={() => handleCancelBookingButton(item.jobSupportBookingDto.jobSupportBookingId)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                                {(item.jobSupportBookingDto.rescheduledStatus !== Constants.HOLD && item.jobSupportBookingDto.stopStatus !== Constants.HOLD && item.jobSupportBookingDto.continueStatus !== Constants.HOLD && item.jobSupportBookingDto.assignedStatus !== Constants.HOLD) && (
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        {(item.jobSupportBookingDto.adminStatus === Constants.CONFIRMED && !(item.jobSupportBookingDto.rescheduledStatus === Constants.HOLD)) && (
                                            <button
                                                className='reschedule-booking-button'
                                                onClick={() => handleRescheduleJobSupportClick(item)}
                                            >
                                                Reschedule Booking
                                            </button>
                                        )}
                                        {(isCurrentDateGreaterThanStartDate(item.jobSupportBookingDto.startDate) && !(item.jobSupportBookingDto.stopStatus === Constants.HOLD)) && (
                                            <button
                                                className='stop-booking-button'
                                                onClick={() => handleStopBooking(item.jobSupportBookingDto.jobSupportBookingId)}
                                            >
                                                Stop Booking
                                            </button>
                                        )}
                                        {(isEndDateGreaterByOneDayOrTwoDaysOrEqualToCurrentDate(item.jobSupportBookingDto.endDate) && !(item.jobSupportBookingDto.continueStatus === Constants.HOLD)) && (
                                            <button
                                                className='continue-booking-button'
                                                onClick={() => handleContinueBooking(item.jobSupportBookingDto.jobSupportBookingId, item.jobSupportBookingDto.endDate)}
                                            >
                                                Continue Booking
                                            </button>
                                        )}
                                        {(isCurrentDateGreaterThanStartDate(item.jobSupportBookingDto.startDate) && !(item.jobSupportBookingDto.assignedStatus === Constants.HOLD)) && (
                                            <button
                                                className='assign-booking-button'
                                                onClick={() => handleAssignClick(item)}
                                            >
                                                Assign New Job Supporter
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div> */}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Job Supporter-Name : </label> <span>{item.jobSupporter.userFirstname + " " + item.jobSupporter.userLastname}</span> <br />
                                <label>Job Supporter-Experience : </label> <span>{item.jobSupporter.userExperience}</span> <br />
                                <div>
                                    <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                    <span>
                                        <Rating
                                            size={20}
                                            initialValue={item.jobSupportDto.rating}
                                            allowFraction
                                            fillColor='#1b4962'
                                            readonly={true}
                                        />
                                    </span> <br />
                                </div>
                                <label>Technical-Stack : </label> <span>{item.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.jobSupportBookingDto.startDate)).date}</span> <br />
                                <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.jobSupportBookingDto.endDate)).date}</span> <br />
                                <div className='time-slots'>
                                    <label>Booked Slots : </label>
                                    <div className='time-slot-container'>
                                        {item.jobSupportBookingDto.timeSlotList.map((item, index) => (
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label>Project Description(PD) : </label> <span className='project-description'>{item.jobSupportBookingDto.projectDescription ? item.jobSupportBookingDto.projectDescription : ('Not Provided')}</span> <br />
                                    </div>
                                    {item.jobSupportBookingDto.adminStatus === Constants.HOLD && (
                                        <button
                                            className='booking-status-pending-button'
                                        >
                                            <i class="fas fa-hourglass-half"></i>
                                            Pending
                                        </button>
                                    )}
                                    {item.jobSupportBookingDto.adminStatus === Constants.CONFIRMED && (
                                        <button
                                            className='booking-status-confirmed-button'
                                        >
                                            <i class="fas fa-check-circle"></i>
                                            Confirmed
                                        </button>
                                    )}
                                </div>
                                <div>
                                    {jobSupportCard === item.jobSupportBookingDto.jobSupportBookingId && (
                                        <div style={customCssForMsg}>
                                            <label>{jobSupportCardErr}</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                        {(item.jobSupportBookingDto.rescheduledStatus !== '' || item.jobSupportBookingDto.stopStatus !== '' || item.jobSupportBookingDto.continueStatus !== '') && (
                            <Card.Footer>
                                {item.jobSupportBookingDto.rescheduledStatus !== '' && (
                                    <div>
                                        <label>Rescheduled Status : </label><span>{item.jobSupportBookingDto.rescheduledStatus === 'HOLD' ? ('PENDING') : item.jobSupportBookingDto.rescheduledStatus}</span>
                                    </div>
                                )}
                                {item.jobSupportBookingDto.stopStatus !== '' && (
                                    <div>
                                        <label>Stop Status : </label><span>{item.jobSupportBookingDto.stopStatus === 'HOLD' ? ('PENDING') : item.jobSupportBookingDto.stopStatus}</span>
                                    </div>
                                )}
                                {item.jobSupportBookingDto.continueStatus !== '' && (
                                    <div>
                                        <label>Continue Status : </label><span>{item.jobSupportBookingDto.continueStatus === 'HOLD' ? ('PENDING') : item.jobSupportBookingDto.continueStatus}</span>
                                    </div>
                                )}
                                {item.jobSupportBookingDto.assignedStatus !== '' && (
                                    <div>
                                        <label>Assigned New Job Supporter Status : </label><span>{item.jobSupportBookingDto.assignedStatus === 'HOLD' ? ('PENDING') : item.jobSupportBookingDto.assignedStatus}</span>
                                    </div>
                                )}
                            </Card.Footer>
                        )}
                    </Card>
                ))}
            </div>
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
            {showModal && (
                <Modal className='view-selected-reschedule-job-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Reschedule Booking
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-and-job-supporter-data'>
                                <div className='job-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Name : </label> <span>{selectedJobSupport.jobSupporter.userFirstname + " " + selectedJobSupport.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{selectedJobSupport.jobSupporter.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{selectedJobSupport.jobSupportDto.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={selectedJobSupport.jobSupportDto.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {isStartDateLessThanOrEqualToCurrentDate(selectedJobSupport.jobSupportBookingDto.startDate) ? (
                                        <div className='mt-3'>
                                            <label>You can't change start date as your job support has started, You can reschedule booked slots.</label><br />
                                            <label>Start Date : </label> <span>{selectedJobSupport.jobSupportBookingDto.startDate}</span> <br />
                                            <label>End Date : </label> <span>{selectedJobSupport.jobSupportBookingDto.endDate}</span> <br />
                                        </div>
                                    ) : (
                                        <div className='select-date mt-3'>
                                            <label>Select Start Date for Job Support <strong>(You can select from current date to next 7 days)</strong></label>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div>
                                                    <label>Start Date : </label>
                                                    <Datetime
                                                        value={selectedJobSupportStartDate}
                                                        onChange={handleSelectedJobSupporStarttDate}
                                                        isValidDate={isValidDate}
                                                        inputProps={{
                                                            placeholder: 'Select Start Date',
                                                            readOnly: true,
                                                        }}
                                                        timeFormat={false}
                                                    />
                                                </div>
                                                <div>
                                                    <label>End Date : </label>
                                                    <Datetime
                                                        value={selectedJobSupportEndDate}
                                                        onChange={handleSelectedJobSupportEndDate}
                                                        inputProps={{
                                                            placeholder: 'End Date',
                                                            readOnly: true,
                                                        }}
                                                        timeFormat={false}
                                                        open={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {timeSlotList.length !== 0 && (
                                    <div className='time-slots mt-3'>
                                        <div className="label-container">
                                            <label>Select Available Time Slots</label>
                                            <div className="reload-container" onClick={handleTimeSlotReload}>
                                                <FaRedo className="reload-icon" />
                                                <span className="reload-text">Uncheck All Slots</span>
                                            </div>
                                        </div>
                                        <div className="time-slot-container" >
                                            {timeSlotList.map((item, index) => (
                                                <div>
                                                    <button
                                                        key={index}
                                                        type='button'
                                                        className={`time-slot-button ${selectedSlots.includes(item) ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSlotClick(item)}
                                                        disabled={item.isBooked}
                                                        title={item.isBooked ? 'Slot is Booked' : ''}
                                                    >
                                                        {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className='mt-2'>
                                    {selectedJobSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{selectedJobSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        {timeSlotList.length !== 0 && (
                            <Modal.Footer>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        className='modal-button'
                                        onClick={handleRescheduleBooking}
                                    >
                                        Reschedule Booking
                                    </button>
                                </div>
                            </Modal.Footer>
                        )}
                    </Container>
                </Modal>
            )}
            {showConfirmStopBookingModal && (
                <Modal className='confirm-stop-job-support-modal' size='md' show={showConfirmStopBookingModal} onHide={handleConfirmStopBookingModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Stop Booking
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className=''>
                                <div className=''>
                                    <label style={{ fontWeight: 'bold' }}>Confirm to Stop the Job Support</label>
                                </div>
                                <div className='mt-2'>
                                    {confirmStopJobSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{confirmStopJobSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    className='modal-button'
                                    onClick={handleConfirmStopBooking}
                                >
                                    Confirm Stop
                                </button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
            {showConfirmContinueBookingModal && (
                <Modal className='confirm-continue-job-support-modal' size='md' show={showConfirmContinueBookingModal} onHide={handleConfirmContinueBookingModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Continue Booking
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className=''>
                                <div className=''>
                                    <label>If your Continue Job Support Confirmed, Your Job Support Service will be Extended to {addDaysToEndDate(continueEndDate, 30)}</label>
                                    <label style={{ fontWeight: 'bold', marginTop: '5px' }}>Confirm to Continue the Job Support</label>
                                </div>
                                <div className='mt-2'>
                                    {confirmContinueJobSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{confirmContinueJobSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    className='modal-button'
                                    onClick={handleConfirmContinueBooking}
                                >
                                    Confirm Continue
                                </button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
            {showAssignModal && (
                <Modal className='assign-new-job-supporter-modal' size='xl' show={showAssignModal} onHide={handleAssignModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Assign New Job Supporter
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className=''>
                                <div className='technology-multiselect' style={{ fontSize: '13px' }}>
                                    <label>Select Technical Stack</label>
                                    <Row className='d-flex justify-content-between flex-wrap'>
                                        <Col xs={12} sm={8} className='mb-2'>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
                                                onSelect={onSelectTechnology}
                                                onRemove={onRemoveTechnology}
                                                displayValue="technologyName"
                                                placeholder="Technical Stack"
                                                avoidHighlightFirstOption={true}
                                                style={{
                                                    chips: {
                                                        background: childColor,
                                                    },
                                                }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={4} className='mb-2'>
                                            <Button
                                                className='search-button-horizontal'
                                                onClick={handleSearchJobSupportsByTechnologies}
                                            >
                                                Search
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div className=''>
                                        {technologiesErrMsgDiv &&
                                            <div style={customCssForMsg}>
                                                <label>{technologiesErrMsg}</label>
                                            </div>}
                                    </div>
                                </div>
                                <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {approvedJobSupports.map((item, index) => (
                                        <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                                            <Card.Body>
                                                <Card.Text>
                                                    <label>Job Supporter-Name : </label> <span>{item.jobSupporter.userFirstname + " " + item.jobSupporter.userLastname}</span> <br />
                                                    <label>Job Supporter-Experience : </label> <span>{item.jobSupporter.userExperience}</span> <br />
                                                    <label>Technical-Stack : </label> <span>{item.jobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                                            <span>
                                                                <Rating
                                                                    size={20}
                                                                    initialValue={item.jobSupport.rating}
                                                                    allowFraction
                                                                    fillColor='#1b4962'
                                                                    readonly={true}
                                                                />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <button
                                                                className='book-button'
                                                                onClick={() => handleJobSupportAssignClick(item.jobSupport.jobSupportId)}
                                                            >
                                                                Assign
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {jobSupportsCard === item.jobSupport.jobSupportId && (
                                                            <div style={customCssForMsg}>
                                                                <label>{jobSupportsCardErr}</label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                                {approvedJobSupports.length !== 0 && (
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
                            </div>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
            {showNewModal && (
                <Modal className='view-new-job-support-modal' size='lg' show={showNewModal} onHide={handleNewModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Confirm New Job Supporter
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-and-job-supporter-data'>
                                <div className='job-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>New Job Supporter Data</label> <br />
                                    <label>New Job Supporter-Name : </label> <span>{newJobSupport.jobSupporter.userFirstname + " " + newJobSupport.jobSupporter.userLastname}</span> <br />
                                    <label>New Job Supporter-Experience : </label> <span>{newJobSupport.jobSupporter.userExperience}</span> <br />
                                    <label>New Technical-Stack : </label> <span>{newJobSupport.jobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={newJobSupport.jobSupport.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className='select-date mt-3'>
                                        <label>Your Dates will not Change</label> <br />
                                        <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(previousBookingData.jobSupportBookingDto.startDate)).date}</span> <br />
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(previousBookingData.jobSupportBookingDto.endDate)).date}</span> <br />
                                    </div>
                                </div>
                                {newTimeSlotList.length !== 0 && (
                                    <div className='time-slots mt-3'>
                                        <div className="label-container">
                                            <label>Select Available Time Slots</label>
                                            <div className="reload-container" onClick={handleNewTimeSlotReload}>
                                                <FaRedo className="reload-icon" />
                                                <span className="reload-text">Uncheck All Slots</span>
                                            </div>
                                        </div>
                                        <div className="time-slot-container" >
                                            {newTimeSlotList.map((item, index) => (
                                                <div>
                                                    <button
                                                        key={index}
                                                        type='button'
                                                        className={`time-slot-button ${newSlots.includes(item) ? 'selected' : ''}`}
                                                        onClick={() => handleNewTimeSlotClick(item)}
                                                        disabled={item.isBooked}
                                                        title={item.isBooked ? 'Slot is Booked' : ''}
                                                    >
                                                        {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className='mt-2'>
                                    {newJobSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{newJobSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        {newTimeSlotList.length !== 0 && (
                            <Modal.Footer>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        className='modal-button'
                                        onClick={handleConfirmAssigning}
                                    >
                                        Confirm Assigning
                                    </button>
                                </div>
                            </Modal.Footer>
                        )}
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CandidateJobSupportBookings;