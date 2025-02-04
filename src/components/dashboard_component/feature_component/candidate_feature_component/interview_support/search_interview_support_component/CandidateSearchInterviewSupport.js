import { useEffect, useState } from 'react';
import './CandidateSearchInterviewSupport.css';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Rating } from 'react-simple-star-rating';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import CandidateService from "../../../../../../Services/candidate_service/CandidateService";
import { FaRedo } from 'react-icons/fa';

function CandidateSearchInterviewSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const userId = localStorage.getItem("breezeUserId");

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    // const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

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

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getAllTechnologyDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        getAllTechnology();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        handleSearchInterviewSupportsByTechnologies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const [approvedInterviewSupports, setApprovedInterviewSupports] = useState([]);
    const handleSearchInterviewSupportsByTechnologies = async () => {
        console.log(technologies);
        if (!Array.isArray(technologies) || technologies.length === 0) {
            getAllTechnologyDisplayErrMsg("please select atleast one technical stack to search Interview Supports");
            setApprovedInterviewSupports([]);
        } else {
            setLoadingBar(true);
            const request = {
                technologyList: technologies,
                page: page,
                size: size,
            }
            try {
                const responseData = await GlobalService.searchInterviewSupportsByTechnologies(request);
                console.log(responseData);
                setIsLastPage(responseData.isLastPage);
                if (responseData.interviewSupportWithInterviewSupporterList.length === 0) {
                    getAllTechnologyDisplayErrMsg('Interview Supports are not found');
                    setApprovedInterviewSupports([]);
                } else {
                    setApprovedInterviewSupports(responseData.interviewSupportWithInterviewSupporterList);
                }
            } catch (error) {
                console.log(error.message);
                // handleGetAllTechnologyErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const [interviewSupportsCard, setInterviewSupportsCard] = useState(0);
    const [interviewSupportsCardErr, setInterviewSupportsCardErr] = useState('');
    const handleInterviewSupportsCardErrMsg = (errorMessage, interviewSupportId) => {
        setInterviewSupportsCardErr(errorMessage);
        setInterviewSupportsCard(interviewSupportId);
        setTimeout(() => {
            setInterviewSupportsCardErr('');
            setInterviewSupportsCard(0);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    const [selectedInterviewSupport, setSelectedInterviewSupport] = useState(null);
    const handleInterviewSupportBookClick = async (interviewSupportId) => {
        setLoadingBar(true);
        const request = {
            interviewSupportId: interviewSupportId,
        }
        try {
            const responseData = await CandidateService.viewCandidateSelectedInterviewSupport(request);
            console.log(responseData);
            setSelectedInterviewSupport(responseData);
            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleInterviewSupportBookClickErrors(error.message, interviewSupportId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleInterviewSupportBookClickErrors = (errorStatus, interviewSupportId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleInterviewSupportsCardErrMsg("Inputs are invalid", interviewSupportId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleInterviewSupportsCardErrMsg("Sorry, Our service is down", interviewSupportId);
        else
            handleInterviewSupportsCardErrMsg("Could not process your request", interviewSupportId);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedInterviewSupport(null);
        setSelectedInterviewSupportDate(null);
        setTimeSlotList([]);
        setSelectedSlots([]);
        setDescription('');
        setResume(null);
    };

    // date
    const [selectedInterviewSupportDate, setSelectedInterviewSupportDate] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleSelectedInterviewSupportDate = (date) => {
        setSelectedInterviewSupportDate(date);
    };

    useEffect(() => {
        if (selectedInterviewSupportDate) {
            loadAvailableSlotsOnSelectedDate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterviewSupportDate]);

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

    const [description, setDescription] = useState('')
    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    // resume code
    const [resume, setResume] = useState(null);
    const handleResumeFile = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setResume(file);
        } else {
            alert('Please select a PDF or Word document');
            event.target.value = ''; // Clear the file input
            setResume(null);
        }
    };

    const loadAvailableSlotsOnSelectedDate = async () => {
        if (selectedInterviewSupportDate === null) {
            selectedInterviewSupportModalDisplayErrMsg('Please Select a date');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('interviewSupportId', selectedInterviewSupport.interviewSupport.interviewSupportId);
            formData.append('bookedDateString', selectedInterviewSupportDate);
            console.log(formData);
            try {
                const responseData = await CandidateService.loadAvailableSlotsOnSelectedDate(formData);
                console.log(responseData);
                setTimeSlotList(responseData);
            } catch (error) {
                console.log(error.message);
                loadAvailableSlotsOnSelectedDateErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const loadAvailableSlotsOnSelectedDateErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Selected Entity is Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            selectedInterviewSupportModalDisplayErrMsg("Could not process your request");
    }

    const handleConfirmBooking = async () => {
        if (selectedSlots === null || selectedSlots.length === 0) {
            selectedInterviewSupportModalDisplayErrMsg('select slots to book interview support');
        } 
        // else if (resume && resume.size > 5 * 1024 * 1024) { 
        //     selectedInterviewSupportModalDisplayErrMsg('Resume file size exceeds the maximum limit of 5MB');
        // } 
        else if (description.trim() === '') {
            selectedInterviewSupportModalDisplayErrMsg('Job Description is mandatory');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('interviewSupportId', selectedInterviewSupport.interviewSupport.interviewSupportId);
            formData.append('candidateId', userId);
            formData.append('bookedDateString', selectedInterviewSupportDate);
            formData.append('timeSlotList', (selectedSlots.map(slot => slot.timeSlotId)));
            formData.append('jobDescription', description);
            formData.append('resume', resume);
            console.log(formData);
            try {
                const responseData = await CandidateService.confirmInterviewSupportBooking(formData);
                console.log(responseData);
                selectedInterviewSupportModalDisplaySucMsg('Your Booking has Confirmed, Our Backend Team will Verify Shortly...');
            } catch (error) {
                console.log(error.message);
                handleConfirmBookingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleConfirmBookingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_INTERVIEW_SUPPORT === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("You Have Already Booked Slots for Existing Interview Support");
        else if (Constants.SLOTS_BLOCKED === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Selected slots are booked or blocked in a while");
        else if (Constants.SLOTS_BLOCKED_FOR_CANDIDATE === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Selected slots are already blocked by you for selected date");
        else if (Constants.FILES_NOT_UPLOADED === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Files could not uploaded");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            selectedInterviewSupportModalDisplayErrMsg("Sorry, Our service is down");
        else
            selectedInterviewSupportModalDisplayErrMsg("Could not process your request");
    }

    const [selectedInterviewSupportModalErrMsgDiv, setSelectedInterviewSupportModalErrMsgDiv] = useState(false);
    const [selectedInterviewSupportModalErrMsg, setSelectedInterviewSupportModalErrMsg] = useState("");
    //JS for to display err msg
    const selectedInterviewSupportModalDisplayErrMsg = (errorMessage) => {
        setSelectedInterviewSupportModalErrMsg(errorMessage);
        setSelectedInterviewSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedInterviewSupportModalErrMsg("");
            setSelectedInterviewSupportModalErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const selectedInterviewSupportModalDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setSelectedInterviewSupportModalErrMsg(errorMessage);
        setSelectedInterviewSupportModalErrMsgDiv(true);
        setTimeout(() => {
            setSelectedInterviewSupportModalErrMsg("");
            setSelectedInterviewSupportModalErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleModalClose();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className="interview-support-list">
            {loadingBar && <LoadingBar />}
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
                            onClick={handleSearchInterviewSupportsByTechnologies}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
                <div className=''>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
            </div>
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {approvedInterviewSupports.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Body>
                            <Card.Text>
                                <label>Interview Supporter-Name : </label> <span>{item.interviewSupporter.userFirstname + " " + item.interviewSupporter.userLastname}</span> <br />
                                <label>Interview Supporter-Experience : </label> <span>{item.interviewSupporter.userExperience}</span> <br />
                                <label>Technical-Stack : </label> <span>{item.interviewSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.interviewSupport.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            className='book-button'
                                            onClick={() => handleInterviewSupportBookClick(item.interviewSupport.interviewSupportId)}
                                        >
                                            Book
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {interviewSupportsCard === item.interviewSupport.interviewSupportId && (
                                        <div style={customCssForMsg}>
                                            <label>{interviewSupportsCardErr}</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {approvedInterviewSupports.length !== 0 && (
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
                <Modal className='view-selected-interview-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Book Interview Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='interview-support-and-interview-supporter-data'>
                                <div className='interview-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Interview Supporter Data</label> <br />
                                    <label>Interview Supporter-Name : </label> <span>{selectedInterviewSupport.interviewSupporter.userFirstname + " " + selectedInterviewSupport.interviewSupporter.userLastname}</span> <br />
                                    <label>Interview Supporter-Experience : </label> <span>{selectedInterviewSupport.interviewSupporter.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{selectedInterviewSupport.interviewSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={selectedInterviewSupport.interviewSupport.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className='select-date mt-3'>
                                        <label>Select Date to Book Available slots for Interview Support <strong>(You can select from current date to next 7 days)</strong></label>
                                        <Datetime
                                            value={selectedInterviewSupportDate}
                                            onChange={handleSelectedInterviewSupportDate}
                                            isValidDate={isValidDate}
                                            inputProps={{
                                                placeholder: 'Select Date',
                                                readOnly: true,
                                            }}
                                            timeFormat={false}
                                        />
                                    </div>
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
                                        <div className='description col-12 mt-1'>
                                            <label>Job Description is mandatory, If not please mention your Role</label>
                                            <textarea
                                                className='form-control'
                                                value={description}
                                                onChange={handleDescription}
                                                placeholder="your job description..."
                                                maxLength={2000}
                                            >
                                            </textarea>
                                        </div>
                                        {/* <div className="resume-file mt-1">
                                            <label>Upload Resume (optional)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="resumeFile"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleResumeFile}
                                            />
                                        </div> */}
                                    </div>
                                )}
                                <div className='mt-2'>
                                    {selectedInterviewSupportModalErrMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{selectedInterviewSupportModalErrMsg}</label>
                                        </div>}
                                </div>
                            </div>
                        </Modal.Body>
                        {timeSlotList.length !== 0 && (
                            <Modal.Footer>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        className='modal-button'
                                        onClick={handleConfirmBooking}
                                    >
                                        Confirm Booking
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

export default CandidateSearchInterviewSupport;