import { useEffect, useState } from 'react';
import AdminService from '../../../../../Services/admin_service/AdminService';
import './Technology.css';
import Select from 'react-select';
import Constants from '../../../../Constants';
import GlobalService from '../../../../../Services/global_service/GlobalService';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';

function Technology() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);

    const [technologyName, setTechnologyName] = useState('');
    const handleTechnologyName = (e) => setTechnologyName(e.target.value);

    const [technologyList, setTechnologyList] = useState([]);

    useEffect(() => {
        const getAllTechnology = async () => {
            setLoadingBar(true);
            try {
                const responseData = await GlobalService.getAllTechnology();
                console.log(responseData);
                setTechnologyList(responseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllTechnology();
    }, []);

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //JS for to display err msg when validation for pattern fails for inputs
    const addTechnologyDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //JS for to display success msg
    const addTechnologyDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const handleAddTechnology = async () => {
        if (technologyName === null || technologyName === '') {
            addTechnologyDisplayErrMsg('Technical Stack should not be null or empty');
        } else {
            setLoadingBar(true);
            const request = {
                technologyName: technologyName,
            }
            try {
                const responseData = await AdminService.addTechnology(request);
                console.log(responseData);
                addTechnologyDisplaySucMsg('Technical Stack Added Succesfully');
            } catch (error) {
                handleAddTechnologyError(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleAddTechnologyError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            addTechnologyDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_TECHNOLOGY === errorStatus)
            addTechnologyDisplayErrMsg("Technical Stack already existed");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            addTechnologyDisplayErrMsg("Sorry, Our service is down");
        else
            addTechnologyDisplayErrMsg("Could not process your request");
    }

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

    // custom css for technology input fields for Select component from react-select
    const customCssForTechnologyFlds = {
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
        <div className='technology'>
            { loadingBar && <LoadingBar /> }
            <div className="add-technology">
                <label>Enter New Technical Stack</label>
                <input
                    type="text"
                    className="add-technology-input"
                    value={technologyName}
                    onChange={handleTechnologyName}
                />
                {errMsgDiv &&
                    <div style={customCssForMsg}>
                        <label>{errMsg}</label>
                    </div>}
                <button
                    className='dashboard-button'
                    onClick={handleAddTechnology}
                >
                    Add
                </button>
            </div>
            <div className='view-technology mt-5'>
                <label>View Technical Stack</label>
                <Select
                    options={technologyList}
                    getOptionLabel={(options) => {
                        return options["technologyName"];
                    }}
                    getOptionValue={(options) => {
                        return options["technologyName"];
                    }}
                    placeholder='Present Technical Stack'
                    styles={customCssForTechnologyFlds}
                />
            </div>
        </div>
    );

}

export default Technology;