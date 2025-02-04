import './ExponentRejectedJobSupport.css';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { FaRedo } from 'react-icons/fa';
import JobSupporterService from '../../../../../../Services/exponent_service/JobSupporterService';

function ExponentRejectedJobSupport() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [rejectedJobSupport, setRejectedJobSupport] = useState(null);
    const userId = localStorage.getItem("breezeUserId");
    const getRejectedJobSupportByExponentId = async () => {
        setLoadingBar(true);
        const request = {
            exponentId: userId,
        }
        try {
            const responseData = await JobSupporterService.exponentRejectedJobSupport(request);
            console.log(responseData);
            setRejectedJobSupport(responseData);
        } catch (error) {
            console.log(error.message);
            handleExponentRejectedJobSupportErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    useEffect(() => {
        getRejectedJobSupportByExponentId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExponentRejectedJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            rejectedJobSupportDisplayErrMsg("Job Supporter Id is invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            rejectedJobSupportDisplayErrMsg("Rejected Job Support are not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            rejectedJobSupportDisplayErrMsg("Sorry, Our service is down");
        else
            rejectedJobSupportDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const rejectedJobSupportDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    const [showUpdateJobSupportModal, setShowUpdateJobSupportModal] = useState(false);
    const handleUpdateJobSupportModalClose = () => {
        setShowUpdateJobSupportModal(false);
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

    const handleUpdateRejectedJobSupport = () => {

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
                const responseData = await GlobalService.getAllJobSupportTimeSlot();
                console.log(responseData);
                setTimeSlotList(responseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllTimeSlot();
        setShowUpdateJobSupportModal(true);
    }

    const handleUpdateJobSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            updateJobSupportDisplayErrMsg('Please mention your technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            updateJobSupportDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                jobSupportId: rejectedJobSupport.jobSupportId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await JobSupporterService.updateRejectedJobSupport(request);
                console.log(responseData);
                updateJobSupportDisplaySucMsg('Job Support Updated Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleUpdateJobSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleUpdateJobSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateJobSupportDisplayErrMsg("Inputs are invalid");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateJobSupportDisplayErrMsg("Your Job Support is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateJobSupportDisplayErrMsg("Sorry, Our service is down");
        else
            updateJobSupportDisplayErrMsg("Could not process your request");
    }

    const [updateJobSupportErrMsgDiv, setUpdateJobSupportErrMsgDiv] = useState(false);
    const [updateJobSupportErrMsg, setUpdateJobSupportErrMsg] = useState("");
    //JS for to display err msg
    const updateJobSupportDisplayErrMsg = (errorMessage) => {
        setUpdateJobSupportErrMsg(errorMessage);
        setUpdateJobSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateJobSupportErrMsg("");
            setUpdateJobSupportErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const updateJobSupportDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setUpdateJobSupportErrMsg(errorMessage);
        setUpdateJobSupportErrMsgDiv(true);
        setTimeout(() => {
            setUpdateJobSupportErrMsg("");
            setUpdateJobSupportErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleUpdateJobSupportModalClose();
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
        <div className='exponent-rejected-job-support'>
            {loadingBar && <LoadingBar />}
            {rejectedJobSupport && (
                <div className='rejected-job-support'>
                    <Card className='card'>
                        <Card.Body>
                            <Card.Text>
                                <div className='rejected-job-support-data'>
                                    <div>
                                        <label style={{ textDecoration: 'underline', fontSize: '15px' }}>{'Your Job Support'}</label>
                                        <button
                                            style={{ float: 'right' }}
                                            className='update-button'
                                            onClick={() => handleUpdateRejectedJobSupport()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <label>Technical-Stack : </label> <span>{rejectedJobSupport.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                    <div className='time-slots'>
                                        <label>Available Slots : </label>
                                        <div className='time-slot-container'>
                                            {rejectedJobSupport.timeSlotList.map((item, index) => (
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
                                <label>Status : </label> <span>{rejectedJobSupport.adminStatus}</span> <br />
                                <label>Reason : </label> <span>{rejectedJobSupport.description}</span>
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
            {showUpdateJobSupportModal && (
                <Modal className='update-job-support-modal' size='xl' show={showUpdateJobSupportModal} onHide={handleUpdateJobSupportModalClose} centered backdrop="static">
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
                                            {updateJobSupportErrMsgDiv &&
                                                <div style={customCssForMsg}>
                                                    <label>{updateJobSupportErrMsg}</label>
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
                                    onClick={handleUpdateJobSupport}
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

export default ExponentRejectedJobSupport; 