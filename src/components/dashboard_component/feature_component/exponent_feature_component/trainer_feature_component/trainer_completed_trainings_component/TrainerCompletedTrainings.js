import { useEffect, useState } from 'react';
import './TrainerCompletedTrainings.css';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import Constants from '../../../../../Constants';
import { Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function TrainerCompletedTrainings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTrainerCompletedTrainingErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        handleTrainerCompletedTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [completedTrainings, setCompletedTrainings] = useState([]);
    const handleTrainerCompletedTrainings = async () => {
        setLoadingBar(true);
        const trainerCompletedTrainingRequest = {
            exponentId: localStorage.getItem('breezeUserId'),
        }
        try {
            const responseData = await TrainerService.getCompletedTrainingByExponentId(trainerCompletedTrainingRequest);
            console.log(responseData);
            if (responseData.length === 0) {
                getTrainerCompletedTrainingErrMsg('Completed Trainings are not found');
                setCompletedTrainings([]);
            } else {
                setCompletedTrainings(responseData);
            }
        } catch (error) {
            console.log(error.message);
            handleTrainerCompletedTrainingErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTrainerCompletedTrainingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTrainerCompletedTrainingErrMsg("Your Id is invalid");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTrainerCompletedTrainingErrMsg("Sorry, Our service is down");
        else
            getTrainerCompletedTrainingErrMsg("Could not process your request");
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='trainer-completed-trainings'>
            { loadingBar && <LoadingBar /> }
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {completedTrainings.map((item, index) => (
                    <Card key={index} style={{ width: '22rem', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor }}>
                            <Card.Title style={{ fontSize: '15px' }}>{item.training.courseName + " Course"}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <label>Course : </label> <span>{item.training.courseName}</span> <br />
                                <label>Technical-Stack : </label> <span>{item.training.technologyList.map(tech => tech.technologyName).join(', ')}</span> <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Course Duration : </label> <span>{item.training.courseDuration + " days"}</span>
                                    </div>
                                    <div>
                                        <label>Start Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).date}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Session Duration : </label> <span>{item.training.sessionDuration}</span>
                                    </div>
                                    <div>
                                        <label>Start Time : </label> <span>{Constants.formatTime((Constants.convertUserTimezoneDateTime(item.training.courseStartDateAndTime)).time)}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label>Enrolled : </label> <span>{item.enrolledCandidatesCount}</span>
                                    </div>
                                    <div>
                                        <label>End Date : </label> <span>{(Constants.convertUserTimezoneDateTime(item.training.courseEndDate)).date}</span>
                                    </div>
                                </div>
                                <div className='mt-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Rated : </label> <span style={{ verticalAlign: 'middle' }}>{item.training.ratedCount}</span>
                                    </div>
                                    <div>
                                        <label style={{ verticalAlign: 'middle' }}>Average Rating : &nbsp;</label>
                                        <span>
                                            <Rating
                                                size={20}
                                                initialValue={item.training.ratedCount === 0 ? 0 : item.training.rating}
                                                allowFraction
                                                fillColor='#1b4962'
                                                readonly={true}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
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

export default TrainerCompletedTrainings; 