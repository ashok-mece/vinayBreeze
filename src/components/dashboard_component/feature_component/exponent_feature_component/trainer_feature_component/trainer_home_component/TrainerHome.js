import { useEffect, useState } from 'react';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import './TrainerHome.css';
import Constants from '../../../../../Constants';
import axios from 'axios';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import { Card } from 'react-bootstrap';

function TrainerHome({ trainerFlow }) {

    const [loadingBar, setLoadingBar] = useState(false);

    const userFullName = localStorage.getItem("breezeUserFullName");

    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            setLoadingBar(true);
            try {
                const response = await axios.get(`${Constants.BASE_URL}/trainer/get-sample-intro-video`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`
                    },
                    responseType: 'blob'
                });

                setVideoUrl(URL.createObjectURL(response.data));
            } catch (error) {
                console.error('Error fetching video:', error);
            } finally {
                setLoadingBar(false);
            }
        };

        fetchVideo();
    }, []);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTrainerStartedTrainingErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    useEffect(() => {
        handleTrainerStartedTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [startedTrainings, setStartedTrainings] = useState([]);
    const handleTrainerStartedTrainings = async () => {
        setLoadingBar(true);
        const trainerStartedTrainingRequest = {
            exponentId: localStorage.getItem('breezeUserId'),
        }
        try {
            const responseData = await TrainerService.getStartedTrainingByExponentId(trainerStartedTrainingRequest);
            console.log(responseData);
            if (responseData.length === 0) {
                getTrainerStartedTrainingErrMsg('Trainings are not found for Today');
                setStartedTrainings([]);
            } else {
                setStartedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTrainerStartedTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTrainerStartedTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTrainerStartedTrainingErrMsg("Your Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTrainerStartedTrainingErrMsg("Sorry, Our service is down");
        else
            getTrainerStartedTrainingErrMsg("Could not process your request");
    }

    // quotations code
    // const [currentQuotationIndex, setCurrentQuotationIndex] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentQuotationIndex((prevIndex) => (prevIndex + 1) % trainerFlow.length);
    //     }, 30000); // Slide every 30 seconds

    //     return () => clearInterval(interval);
    // }, [trainerFlow.length]);

    // greeting code
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div>
            {loadingBar && <LoadingBar />}
            <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="slider-container mt-5" style={{ flex: '1' }} >
                    <h5>Hello {userFullName}</h5>
                    <h5>{greeting}</h5>
                    <h6 style={{ textDecoration: 'underline' }} >Trainer Flow :</h6>
                    <div className="quotation-slider" >
                        {/* {trainerFlow.map((quotation, index) => (
                            <div
                                key={index}
                                className={`quotation ${index === currentQuotationIndex ? 'active' : ''}`}
                                style={{ transform: `translateX(-${currentQuotationIndex * 100}%)` }}
                            >
                                {quotation}
                            </div>
                        ))} */}
                        <ol style={{listStyleType:'none', paddingLeft:0}}>
                            {trainerFlow.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div>
                    <label style={{ textDecoration: 'underline' }}>Intro Video Sample</label>
                    <div>
                        <video style={{ width: '300px', height: '200px' }} src={videoUrl} controls autoPlay muted />
                    </div>
                </div>
            </div>
            <div className='mt-5' style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80vh', overflow: 'auto' }}>
                <Card style={{ width: '100%', fontSize: '13px' }} className='card'>
                    <Card.Header style={{ backgroundColor: childColor }}>
                        <Card.Title style={{ fontSize: '15px' }}>Today Trainings</Card.Title>
                    </Card.Header>
                    <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {startedTrainings.map((item, index) => (
                            <Card key={index} style={{ width: '20rem', margin: '1rem', fontSize: '13px' }} className='card'>
                                <Card.Header style={{ backgroundColor: childColor }}>
                                    <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <label>Course : </label> <span>{item.training.courseName}</span> <br />
                                        <label>Technical-Stack : </label> <span>{item.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                        <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).date}</span> <br />
                                        <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).time)}</span> <br />
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseEndDate)).date}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {startedTrainings.length === 0 && (
                            <div style={{ width: '100%' }}>
                                <h5 style={{ textAlign: 'center' }}>You have No Trainings Today</h5>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
            <div className=''>
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
            </div>
        </div>
    );
}

export default TrainerHome;