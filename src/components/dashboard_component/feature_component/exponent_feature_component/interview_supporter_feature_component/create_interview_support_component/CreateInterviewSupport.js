import { useEffect, useState } from 'react';
import './CreateInterviewSupport.css';
import Multiselect from 'multiselect-react-dropdown';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import Constants from '../../../../../Constants';
import { FaRedo } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import InterviewSupporterService from '../../../../../../Services/exponent_service/InterviewSupporterService';

function CreateInterviewSupport() {

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    const [loadingBar, setLoadingBar] = useState(false);

    const userId = localStorage.getItem("breezeUserId");

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

    const handleSelectAllSlots = () => {
        setSelectedSlots(timeSlotList);
    };

    useEffect(() => {

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

    }, [userId]);

    const handleCreateInterviewSupport = async () => {
        console.log(technologies);
        console.log(selectedSlots);

        if (technologies === null || technologies.length === 0) {
            createInterviewSupportFieldsDisplayErrMsg('Please select technical stack to give interview support from your technical stack');
        } else if (selectedSlots === null || selectedSlots.length === 0) {
            createInterviewSupportFieldsDisplayErrMsg('Please select Your Available Time Slots');
        } else {
            setLoadingBar(true);
            const request = {
                exponentId: userId,
                technologyList: technologies,
                timeSlotList: selectedSlots,
            }
            try {
                const responseData = await InterviewSupporterService.createInterviewSupport(request);
                console.log(responseData);
                createInterviewSupportFieldsDisplaySucMsg('Interview Support Created Successfully, Our backend team will verify shortly...');
            } catch (error) {
                handleCreateInterviewSupportErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleCreateInterviewSupportErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createInterviewSupportFieldsDisplayErrMsg("Inputs are invalid");
        else if (Constants.EXISTING_INTERVIEW_SUPPORT === errorStatus)
            createInterviewSupportFieldsDisplayErrMsg("You have already created an Interview Support");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createInterviewSupportFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            createInterviewSupportFieldsDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const createInterviewSupportFieldsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    //JS for to display success msg
    const createInterviewSupportFieldsDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }
    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='create-interview-support' style={{ fontSize: '14px' }}>
            {loadingBar && <LoadingBar />}
            <div className='interview-support-form'>
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
                            <div style={{display:'flex',gap:'20px'}}>
                                <div className="reload-container" onClick={handleSelectAllSlots}>
                                    <FaRedo className="reload-icon" />
                                    <span className="reload-text">Check All Slots</span>
                                </div>
                                <div className="reload-container" onClick={handleTimeSlotReload}>
                                    <FaRedo className="reload-icon" />
                                    <span className="reload-text">Uncheck All Slots</span>
                                </div>
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
                        {errMsgDiv &&
                            <div style={customCssForMsg}>
                                <label>{errMsg}</label>
                            </div>}
                    </div>
                    <div className='mt-3'>
                        <div style={{ fontSize: '12px' }}>
                            <label htmlFor="name"><span style={{ color: 'red' }}>* </span>You can create only one Interview Support.</label>
                        </div>
                        <Button
                            className='dashboard-button mt-1'
                            onClick={handleCreateInterviewSupport}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateInterviewSupport;