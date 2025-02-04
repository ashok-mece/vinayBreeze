import { useEffect, useState } from 'react';
import './ExponentApprovedJobSupport.css';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import JobSupporterService from '../../../../../../Services/exponent_service/JobSupporterService';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { FaRedo } from 'react-icons/fa';

function ExponentApprovedJobSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [approvedJobSupport, setApprovedJobSupport] = useState(null);
    const userId = localStorage.getItem("breezeUserId");
    const getApprovedJobSupportByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await JobSupporterService.exponentApprovedJobSupport(request);
            console.log(responseData);
            setApprovedJobSupport(responseData);
        } catch (error) {
            console.log(error.message);
            handleExponentApprovedJobSupportErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getApprovedJobSupportByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExponentApprovedJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            approvedJobSupportDisplayErrMsg("Job Supporter Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            approvedJobSupportDisplayErrMsg("Approved Job Support are not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            approvedJobSupportDisplayErrMsg("Sorry, Our service is down");
        else
            approvedJobSupportDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const approvedJobSupportDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const [showUpdateApprovedJobSupportModal, setShowUpdateApprovedJobSupportModal] = useState(false);
    const handleUpdateApprovedJobSupportModalClose = () => {
        setShowUpdateApprovedJobSupportModal(false);
        setTechnologies([]);
        setTechnologiesList([]);
        setTimeSlotList([]);
        setSelectedSlots([]); 
    }

    // technology code
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const [defaultTechnologyList, setDefaultTechnologyList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
        console.log(technologies);
    }

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
        setSelectedSlots(timeSlotList.filter(slot => slot.isBooked));
    };

    const handleUpdateApprovedJobSupport = () => {

        const request = {
            userId: userId, 
        }

        const getTechStackByExponentId = async () => {
            setLoadingBar(true);
            try {
                const responseData = await GlobalService.getTechStackByExponentId(request);
                console.log(responseData);
                const jsonResponseData = responseData.map((item, index) => {
                    return { technologyName: item }
                });
                console.log(jsonResponseData);
                setDefaultTechnologyList(approvedJobSupport.technologyList);
                setTechnologies(approvedJobSupport.technologyList);
                setTechnologiesList(jsonResponseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getTechStackByExponentId();

        const getAllTimeSlot = async () => {
            setLoadingBar(true);
            try {
                const responseData = await GlobalService.getAllJobSupportTimeSlot();
                console.log(responseData);
                const updatedResponseData = responseData.map(slot => {
                    const isBooked = approvedJobSupport.timeSlotList.some(
                        approvedSlot => approvedSlot.timeSlotId === slot.timeSlotId
                    );
                    return { ...slot, isBooked: isBooked ? true : slot.isBooked };
                });
                console.log(updatedResponseData);
                setSelectedSlots(updatedResponseData.filter(slot => slot.isBooked));
                setTimeSlotList(updatedResponseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllTimeSlot();
        setShowUpdateApprovedJobSupportModal(true);
    }

    const handleApprovedUpdateJobSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            updateApprovedJobSupportDisplayErrMsg('Please select technical stack to give job support from your technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            updateApprovedJobSupportDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                jobSupportId: approvedJobSupport.jobSupportId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await JobSupporterService.updateApprovedJobSupport(request);
                console.log(responseData);
                updateApprovedJobSupportDisplaySucMsg('Job Support Updated Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleUpdateApprovedJobSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleUpdateApprovedJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateApprovedJobSupportDisplayErrMsg("Inputs are invalid");
        else if (Constants.EXISTING_BOOKINGS === errorStatus)
            updateApprovedJobSupportDisplayErrMsg("Your Job Support having bookings, you can't update now");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateApprovedJobSupportDisplayErrMsg("Your Job Support is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateApprovedJobSupportDisplayErrMsg("Sorry, Our service is down");
        else
            updateApprovedJobSupportDisplayErrMsg("Could not process your request");
    }

    const [updateApprovedJobSupportErrMsgDiv, setUpdateApprovedJobSupportErrMsgDiv] = useState(false);
    const [updateApprovedJobSupportErrMsg, setUpdateApprovedJobSupportErrMsg] = useState("");
    //JS for to display err msg
    const updateApprovedJobSupportDisplayErrMsg = (errorMessage) => {
        setUpdateApprovedJobSupportErrMsg(errorMessage);
        setUpdateApprovedJobSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedJobSupportErrMsg("");
            setUpdateApprovedJobSupportErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateApprovedJobSupportDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateApprovedJobSupportErrMsg(errorMessage);
        setUpdateApprovedJobSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedJobSupportErrMsg("");
            setUpdateApprovedJobSupportErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateApprovedJobSupportModalClose();
            window.location.reload();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='exponent-approved-job-support'>
            {loadingBar && <LoadingBar />}
            {approvedJobSupport && (
                <div className='approved-job-support'>
                    <Card className='card'>
                        <Card.Body>
                            <Card.Text>
                                <div className='approved-job-support-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Your Job Support'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateApprovedJobSupport()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Technical-Stack : </label> <span>{approvedJobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {approvedJobSupport.timeSlotList.map((item, index) => (
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
                            </Card.Text>
                        </Card.Body>
                        { approvedJobSupport.updateStatus && (
                            <Card.Footer>
                                <div>
                                    <label>Updated Status : </label> <span>{approvedJobSupport.updateStatus}</span><br />
                                    { approvedJobSupport.updateStatus === Constants.HOLD && (
                                        <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Hold, Candidates cannot Search Your Job Support.</label>
                                    )}
                                    { approvedJobSupport.updateStatus === Constants.REJECTED && (
                                        <div>
                                            <label>Reason : </label> <span>{approvedJobSupport.description}</span><br />
                                            <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Rejected, Candidates can Search Your previous Job Support Technical Stack and Available Slots.</label>
                                        </div>
                                    )}
                                </div>
                            </Card.Footer>
                        )}
                    </Card>
                </div>
            )}
            <div>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
            {showUpdateApprovedJobSupportModal && (
                <Modal className='update-approved-job-support-modal' size='xl' show={showUpdateApprovedJobSupportModal} onHide={handleUpdateApprovedJobSupportModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Job Support</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="update-job-support" style={{ fontSize: '14px' }}>
                                <div className="job-support-form">
                                    <form>
                                        <div className='technology-multiselect mt-3'>
                                            <label>Add Technical Stack</label>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
                                                selectedValues={defaultTechnologyList}
                                                disablePreSelectedValues
                                                onSelect={onSelectTechnology}
                                                onRemove={onRemoveTechnology}
                                                displayValue="technologyName" //technologyName
                                                placeholder="Your Technical Stack"
                                                avoidHighlightFirstOption={true}
                                                style={{
                                                    chips: {
                                                        background: childColor,
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className='time-slots mt-3'>
                                            <div className="label-container">
                                                <label>Select Your Available Time Slots for a day</label>
                                                <div className="reload-container" onClick={handleTimeSlotReload}>
                                                    <FaRedo className="reload-icon" />
                                                    <span className="reload-text">Uncheck All Slots</span>
                                                </div>
                                            </div>
                                            <div className="time-slot-container" >
                                                {timeSlotList.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        type='button'
                                                        className={`time-slot-button ${selectedSlots.includes(item) ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSlotClick(item)}
                                                        disabled={item.isBooked ? true : false}
                                                    >
                                                        {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='mt-2'>
                                            {updateApprovedJobSupportErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateApprovedJobSupportErrMsg}</label>
                                                </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='update-job-support-button'>
                                <Button
                                    className='dashboard-button'
                                    onClick={handleApprovedUpdateJobSupport}
                                >
                                    Update
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default ExponentApprovedJobSupport; 