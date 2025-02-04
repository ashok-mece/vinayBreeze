import { useEffect, useState } from 'react';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import './ExponentApprovedInterviewSupport.css';
import Constants from '../../../../../Constants';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { FaRedo } from 'react-icons/fa';

function ExponentApprovedInterviewSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [approvedInterviewSupport, setApprovedInterviewSupport] = useState(null);
    const userId = localStorage.getItem("breezeUserId");
    const getApprovedInterviewSupportByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await InterviewSupporterService.exponentApprovedInterviewSupport(request);
            console.log(responseData);
            setApprovedInterviewSupport(responseData);
        } catch (error) {
            console.log(error.message);
            handleExponentApprovedInterviewSupportErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getApprovedInterviewSupportByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExponentApprovedInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            approvedInterviewSupportDisplayErrMsg("Interview Supporter Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            approvedInterviewSupportDisplayErrMsg("You Have No Approved Interview Support");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            approvedInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            approvedInterviewSupportDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const approvedInterviewSupportDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const [showUpdateApprovedInterviewSupportModal, setShowUpdateApprovedInterviewSupportModal] = useState(false);
    const handleUpdateApprovedInterviewSupportModalClose = () => {
        setShowUpdateApprovedInterviewSupportModal(false);
        setTechnologies([]);
        setTechnologiesList([]);
        setTimeSlotList([]);
        setSelectedSlots([]); 
        setDefaultTechnologyList([]);
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

    const handleUpdateApprovedInterviewSupport = () => {

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
                setDefaultTechnologyList(approvedInterviewSupport.technologyList);
                setTechnologies(approvedInterviewSupport.technologyList);
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
                const responseData = await GlobalService.getAllTimeSlot();
                console.log(responseData);
                const updatedResponseData = responseData.map(slot => {
                    const isBooked = approvedInterviewSupport.timeSlotList.some(
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
        setShowUpdateApprovedInterviewSupportModal(true);
    }

    const handleApprovedUpdateInterviewSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            updateApprovedInterviewSupportDisplayErrMsg('Please select technical stack to give interview support from your technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            updateApprovedInterviewSupportDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                interviewSupportId: approvedInterviewSupport.interviewSupportId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await InterviewSupporterService.updateApprovedInterviewSupport(request);
                console.log(responseData);
                updateApprovedInterviewSupportDisplaySucMsg('Interview Support Updated Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleUpdateApprovedInterviewSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleUpdateApprovedInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Inputs are invalid");
        else if (Constants.EXISTING_BOOKINGS === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Your Interview Support having bookings, you can't update now");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Your Interview Support is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            updateApprovedInterviewSupportDisplayErrMsg("Could not process your request");
    }

    const [updateApprovedInterviewSupportErrMsgDiv, setUpdateApprovedInterviewSupportErrMsgDiv] = useState(false);
    const [updateApprovedInterviewSupportErrMsg, setUpdateApprovedInterviewSupportErrMsg] = useState("");
    //JS for to display err msg
    const updateApprovedInterviewSupportDisplayErrMsg = (errorMessage) => {
        setUpdateApprovedInterviewSupportErrMsg(errorMessage);
        setUpdateApprovedInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedInterviewSupportErrMsg("");
            setUpdateApprovedInterviewSupportErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateApprovedInterviewSupportDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateApprovedInterviewSupportErrMsg(errorMessage);
        setUpdateApprovedInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedInterviewSupportErrMsg("");
            setUpdateApprovedInterviewSupportErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateApprovedInterviewSupportModalClose();
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
        <div className='exponent-approved-interview-support'>
            {loadingBar && <LoadingBar />}
            {approvedInterviewSupport && (
                <div className='approved-interview-support'>
                    <Card className='card'>
                        <Card.Body>
                            <Card.Text>
                                <div className='approved-interview-support-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Your Interview Support'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateApprovedInterviewSupport()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Technical-Stack : </label> <span>{approvedInterviewSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {approvedInterviewSupport.timeSlotList.map((item, index) => (
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
                        { approvedInterviewSupport.updateStatus && (
                            <Card.Footer>
                                <div>
                                    <label>Updated Status : </label> <span>{approvedInterviewSupport.updateStatus}</span><br />
                                    { approvedInterviewSupport.updateStatus === Constants.HOLD && (
                                        <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Hold, Candidates cannot Search Your Interview Support.</label>
                                    )}
                                    { approvedInterviewSupport.updateStatus === Constants.REJECTED && (
                                        <div>
                                            <label>Reason : </label> <span>{approvedInterviewSupport.description}</span><br />
                                            <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Rejected, Candidates can Search Your previous Interview Support Technical Stack and Available Slots.</label>
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
            {showUpdateApprovedInterviewSupportModal && (
                <Modal className='update-approved-interview-support-modal' size='xl' show={showUpdateApprovedInterviewSupportModal} onHide={handleUpdateApprovedInterviewSupportModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Interview Support</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="update-interview-support" style={{ fontSize: '14px' }}>
                                <div className="interview-support-form">
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
                                            {updateApprovedInterviewSupportErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateApprovedInterviewSupportErrMsg}</label>
                                                </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='update-interview-support-button'>
                                <Button
                                    className='dashboard-button'
                                    onClick={handleApprovedUpdateInterviewSupport}
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

export default ExponentApprovedInterviewSupport;


/**======================================================================== */

/**
 * import { useEffect, useState } from 'react';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import './ExponentApprovedInterviewSupport.css';
import Constants from '../../../../../Constants';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { FaRedo } from 'react-icons/fa';

function ExponentApprovedInterviewSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [approvedInterviewSupport, setApprovedInterviewSupport] = useState(null);
    const userId = localStorage.getItem("breezeUserId");
    const getApprovedInterviewSupportByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await InterviewSupporterService.exponentApprovedInterviewSupport(request);
            console.log(responseData);
            setApprovedInterviewSupport(responseData);
        } catch (error) {
            console.log(error.message);
            handleExponentApprovedInterviewSupportErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getApprovedInterviewSupportByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExponentApprovedInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            approvedInterviewSupportDisplayErrMsg("Interview Supporter Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            approvedInterviewSupportDisplayErrMsg("You Have No Approved Interview Support");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            approvedInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            approvedInterviewSupportDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const approvedInterviewSupportDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const [showUpdateApprovedInterviewSupportModal, setShowUpdateApprovedInterviewSupportModal] = useState(false);
    const handleUpdateApprovedInterviewSupportModalClose = () => {
        setShowUpdateApprovedInterviewSupportModal(false);
        setTechnologies([]);
        setTechnologiesList([]);
        setTimeSlotList([]);
        setSelectedSlots([]); 
    }

    // technology code
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
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
        setSelectedSlots([]);
    };

    const handleUpdateApprovedInterviewSupport = () => {

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
                const responseData = await GlobalService.getAllTimeSlot();
                console.log(responseData);
                setTimeSlotList(responseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllTimeSlot();
        setShowUpdateApprovedInterviewSupportModal(true);
    }

    const handleApprovedUpdateInterviewSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            updateApprovedInterviewSupportDisplayErrMsg('Please select technologies to give interview support from your technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            updateApprovedInterviewSupportDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                interviewSupportId: approvedInterviewSupport.interviewSupportId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await InterviewSupporterService.updateApprovedInterviewSupport(request);
                console.log(responseData);
                updateApprovedInterviewSupportDisplaySucMsg('Interview Support Updated Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleUpdateApprovedInterviewSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleUpdateApprovedInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Inputs are invalid");
        else if (Constants.EXISTING_BOOKINGS === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("You Interview Support having bookings, you can't update now");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("You Interview Support is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateApprovedInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            updateApprovedInterviewSupportDisplayErrMsg("Could not process your request");
    }

    const [updateApprovedInterviewSupportErrMsgDiv, setUpdateApprovedInterviewSupportErrMsgDiv] = useState(false);
    const [updateApprovedInterviewSupportErrMsg, setUpdateApprovedInterviewSupportErrMsg] = useState("");
    //JS for to display err msg
    const updateApprovedInterviewSupportDisplayErrMsg = (errorMessage) => {
        setUpdateApprovedInterviewSupportErrMsg(errorMessage);
        setUpdateApprovedInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedInterviewSupportErrMsg("");
            setUpdateApprovedInterviewSupportErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateApprovedInterviewSupportDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateApprovedInterviewSupportErrMsg(errorMessage);
        setUpdateApprovedInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateApprovedInterviewSupportErrMsg("");
            setUpdateApprovedInterviewSupportErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateApprovedInterviewSupportModalClose();
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
        <div className='exponent-approved-interview-support'>
            {loadingBar && <LoadingBar />}
            {approvedInterviewSupport && (
                <div className='approved-interview-support'>
                    <Card className='card'>
                        <Card.Body>
                            <Card.Text>
                                <div className='approved-interview-support-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Your Interview Support'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateApprovedInterviewSupport()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Technical-Stack : </label> <span>{approvedInterviewSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {approvedInterviewSupport.timeSlotList.map((item, index) => (
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
                        { approvedInterviewSupport.updateStatus && (
                            <Card.Footer>
                                <div>
                                    <label>Updated Status : </label> <span>{approvedInterviewSupport.updateStatus}</span><br />
                                    { approvedInterviewSupport.updateStatus === Constants.HOLD && (
                                        <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Hold, Candidates cannot Search Your Interview Support.</label>
                                    )}
                                    { approvedInterviewSupport.updateStatus === Constants.REJECTED && (
                                        <div>
                                            <label>Reason : </label> <span>{approvedInterviewSupport.description}</span><br />
                                            <label style={{fontSize:'13px'}}><span style={{color:'red'}}>* </span>Since Your Updated Status is on Rejected, Candidates can Search Your previous Interview Support Technical Stack and Available Slots.</label>
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
            {showUpdateApprovedInterviewSupportModal && (
                <Modal className='update-approved-interview-support-modal' size='xl' show={showUpdateApprovedInterviewSupportModal} onHide={handleUpdateApprovedInterviewSupportModalClose} centered backdrop="static">
                    <Container>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Interview Support</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="update-interview-support" style={{ fontSize: '14px' }}>
                                <div className="interview-support-form">
                                    <form>
                                        <div className='technology-multiselect mt-3'>
                                            <label>Add Technical Stack</label>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
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
                                                    >
                                                        {Constants.formatTime(Constants.convertUserTimezoneTime(item.slotStartTime)) + ' - ' + Constants.formatTime(Constants.convertUserTimezoneTime(item.slotEndTime))}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='mt-2'>
                                            {updateApprovedInterviewSupportErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateApprovedInterviewSupportErrMsg}</label>
                                                </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='update-interview-support-button'>
                                <Button
                                    className='dashboard-button'
                                    onClick={handleApprovedUpdateInterviewSupport}
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

export default ExponentApprovedInterviewSupport;
 */