import { useEffect, useState } from 'react';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import './CandidateSearchJobSupport.css';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Constants from '../../../../../Constants';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { Rating } from 'react-simple-star-rating';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { FaRedo } from 'react-icons/fa';
import moment from 'moment';

function CandidateSearchJobSupport() {

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

    const [selectedJobSupport, setSelectedJobSupport] = useState(null);
    const handleJobSupportBookClick = async (jobSupportId) => {
        setLoadingBar(true);
        const request = {
            jobSupportId: jobSupportId,
        }
        try {
            const responseData = await CandidateService.viewCandidateSelectedJobSupport(request);
            console.log(responseData);
            setSelectedJobSupport(responseData);

            const timeSlotsResponseData = await CandidateService.loadAvailableSlotsOnJobSupportId(request);
            console.log(timeSlotsResponseData);
            setTimeSlotList(timeSlotsResponseData);

            setShowModal(true);
        } catch (error) {
            console.log(error.message);
            handleJobSupportBookClickErrors(error.message, jobSupportId);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleJobSupportBookClickErrors = (errorStatus, jobSupportId) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            handleJobSupportsCardErrMsg("Inputs are invalid", jobSupportId);
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            handleJobSupportsCardErrMsg("Entity Not Found", jobSupportId);
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            handleJobSupportsCardErrMsg("Sorry, Our service is down", jobSupportId);
        else
            handleJobSupportsCardErrMsg("Could not process your request", jobSupportId);
    }

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedJobSupport(null);
        setSelectedJobSupportStartDate(null);
        setSelectedJobSupportEndDate(null);
        setTimeSlotList([]);
        setSelectedSlots([]);
        setDescription('');
    };

    // date
    const [selectedJobSupportStartDate, setSelectedJobSupportStartDate] = useState(null);
    const [selectedJobSupportEndDate, setSelectedJobSupportEndDate] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleSelectedJobSupporStarttDate = (date) => {
        setSelectedJobSupportStartDate(date);
        const newDate = moment(date).add((30-1), 'days');
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

    const [description, setDescription] = useState('')
    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleConfirmBooking = async () => {
        if (selectedSlots === null || selectedSlots.length === 0) {
            selectedJobSupportModalDisplayErrMsg('select slots to book job support');
        } else if (selectedJobSupportStartDate === null) {
            selectedJobSupportModalDisplayErrMsg('select job support start date');
        } else if (description.trim() === '') {
            selectedJobSupportModalDisplayErrMsg('project description is mandatory');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('jobSupportId', selectedJobSupport.jobSupport.jobSupportId);
            formData.append('candidateId', userId);
            formData.append('startDateString', selectedJobSupportStartDate);
            formData.append('endDateString', selectedJobSupportEndDate);
            formData.append('timeSlotList', (selectedSlots.map(slot => slot.timeSlotId)));
            formData.append('projectDescription', description);
            console.log(formData);
            try {
                const responseData = await CandidateService.confirmJobSupportBooking(formData);
                console.log(responseData);
                selectedJobSupportModalDisplaySucMsg('Your Booking has Confirmed, Our Backend Team will Verify Shortly...');
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
            selectedJobSupportModalDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_JOB_SUPPORT === errorStatus)
            selectedJobSupportModalDisplayErrMsg("You Have Already Booked Job Support, So you cannot book another...");
        else if (Constants.SLOTS_BLOCKED === errorStatus)
            selectedJobSupportModalDisplayErrMsg("Selected slots are booked or blocked in a while");
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
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className="job-support-list">
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
                            onClick={handleSearchJobSupportsByTechnologies}
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
                                            onClick={() => handleJobSupportBookClick(item.jobSupport.jobSupportId)}
                                        >
                                            Book
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
            {showModal && (
                <Modal className='view-selected-job-support-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Book Job Support
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ fontSize: '13px' }}>
                            <div className='job-support-and-job-supporter-data'>
                                <div className='job-supporter-data'>
                                    <label style={{ textDecoration: 'underline', fontSize: '16px' }}>Job Supporter Data</label> <br />
                                    <label>Job Supporter-Name : </label> <span>{selectedJobSupport.jobSupporter.userFirstname + " " + selectedJobSupport.jobSupporter.userLastname}</span> <br />
                                    <label>Job Supporter-Experience : </label> <span>{selectedJobSupport.jobSupporter.userExperience}</span> <br />
                                    <label>Technical-Stack : </label> <span>{selectedJobSupport.jobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={selectedJobSupport.jobSupport.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div>
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
                                            <label>Project Description is mandatory, If not please mention your required skills</label>
                                            <textarea
                                                className='form-control'
                                                value={description}
                                                onChange={handleDescription}
                                                placeholder="your project description..."
                                                maxLength={2000}
                                            >
                                            </textarea>
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

export default CandidateSearchJobSupport;