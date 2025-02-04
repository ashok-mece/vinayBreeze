import { useState } from 'react';
import '../Dashboard.css';
import './NavBar.css';
import {
    CDBNavbar,
    CDBNavBrand,
    CDBBtn,
} from 'cdbreact';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import GlobalService from '../../../Services/global_service/GlobalService';
import UserService from '../../../Services/user_service/UserService';
import Constants from '../../Constants';
import LoadingBar from '../../loading_bar_component/LoadingBar';
import appLogo from '../../../assets/appicon.jpeg';

function NavBar() {

    const userId = localStorage.getItem("breezeUserId");
    const userType = localStorage.getItem("breezeUserType");
    const userFullName = localStorage.getItem("breezeUserFullName");
    const userMailId = localStorage.getItem("breezeUsername");

    const [loadingBar, setLoadingBar] = useState(false);

    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const updateFieldsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //JS for to display success msg
    const updateFieldsDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor('#be3144');
            handleModalClose();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }
    const updateFieldsDisplaySucMsgToVerify = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor('#be3144');
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [isUserProfileDropdown, setIsUserProfileDropdown] = useState(false);

    const toggleUserProfileDropdown = () => {
        setIsUserProfileDropdown(!isUserProfileDropdown);
    };

    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => {
        setShowModal(false)
        setNewlyAddedTechnologies([]);
        setTechnologiesList([]);
        setExponentTechnicalStack([]);
        setUserPhone('');
        setPhone('');
        setCountryCode('');
        setPhoneWithCountryCode(null);
        setExperience(0);
        setUserMail('');
        setIsOtpSentToPhoneNumber(false);
        setIsContactInfoVerified(false);
        setOtpToPhoneNumber('');
        setIsDisableContactInfo(true);
        setIsOtpSentToMail(false);
        setIsMailInfoVerified(false);
        setOtpToMail('');
        setIsDisableMailInfo(true);
    };

    // technology code
    const [newlyAddedTechnologies, setNewlyAddedTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const [exponentTechnicalStack, setExponentTechnicalStack] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        setNewlyAddedTechnologies([...selectedList]);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setNewlyAddedTechnologies([...selectedList]);
    }

    // phone code
    const [userPhone, setUserPhone] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneWithCountryCode, setPhoneWithCountryCode] = useState(null);
    const [iso2, setIso2] = useState('');
    const handleContactInfo = (phone, country) => {
        const countryCodeWithPlus = '+' + country.country.dialCode;
        const phoneWithOutCountryCode = phone.replace(countryCodeWithPlus, '');
        setPhone(phoneWithOutCountryCode);
        console.log(country);
        setPhoneWithCountryCode(country.inputValue);
        setCountryCode(country.country.dialCode);
        setIso2(country.country.iso2);
    }

    const [isOtpSentToPhoneNumber, setIsOtpSentToPhoneNumber] = useState(false);
    const [isContactInfoVerified, setIsContactInfoVerified] = useState(false);
    const handleSendOtpToPhoneNumber = async () => {

        if (phone === null || phone === '' || phone === undefined) {
            updateFieldsDisplayErrMsg("please enter your contact information");
        } else {
            setLoadingBar(true);
            const request = {
                countryCode: countryCode,
                phoneNumber: phone,
                phoneNumberWithCountryCode: phoneWithCountryCode,
                regionCode: iso2,
                userId: userId
            }
            console.log(request);
            try {
                const responseData = await UserService.sendOtpToPhoneNumber(request);
                console.log(responseData);
                updateFieldsDisplaySucMsgToVerify(responseData);
                setIsOtpSentToPhoneNumber(true);
            } catch (error) {
                handleSendOtpToPhoneNumberErrors(error.message);
                setIsOtpSentToPhoneNumber(false);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleSendOtpToPhoneNumberErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateFieldsDisplayErrMsg("Please enter valid contact information");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.INVALID_PHONE_NUMBER === errorStatus)
            updateFieldsDisplayErrMsg("Entered Phone Number is Invalid");
        else if (Constants.OTP_NOT_SENT === errorStatus)
            updateFieldsDisplayErrMsg("Failed to send otp");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            updateFieldsDisplayErrMsg("Could not process your request");
    }

    const handleEditContactInfo = () => {
        setIsOtpSentToPhoneNumber(false);
    }

    const [otpToPhoneNumber, setOtpToPhoneNumber] = useState('');
    const handleOtpInput = (e) => setOtpToPhoneNumber(e.target.value);
    const handleVerifyOtpToPhoneNumber = async () => {
        if (otpToPhoneNumber === 0 || otpToPhoneNumber === null || otpToPhoneNumber === '' || otpToPhoneNumber === undefined) {
            updateFieldsDisplayErrMsg("please enter otp");
        } else if (otpToPhoneNumber.length !== 6) {
            updateFieldsDisplayErrMsg("invalid otp");
        } else {
            setLoadingBar(true);
            const request = {
                emailOtp: otpToPhoneNumber,
                userId: userId
            }
            console.log(request);
            try {
                const responseData = await UserService.verifyOtpToPhoneNumber(request);
                console.log(responseData);
                setIsContactInfoVerified(true);
            } catch (error) {
                handleVerifyOtpToPhoneNumberErrors(error.message);
                setIsContactInfoVerified(false);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleVerifyOtpToPhoneNumberErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateFieldsDisplayErrMsg("Please enter valid otp");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            updateFieldsDisplayErrMsg("Entered Otp is Incorrect");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            updateFieldsDisplayErrMsg("Could not process your request");
    }

    // experience code
    const [experience, setExperience] = useState(0);
    const handleExperienceInput = (e) => setExperience(e.target.value);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // mail code
    const [userMail, setUserMail] = useState('');
    const handleMailInput = (e) => setUserMail(e.target.value);

    const [isOtpSentToMail, setIsOtpSentToMail] = useState(false);
    const [isMailInfoVerified, setIsMailInfoVerified] = useState(false);
    const handleSendOtpToMail = async () => {

        if (!emailPattern.test(userMail) || !((userMail).slice(-4)).includes('.co')) {
            updateFieldsDisplayErrMsg("please enter a valid mail id");
        } else {
            setLoadingBar(true);
            const request = {
                userId: userId,
                username: userMail
            }
            console.log(request);
            try {
                const responseData = await UserService.sendOtpToMail(request);
                console.log(responseData);
                updateFieldsDisplaySucMsgToVerify(responseData);
                setIsOtpSentToMail(true);
            } catch (error) {
                handleSendOtpToMailErrors(error.message);
                setIsOtpSentToMail(false);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleSendOtpToMailErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateFieldsDisplayErrMsg("Please enter valid mail information");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.ADDRESS_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Entered Mail Id is Invalid");
        else if (Constants.MESSAGING_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Mail not sent, try again");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            updateFieldsDisplayErrMsg("Could not process your request");
    }

    const handleEditMailInfo = () => {
        setIsOtpSentToMail(false);
    }

    const [otpToMail, setOtpToMail] = useState('');
    const handleOtpInputForMail = (e) => setOtpToMail(e.target.value);
    const handleVerifyOtpToMail = async () => {
        if (otpToMail === 0 || otpToMail === null || otpToMail === '' || otpToMail === undefined) {
            updateFieldsDisplayErrMsg("please enter otp");
        } else if (otpToMail.length !== 6) {
            updateFieldsDisplayErrMsg("invalid otp");
        } else {
            setLoadingBar(true);
            const request = {
                emailOtp: otpToMail,
                userId: userId
            }
            console.log(request);
            try {
                const responseData = await UserService.verifyOtpToMail(request);
                console.log(responseData);
                setIsMailInfoVerified(true);
            } catch (error) {
                handleVerifyOtpToMailErrors(error.message);
                setIsMailInfoVerified(false);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleVerifyOtpToMailErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateFieldsDisplayErrMsg("Please enter valid otp");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            updateFieldsDisplayErrMsg("Entered Otp is Incorrect");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            updateFieldsDisplayErrMsg("Could not process your request");
    }

    const handleUpdateDetailsClick = async () => {
        setLoadingBar(true);
        try {
            const request = {
                userId: userId
            }

            if (userType === Constants.EXPONENT) {
                const allTechResponseData = await GlobalService.getAllTechnology();
                console.log(allTechResponseData);
                setTechnologiesList(allTechResponseData);

                const expoTechResponseData = await GlobalService.getTechStackByExponentId(request);
                console.log(expoTechResponseData);
                const jsonResponseData = expoTechResponseData.map((item, index) => {
                    return { technologyName: item }
                });
                console.log(jsonResponseData);
                setExponentTechnicalStack(jsonResponseData);
                setNewlyAddedTechnologies(jsonResponseData);
            }

            const userResponseData = await UserService.getUserDataByUserId(request);
            console.log(userResponseData);
            setUserPhone(userResponseData.phoneNumberWithCountryCode);
            if (userType === Constants.EXPONENT) {
                setExperience(userResponseData.userExperience);
            }
            setUserMail(userResponseData.username);

        } catch (error) {

        } finally {
            setLoadingBar(false);
            setShowModal(true);
        }
    }

    const handleUpdateFieldsSubmit = async () => {
        if (userType === Constants.EXPONENT && (newlyAddedTechnologies === null || newlyAddedTechnologies.length === 0 || newlyAddedTechnologies.length < 3)) {
            // console.log('Technologies array is null or empty.');
            updateFieldsDisplayErrMsg('Please choose your minimum 3 technical stacks');
        } else if (!isContactInfoVerified && !isDisableContactInfo) {
            updateFieldsDisplayErrMsg('verify your contact information');
        } else if (phone === null || phone === '' || phone === undefined) {
            console.log('phone is null or empty.');
            updateFieldsDisplayErrMsg('please enter your contact information');
        } else if (userType === Constants.EXPONENT && (experience === null || experience === '' || experience === undefined || experience === 0)) {
            console.log('experience is null or empty or greater than 50.');
            updateFieldsDisplayErrMsg('please enter you experience');
        } else if (userType === Constants.EXPONENT && (experience === null || experience === '' || experience === undefined || experience === 0 || experience > 50)) {
            console.log('experience is null or empty or greater than 50.');
            updateFieldsDisplayErrMsg('experience should be less than or equal to 50');
        } else if (!isMailInfoVerified && !isDisableMailInfo) {
            updateFieldsDisplayErrMsg('verify your mail information');
        } else if (!emailPattern.test(userMail) || !((userMail).slice(-4)).includes('.co')) {
            console.log('experience is null or empty or greater than 20.');
            updateFieldsDisplayErrMsg('please enter a valid mail id');
        } else {
            setLoadingBar(true);
            const request = {
                userId: userId,
                userType: userType,
                technologyList: newlyAddedTechnologies,
                phoneNumber: phone,
                countryCode: countryCode,
                phoneNumberWithCountryCode: phoneWithCountryCode,
                userExperience: experience,
                username: userMail,
            }
            console.log(request);
            try {
                const responseData = await UserService.updateUserDetails(request);
                console.log(responseData);
                localStorage.setItem("breezeUsername", responseData.username);
                updateFieldsDisplaySucMsg('Details Updated Successfully');
            } catch (error) {
                handleUpdateFieldsErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    };

    const handleUpdateFieldsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            updateFieldsDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            updateFieldsDisplayErrMsg("Entity Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            updateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            updateFieldsDisplayErrMsg("Could not process your request");
    }

    const [isDisableContactInfo, setIsDisableContactInfo] = useState(true);
    const handleEditClickOnContactInfo = () => {
        setIsDisableContactInfo(false);
    }

    const [isDisableMailInfo, setIsDisableMailInfo] = useState(true);
    const handleEditClickOnMailInfo = () => {
        setIsDisableMailInfo(false);
    }

    // logout code
    const handleLogout = () => {
        localStorage.removeItem('breezeUserId');
        localStorage.removeItem('breezeUserType');
        localStorage.removeItem('breezeUsername');
        localStorage.removeItem('breezeUserFullName');
        localStorage.removeItem('breezeUserFirstTimeLogin');
        localStorage.removeItem('breezeExponentType');
        localStorage.removeItem('breezeJwtToken');
        localStorage.removeItem('breezeSelectedExponentType');

        window.location.href = '/login';
    };

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div>
            {loadingBar && <LoadingBar />}
            <CDBNavbar className='app-bg-color justify-content-between px-4'>
                <CDBNavBrand href='/' style={{ display: 'flex', alignItems: 'center' }} >
                    <img src={appLogo} alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'contain', marginRight: '7px', boxShadow: '0 0 0 2px white', backgroundColor: 'white' }} />
                    <strong className='white-color' style={{ margin: 0 }}>Prepswise</strong>
                </CDBNavBrand>
                <div>
                    <ul className="nav">
                        <li className="nav-item dropdown" >
                            <CDBBtn
                                onClick={toggleUserProfileDropdown}
                                aria-expanded={isUserProfileDropdown ? "true" : "false"}
                                className='child-bg-color'
                                style={{ fontSize: '16px', fontWeight: 'bold' }}
                            >
                                {userFullName && userFullName.charAt(0).toUpperCase()}
                            </CDBBtn>
                            <ul
                                className={`dropdown-menu ${isUserProfileDropdown ? 'show dropdown-menu-start' : ''}`}
                                style={{
                                    marginTop: isUserProfileDropdown ? '20px' : '0',
                                    marginRight: isUserProfileDropdown ? '5px' : '0',
                                    left: isUserProfileDropdown ? '-200px' : 'auto',
                                    width: '240px',
                                    maxWidth: '240px',
                                    overflow: 'auto',
                                    fontSize: '12px',
                                }}
                            >
                                <li><label className="dropdown-item" ><i className='fas fa-user'></i> {userFullName}</label></li>
                                <li><label className="dropdown-item" ><i className='fas fa-envelope'></i> {userMailId}</label></li>
                                {userType !== Constants.ADMIN && (
                                    <li onClick={handleUpdateDetailsClick} >
                                        <label className="dropdown-item" style={{ cursor: 'pointer' }} ><i class="fas fa-edit"></i> Update Details</label>
                                    </li>
                                )}
                                <li onClick={handleLogout} >
                                    <label className="dropdown-item" style={{ cursor: 'pointer' }}><i class="fas fa-sign-out-alt"></i> Logout</label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </CDBNavbar>
            {showModal && (
                <Modal className='update-details-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ fontSize: '20px' }}>
                                Update Details
                            </Modal.Title>
                        </Modal.Header>
                    </Container>
                    <Modal.Body>
                        <Container className='px-5' style={{ fontSize: '15px' }}>
                            {userType === Constants.EXPONENT && (
                                <div>
                                    <div>
                                        <label>Add Technical Stack</label>
                                        <Row>
                                            <Col>
                                                <div className='technology-multiselect'>
                                                    <Multiselect
                                                        id='technology'
                                                        options={technologiesList}
                                                        selectedValues={exponentTechnicalStack}
                                                        onSelect={onSelectTechnology}
                                                        onRemove={onRemoveTechnology}
                                                        displayValue="technologyName"
                                                        placeholder="Add Technical Stack"
                                                        avoidHighlightFirstOption={true}
                                                        style={{
                                                            chips: {
                                                                background: childColor,
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className='mt-2'>
                                        <Row>
                                            <Col>
                                                <div className='experience'>
                                                    <label>Experience</label>
                                                    <input
                                                        type='number'
                                                        className='expInput'
                                                        placeholder='Your Experience'
                                                        value={experience}
                                                        onChange={handleExperienceInput}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = ['.', 'Backspace'];
                                                            for (let i = 0; i <= 9; i++) {
                                                                allowedKeys.push(i.toString());
                                                            }
                                                            if (!allowedKeys.includes(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                            if (e.key === '.' && e.target.value.includes('.')) {
                                                                e.preventDefault();
                                                            }
                                                            if (e.key === '-' && e.target.selectionStart !== 0) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        step="any" // Allows for decimals
                                                        min="1"
                                                        max="50"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )}
                            <div className='mt-2'>
                                <label>Mail Info</label>
                                <Row>
                                    <Col>
                                        <div className='mail-info' style={{ display: 'flex' }}>
                                            <div style={{ width: '50%'}}>
                                                <input
                                                    type='email'
                                                    className='form-control'
                                                    value={userMail}
                                                    onChange={handleMailInput}
                                                    inputStyle={{ width: '100%' }}
                                                    disabled={(isDisableMailInfo || isOtpSentToMail)}
                                                />
                                            </div>
                                            {isDisableMailInfo && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleEditClickOnMailInfo}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {(!isMailInfoVerified && !isDisableMailInfo) && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleSendOtpToMail}
                                                    disabled={isOtpSentToMail}
                                                >
                                                    Send Otp
                                                </Button>
                                            )}
                                            {isMailInfoVerified && (
                                                <Button
                                                    className='button-otp'
                                                >
                                                    Verified
                                                </Button>
                                            )}
                                            {(isOtpSentToMail && !isMailInfoVerified) && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleSendOtpToMail}
                                                >
                                                    ReSend
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {!isMailInfoVerified && (
                                isOtpSentToMail && (
                                    <div className='mt-2'>
                                        <label><span style={{ color: 'red' }}>*</span>Enter Otp</label>
                                        <Row>
                                            <Col>
                                                <div className='mail-info' style={{ display: 'flex' }}>
                                                    <input
                                                        type='number'
                                                        placeholder='Enter Otp'
                                                        style={{ borderRadius: '4px' }}
                                                        value={otpToMail}
                                                        onChange={handleOtpInputForMail}
                                                    />
                                                    <Button
                                                        className='button-otp'
                                                        onClick={handleVerifyOtpToMail}
                                                    >
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        className='button-otp'
                                                        onClick={handleEditMailInfo}
                                                    >
                                                        Edit Mail Info
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            )}
                            <div className='mt-2'>
                                <label>Contact Info</label>
                                <Row>
                                    <Col>
                                        <div className='contact-info' style={{ display: 'flex' }}>
                                            <PhoneInput
                                                forceDialCode={true}
                                                value={userPhone}
                                                onChange={handleContactInfo}
                                                inputStyle={{ width: '100%' }}
                                                hideDropdown={true}
                                                disabled={(isDisableContactInfo || isOtpSentToPhoneNumber)}
                                            />
                                            {isDisableContactInfo && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleEditClickOnContactInfo}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {(!isContactInfoVerified && !isDisableContactInfo) && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleSendOtpToPhoneNumber}
                                                    disabled={isOtpSentToPhoneNumber}
                                                >
                                                    Send Otp
                                                </Button>
                                            )}
                                            {isContactInfoVerified && (
                                                <Button
                                                    className='button-otp'
                                                >
                                                    Verified
                                                </Button>
                                            )}
                                            {(isOtpSentToPhoneNumber && !isContactInfoVerified) && (
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleSendOtpToPhoneNumber}
                                                >
                                                    ReSend
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {!isContactInfoVerified && (
                                isOtpSentToPhoneNumber && (
                                    <div className='mt-2'>
                                        <label><span style={{ color: 'red' }}>*</span>Enter Otp</label>
                                        <Row>
                                            <Col>
                                                <div className='contact-info' style={{ display: 'flex' }}>
                                                    <input
                                                        type='number'
                                                        placeholder='Enter Otp'
                                                        style={{ borderRadius: '4px' }}
                                                        value={otpToPhoneNumber}
                                                        onChange={handleOtpInput}
                                                    />
                                                    <Button
                                                        className='button-otp'
                                                        onClick={handleVerifyOtpToPhoneNumber}
                                                    >
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        className='button-otp'
                                                        onClick={handleEditContactInfo}
                                                    >
                                                        Edit Contact Info
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            )}
                            <div className='mt-2'>
                                <Row>
                                    <Col>

                                    </Col>
                                </Row>
                            </div>
                            <div>
                                {errMsgDiv &&
                                    <div style={customCssForMsg}>
                                        <label>{errMsg}</label>
                                    </div>}
                            </div>
                            <Button
                                className='dashboard-button mt-3'
                                onClick={handleUpdateFieldsSubmit}
                            >
                                Update
                            </Button>
                        </Container>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );

}

export default NavBar;