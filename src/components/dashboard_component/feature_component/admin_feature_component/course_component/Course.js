import Constants from "../../../../Constants";
import AdminService from '../../../../../Services/admin_service/AdminService';
import Select from 'react-select';
import { useEffect, useState } from "react";
import GlobalService from "../../../../../Services/global_service/GlobalService";
import './Course.css';
import LoadingBar from "../../../../loading_bar_component/LoadingBar";

function Course() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);

    const [courseName, setCourseName] = useState('');
    const handleCourseName = (e) => setCourseName(e.target.value);

    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
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
    }, []);

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //JS for to display err msg when validation for pattern fails for inputs
    const createCourseDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //JS for to display success msg
    const createCourseDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const handleCreateCourse = async () => {
        if (courseName === null || courseName === '') {
            createCourseDisplayErrMsg('Course should not be null or empty');
        } else {
            setLoadingBar(true);
            const request = {
                courseName: courseName,
            }
            try {
                const responseData = await AdminService.createCourse(request);
                console.log(responseData);
                createCourseDisplaySucMsg('Course Created Succesfully');
            } catch (error) {
                handleCreateCourseError(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleCreateCourseError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createCourseDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_COURSE === errorStatus)
            createCourseDisplayErrMsg("Course already existed");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createCourseDisplayErrMsg("Sorry, Our service is down");
        else
            createCourseDisplayErrMsg("Could not process your request");
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
            maxWidth: '400px',
        }),
        menu: (provided, state) => ({
            ...provided,
            maxWidth: '400px',
        }),
    };

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='course'>
            { loadingBar && <LoadingBar /> }
            <div className="create-course">
                <label>Create Course</label>
                <input
                    type="text"
                    className="create-course-input"
                    value={courseName}
                    onChange={handleCourseName}
                />
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
                <button
                    className='dashboard-button'
                    onClick={handleCreateCourse}
                >
                    Create
                </button>
            </div>
            <div className='view-course mt-5'>
                <label>View Courses</label>
                <Select 
                    options={courseList}
                    getOptionLabel={(options) => {
                        return options["courseName"];
                    }}
                    getOptionValue={(options) => {
                        return options["courseName"];
                    }}
                    placeholder='Present Courses'
                    styles={customCssForCourseFlds}
                />
            </div>
        </div>
    );

}

export default Course;