import { Button, Card, Container, Modal } from 'react-bootstrap';
import './ExponentRejectedInterviewSupport.css';
import { useEffect, useState } from 'react';
import Constants from '../../../../../Constants';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { FaRedo } from 'react-icons/fa';

function ExponentRejectedInterviewSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [rejectedInterviewSupport, setRejectedInterviewSupport] = useState(null);
    const userId = localStorage.getItem("breezeUserId");
    const getRejectedInterviewSupportByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await InterviewSupporterService.exponentRejectedInterviewSupport(request);
            console.log(responseData);
            setRejectedInterviewSupport(responseData);
        } catch (error) {
            console.log(error.message);
            handleExponentRejectedInterviewSupportErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getRejectedInterviewSupportByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExponentRejectedInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            rejectedInterviewSupportDisplayErrMsg("Interview Supporter Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            rejectedInterviewSupportDisplayErrMsg("Rejected Interview Support are not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            rejectedInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            rejectedInterviewSupportDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const rejectedInterviewSupportDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const [showUpdateInterviewSupportModal, setShowUpdateInterviewSupportModal] = useState(false);
    const handleUpdateInterviewSupportModalClose = () => {
        setShowUpdateInterviewSupportModal(false);
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

    const handleUpdateRejectedInterviewSupport = () => {

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
        setShowUpdateInterviewSupportModal(true);
    }

    const handleUpdateInterviewSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            updateInterviewSupportDisplayErrMsg('Please Select your Technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            updateInterviewSupportDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                interviewSupportId: rejectedInterviewSupport.interviewSupportId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await InterviewSupporterService.updateRejectedInterviewSupport(request);
                console.log(responseData);
                updateInterviewSupportDisplaySucMsg('Interview Support Updated Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleUpdateInterviewSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleUpdateInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateInterviewSupportDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateInterviewSupportDisplayErrMsg("Your Interview Support is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateInterviewSupportDisplayErrMsg("Sorry, Our service is down");
        else
            updateInterviewSupportDisplayErrMsg("Could not process your request");
    }

    const [updateInterviewSupportErrMsgDiv, setUpdateInterviewSupportErrMsgDiv] = useState(false);
    const [updateInterviewSupportErrMsg, setUpdateInterviewSupportErrMsg] = useState("");
    //JS for to display err msg
    const updateInterviewSupportDisplayErrMsg = (errorMessage) => {
        setUpdateInterviewSupportErrMsg(errorMessage);
        setUpdateInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateInterviewSupportErrMsg("");
            setUpdateInterviewSupportErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateInterviewSupportDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateInterviewSupportErrMsg(errorMessage);
        setUpdateInterviewSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateInterviewSupportErrMsg("");
            setUpdateInterviewSupportErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateInterviewSupportModalClose();
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
        <div className='exponent-rejected-interview-support'>
            {loadingBar && <LoadingBar />}
            {rejectedInterviewSupport && (
                <div className='rejected-interview-support'>
                    <Card className='card'>
                        <Card.Body>
                            <Card.Text>
                                <div className='rejected-interview-support-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Your Interview Support'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateRejectedInterviewSupport()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Technical-Stack : </label> <span>{rejectedInterviewSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {rejectedInterviewSupport.timeSlotList.map((item, index) => (
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
                        <Card.Footer>
                            <div>
                                <label>Status : </label> <span>{rejectedInterviewSupport.adminStatus}</span> <br />
                                <label>Reason : </label> <span>{rejectedInterviewSupport.description}</span>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
            )}
            <div>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
            {showUpdateInterviewSupportModal && (
                <Modal className='update-interview-support-modal' size='xl' show={showUpdateInterviewSupportModal} onHide={handleUpdateInterviewSupportModalClose} centered backdrop="static">
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
                                            {updateInterviewSupportErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateInterviewSupportErrMsg}</label>
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
                                    onClick={handleUpdateInterviewSupport}
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

export default ExponentRejectedInterviewSupport; 