import { useEffect, useState } from 'react';
import './CandidateTodayJobSupportBookings.css';
import CandidateService from '../../../../../../Services/candidate_service/CandidateService';
import Constants from '../../../../../Constants';
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';
import { Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function CandidateTodayJobSupportBookings() {

    const [loadingBar, setLoadingBar] = useState(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const getTodayCandidateJobSupportBookingsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        // setTimeout(() => {
        //     setErrMsg("");
        //     setErrMsgDiv(false);
        // }, 3000);
    }

    useEffect(() => {
        getTodayCandidateJobSupportBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [todayCandidateJobSupportBookings, setTodayCandidateJobSupportBookings] = useState([]);
    const getTodayCandidateJobSupportBookings = async () => {
        setLoadingBar(true);
        const request = {
            candidateId: localStorage.getItem('breezeUserId'),
        }

        try {
            const responseData = await CandidateService.getTodayCandidateJobSupportBookingByCandidateId(request);
            console.log(responseData);
            if (responseData.length === 0) {
                getTodayCandidateJobSupportBookingsDisplayErrMsg('Job Support Bookings are not found');
                setTodayCandidateJobSupportBookings([]);
            } else {
                setTodayCandidateJobSupportBookings(responseData);
                if (!(responseData.some(item => item.jobSupportBookingDto.meetingLink !== ''))) {
                    console.log('meeting link is not there');
                    setTimeout(() => {
                        getTodayCandidateJobSupportBookings();
                    }, 60000);
                }
            }
        } catch (error) {
            console.log(error.message);
            handleTodayCandidateJobSupportBookingsErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleTodayCandidateJobSupportBookingsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            getTodayCandidateJobSupportBookingsDisplayErrMsg('Your Id is invalid');
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            getTodayCandidateJobSupportBookingsDisplayErrMsg('Sorry, Our service is down');
        else
            getTodayCandidateJobSupportBookingsDisplayErrMsg("Could not process your request");
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='candidate-today-job-support-bookings'>
            {loadingBar && <LoadingBar />}
            <div className='' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {todayCandidateJobSupportBookings.map((item, index) => (
                    <Card key={index} style={{ width: '100%', margin: '0.5rem', fontSize: '13px' }} className='card'>
                        <Card.Header style={{ backgroundColor: childColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title style={{ fontSize: '15px' }}>{"Job Support Booking"}</Card.Title>
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
                                    <div>
                                        <button
                                            className='join-meeting-button'
                                            onClick={() => window.open(item.jobSupportBookingDto.meetingLink, '_blank')}
                                            disabled={item.jobSupportBookingDto.meetingLink === ''}
                                        >
                                            Join Zoom Meeting
                                        </button>
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

export default CandidateTodayJobSupportBookings; 