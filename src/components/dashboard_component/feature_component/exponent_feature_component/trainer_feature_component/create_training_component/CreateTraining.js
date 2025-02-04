import './CreateTraining.css';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import GlobalService from '../../../../../../Services/global_service/GlobalService';
import Multiselect from 'multiselect-react-dropdown';
import { Button } from 'react-bootstrap';
import TrainerService from '../../../../../../Services/exponent_service/TrainerService';
import Constants from '../../../../../Constants';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import LoadingBar from '../../../../../loading_bar_component/LoadingBar';

function CreateTraining() {

    const [loadingBar, setLoadingBar] = useState(false);

    const userId = localStorage.getItem("breezeUserId");

    // course code
    const [course, setCourse] = useState(null);
    const onSelectCourse = (item) => {
        setCourse(item);
        console.log(course);
    }
    const [courseList, setCourseList] = useState([]);

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

    // course content code
    const [courseContent, setCourseContent] = useState(null);
    const handleCourseContentFile = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCourseContent(file);
        } else {
            alert('Please select a PDF or Word document');
            event.target.value = ''; // Clear the file input
            setCourseContent(null);
        }
    };

    // intro video code
    const [introVideo, setIntroVideo] = useState(null);
    const handleIntroVideoFile = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setIntroVideo(file);
        } else {
            alert('Please select a video file');
            event.target.value = ''; // Clear the file input
            setIntroVideo(null);
        }
    };

    // corse duration
    const [courseDuration, setCourseDuration] = useState(0);
    const handleCourseDurationChange = (event) => {
        setCourseDuration(event.target.value);
    }

    // date and time
    const [courseStartDateAndTime, setCourseStartDateAndTime] = useState(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 17);
    const isValidDate = (current) => {
        return current.isAfter(minDate) && current.isBefore(maxDate);
    };
    const handleCourseStartDateChange = (date) => {
        setCourseStartDateAndTime(date);
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

        const getAllCourse = async () => {
            setLoadingBar(true);
            try {
                const responseData = await GlobalService.getAllCourse();
                console.log(responseData);
                setCourseList(responseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllCourse();

    }, [userId]);

    const handleCreateTraining = async () => {
        console.log(course);
        console.log(technologies);
        console.log(technologies.map(tech => tech.technologyName));
        console.log(courseStartDateAndTime);
        console.log(courseDuration);

        if (course === null || course === '') {
            createTrainingFieldsDisplayErrMsg('Please select one course');
        } else if (technologies === null || technologies.length === 0) {
            createTrainingFieldsDisplayErrMsg('Please add your technical stack');
        } else if (!courseContent) {
            createTrainingFieldsDisplayErrMsg('Please upload course content');
        } else if (!introVideo) {
            createTrainingFieldsDisplayErrMsg('Please upload your 1 minute intro video');
        } else if (courseDuration > 120 || courseDuration < 30) {
            createTrainingFieldsDisplayErrMsg('Please give course duration between 30 to 120 (in days)');
        } else if (courseStartDateAndTime === null) {
            createTrainingFieldsDisplayErrMsg('Please select start date and time');
        } else if (courseContent.size > 5 * 1024 * 1024) { 
            createTrainingFieldsDisplayErrMsg('Course content file size exceeds the maximum limit of 5MB');
        } else if (introVideo.size > 5 * 1024 * 1024) { 
            createTrainingFieldsDisplayErrMsg('Intro video file size exceeds the maximum limit of 5MB');
        } else {
            setLoadingBar(true);
            // Create FormData object
            const formData = new FormData();
            formData.append('exponentId', userId);
            formData.append('courseId', course.courseId);
            formData.append('courseName', course.courseName);
            formData.append('technologyList', (technologies.map(tech => tech.technologyName)));
            formData.append('courseContentFile', courseContent);
            formData.append('introVideoFile', introVideo);
            formData.append('courseDuration', courseDuration);
            formData.append('courseStartDateAndTime', courseStartDateAndTime);
            formData.append('sessionDuration', Constants.SESSION_DURATION);
            console.log(formData);
            try {
                const responseData = await TrainerService.createTraining(formData);
                console.log(responseData);
                createTrainingFieldsDisplaySucMsg('Training Created Successfully');
            } catch (error) {
                handleCreateTrianingErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }

    }

    const handleCreateTrianingErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createTrainingFieldsDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_COURSE === errorStatus)
            createTrainingFieldsDisplayErrMsg("Already you created training for selected course");
        else if (Constants.FILES_NOT_UPLOADED === errorStatus)
            createTrainingFieldsDisplayErrMsg("Files could not uploaded");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createTrainingFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            createTrainingFieldsDisplayErrMsg("Could not process your request"); 
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const createTrainingFieldsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    //JS for to display success msg
    const createTrainingFieldsDisplaySucMsg = (errorMessage) => {
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

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

    // custom css for course input fields for Select component from react-select
    const customCssForCourseFlds = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? childColor : '',
            color: state.isFocused ? whiteColor : '',
            ':hover': {
                backgroundColor: childColor,
                color: whiteColor,
            },
        }),
        control: (provided, state) => ({
            ...provided,
            // maxWidth: '400px',
        }),
        menu: (provided, state) => ({
            ...provided,
            // maxWidth: '400px',
        }),
    };

    return (
        <div className="create-training" style={{ fontSize: '14px' }}>
            { loadingBar && <LoadingBar /> }
            <div className="training-form">
                <form>
                    <div className='course'>
                        <label>Choose Course</label>
                        <Select
                            options={courseList}
                            getOptionLabel={(options) => {
                                return options["courseName"];
                            }}
                            getOptionValue={(options) => {
                                return options["courseName"];
                            }}
                            onChange={onSelectCourse}
                            placeholder='Present Courses'
                            styles={customCssForCourseFlds}
                        />
                    </div>
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
                    <div className="course-content-file mt-3">
                        <label>Upload Course Content <strong>(max size is 5MB)</strong></label>
                        <input
                            type="file"
                            className="form-control"
                            id="courseContentFile"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCourseContentFile}
                        />
                    </div>
                    <div className='intro-video-file mt-3'>
                        <label>Upload Your Intro Video <strong>(1 minute) (max size is 5MB)</strong></label>
                        <input
                            type="file"
                            className="form-control"
                            id="introVideoFile"
                            accept="video/*"
                            onChange={handleIntroVideoFile}
                        />
                    </div>
                    <div className='course-duration mt-3'>
                        <label>Course Duration <strong>(Number of days)</strong></label>
                        <input
                            type='number'
                            min={30}
                            max={120}
                            className='form-control'
                            placeholder='Duration'
                            value={courseDuration}
                            onChange={handleCourseDurationChange}
                        />
                    </div>
                    <div className='date-time mt-3'>
                        <label>Select Training Start Date and Time <strong>(You can select after 3 days to current date)</strong></label>
                        <Datetime
                            value={courseStartDateAndTime}
                            onChange={handleCourseStartDateChange}
                            isValidDate={isValidDate}
                            inputProps={{
                                placeholder: 'Select Date and Time',
                                readOnly: true,
                            }}
                        />
                    </div>
                    <div className='mt-2'>
                        {errMsgDiv &&
                            <div style={customCssForMsg}>
                                <label>{errMsg}</label>
                            </div>}
                    </div>
                    <div className='mt-3'>
                        <div style={{fontSize:'12px'}}>
                            <label htmlFor="name"><span style={{ color: 'red' }}>* </span>Daily Session Duration is Fixed to 90 mins.</label> <br />
                            <label htmlFor="name"><span style={{ color: 'red' }}>* </span>Course Duration Should be Between 30 to 120 days.</label>
                        </div>
                        <Button
                            className='dashboard-button mt-1'
                            onClick={handleCreateTraining}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CreateTraining;