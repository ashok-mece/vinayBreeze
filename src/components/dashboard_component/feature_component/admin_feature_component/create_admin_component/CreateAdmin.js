import { useState } from 'react';
import './CreateAdmin.css';
import Constants from '../../../../Constants';
import UserService from '../../../../../Services/user_service/UserService';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';
import { Container, Modal } from 'react-bootstrap';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

function CreateAdmin() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [adminForm, setAdminForm] = useState({
        userFirstname: '',
        userLastname: '',
        username: '',
        password: '',
        confirmPassword: '',
        userType: Constants.ADMIN,
        phoneNumber: '',
        countryCode: '',
        phoneNumberWithCountryCode: null,
        regionCode: '',
    });

    const handleCreateAdminFormFields = (e) => {
        const { name, value } = e.target;
        setAdminForm({
            ...adminForm,
            [name]: value
        });
    };

    const onlyLettersRegex = /^[A-Za-z]+$/;
    const passwordPatternRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$/;

    // phone code
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneWithCountryCode, setPhoneWithCountryCode] = useState(null);
    const [iso2, setIso2] = useState('');
    const handleContactInfo = (phone, country) => {
        const countryCodeWithPlus = '+' + country.country.dialCode;
        const phoneWithOutCountryCode = phone.replace(countryCodeWithPlus, '');
        setPhone(phoneWithOutCountryCode);
        // console.log(country);
        // console.log(phone.replace(countryCodeWithPlus, ''));
        // console.log(country.inputValue);
        // console.log(country.country.dialCode);
        // console.log(country.country.iso2); // region code
        setPhoneWithCountryCode(country.inputValue);
        setCountryCode(country.country.dialCode);
        setIso2(country.country.iso2);
    }

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const matchConfirmPassword = adminForm.password === adminForm.confirmPassword;

        if (!onlyLettersRegex.test(adminForm.userFirstname)) {
            createAdminDisplayErrMsg("First Name is not matching the pattern");
        } else if (!onlyLettersRegex.test(adminForm.userLastname)) {
            createAdminDisplayErrMsg("Last Name is not matching the pattern");
        } else if (!((adminForm.username).slice(-4)).includes('.co')) {
            createAdminDisplayErrMsg("Please provide valid mail address");
        } else if (phone === null || phone === '' || phone === undefined) {
            createAdminDisplayErrMsg("please enter admin contact information");
        } else if (!passwordPatternRegex.test(adminForm.password)) {
            createAdminDisplayErrMsg("Password is not matching the pattern");
        } else if (!matchConfirmPassword) {
            createAdminDisplayErrMsg("Confirm Password not matching Password");
        } else {
            setLoadingBar(true);
            adminForm.phoneNumber = phone;
            adminForm.countryCode = countryCode;
            adminForm.phoneNumberWithCountryCode = phoneWithCountryCode;
            adminForm.regionCode = iso2;
            console.log(adminForm);
            try {
                const responseData = await UserService.createAdmin(adminForm);
                console.log(responseData);
                verifyEmailForm.userId = responseData.userId;
                createAdminDisplaySucMsg('Admin Registered Successfully');
            } catch (error) {
                handleCreateAdminError(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleCreateAdminError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createAdminDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_USERNAME === errorStatus)
            createAdminDisplayErrMsg("Email-Id is already existed");
        else if (Constants.ADDRESS_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Please check, Email syntax");
        else if (Constants.MESSAGING_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Could not sent email, Please try again");
        else if (Constants.INVALID_PHONE_NUMBER === errorStatus)
            createAdminDisplayErrMsg("Entered Phone Number is Invalid");
        else if (Constants.OTP_NOT_SENT === errorStatus)
            createAdminDisplayErrMsg("Failed to send otp");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Sorry, Our service is down");
        else
            createAdminDisplayErrMsg("Could not process your request");
    }

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload();
    }

    const [verifyEmailForm, setVerifyEmailForm] = useState({
        userId: '',
        emailOtp: ''
    });
    const [otpForm, setOtpForm] = useState({
        contactOtp: '',
        emailOtp: ''
    });
    const handleVerifyEmailFormData = (e) => {
        const { name, value } = e.target;
        setOtpForm({
            ...otpForm,
            [name]: value
        });
    };

    const verifyEmailSubmitForm = async (e) => {
        e.preventDefault();
        setLoadingBar(true);
        verifyEmailForm.emailOtp = otpForm.emailOtp + otpForm.contactOtp;
        try {
            const responseData = await UserService.verifyAdmin(verifyEmailForm);
            console.log(responseData);
            createAdminDisplaySucMsgForEmailVerify("OTP Verified Successfully");
        } catch (error) {
            handleVerifyEmailError(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleVerifyEmailError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter valid inputs fields");
        else if (Constants.OTP_NOT_MATCHED_FOR_MAIL === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter correct OTP for mail");
        else if (Constants.OTP_NOT_MATCHED_FOR_CONTACT === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter correct OTP for contact");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter correct OTP");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Your registration is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Sorry, Our service is down");
        else
            createAdminDisplayErrMsgForEmailVerify("Could not process your request");
    }

    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const createAdminDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const createAdminDisplaySucMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setMessageColor('green');
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            setShowModal(true);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [errMsgDivForEmailVerify, setErrMsgDivForEmailVerify] = useState(false);
    const [errMsgForEmailVerify, setErrMsgForEmailVerify] = useState("");
    const createAdminDisplayErrMsgForEmailVerify = (errorMessage) => {
        setErrMsgForEmailVerify(errorMessage);
        setErrMsgDivForEmailVerify(true);
        setTimeout(() => {
            setErrMsgForEmailVerify("");
            setErrMsgDivForEmailVerify(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const createAdminDisplaySucMsgForEmailVerify = (errorMessage) => {
        setErrMsgForEmailVerify(errorMessage);
        setErrMsgDivForEmailVerify(true);
        setMessageColor('green');
        setTimeout(() => {
            setErrMsgForEmailVerify("");
            setErrMsgDivForEmailVerify(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleCloseModal();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='create-admin'>
            {loadingBar && <LoadingBar />}
            <div className='admin-form'>
                <form onSubmit={handleCreateAdmin}>
                    <div>
                        <label>First Name</label>
                        <input
                            className='form-control'
                            placeholder='First Name'
                            name='userFirstname'
                            onChange={handleCreateAdminFormFields}
                            type='text'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Last Name</label>
                        <input
                            className='form-control'
                            placeholder='Last Name'
                            name='userLastname'
                            onChange={handleCreateAdminFormFields}
                            type='text'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Mail Id</label>
                        <input
                            className='form-control'
                            placeholder='Mail Id'
                            name='username'
                            onChange={handleCreateAdminFormFields}
                            type='email'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Contact Info</label>
                        <PhoneInput
                            forceDialCode={true}
                            onChange={handleContactInfo}
                            inputStyle={{ width: '100%' }}
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Password</label>
                        <input
                            className='form-control'
                            placeholder='Password'
                            name='password'
                            onChange={handleCreateAdminFormFields}
                            type='password'
                            required
                            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$"
                            title='Password should contain 1 uppercase, 1 digit, 1 Special Character, and length between 8-15.'
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Confirm Password</label>
                        <input
                            className='form-control'
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            onChange={handleCreateAdminFormFields}
                            type='password'
                            required
                        />
                    </div>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                    <div className='mt-2'>
                        <button
                            className='dashboard-button'
                            type='submit'
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <Modal className='admin-email-verify-modal' size='md' show={showModal} onHide={handleCloseModal} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Verify Email & Contact Number
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={verifyEmailSubmitForm}>
                                <div className="row">
                                    <div className="col-12">
                                        <label>Enter OTP sent to Admin Mail Id</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name="emailOtp"
                                            // value={verifyEmailForm.emailOtp}
                                            onChange={handleVerifyEmailFormData}
                                            pattern="\d{6}"
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mt-2">
                                        <label>Enter OTP sent to Admin Contact Number</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name="contactOtp"
                                            // value={verifyEmailForm.emailOtp}
                                            onChange={handleVerifyEmailFormData}
                                            pattern="\d{6}"
                                            required
                                        />
                                    </div>
                                </div>
                                {errMsgDivForEmailVerify &&
                                    <div style={customCssForMsg}>
                                        <label>{errMsgForEmailVerify}</label>
                                    </div>}
                                <div className="verify-button mt-2">
                                    <button type="submit" className="dashboard-button px-3">Verify</button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CreateAdmin;

/** ============================================================================================= */

/**
 * import { useState } from 'react';
import './CreateAdmin.css';
import Constants from '../../../../Constants';
import UserService from '../../../../../Services/user_service/UserService';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';
import { Container, Modal } from 'react-bootstrap';

function CreateAdmin() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [adminForm, setAdminForm] = useState({
        userFirstname: '',
        userLastname: '',
        username: '',
        password: '',
        confirmPassword: '',
        userType: Constants.ADMIN,
    });

    const handleCreateAdminFormFields = (e) => {
        const { name, value } = e.target;
        setAdminForm({
            ...adminForm,
            [name]: value
        });
    };

    const onlyLettersRegex = /^[A-Za-z]+$/;
    const passwordPatternRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$/;

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const matchConfirmPassword = adminForm.password === adminForm.confirmPassword;

        if (!onlyLettersRegex.test(adminForm.userFirstname)) {
            createAdminDisplayErrMsg("First Name is not matching the pattern");
        } else if (!onlyLettersRegex.test(adminForm.userLastname)) {
            createAdminDisplayErrMsg("Last Name is not matching the pattern");
        } else if (!((adminForm.username).slice(-4)).includes('.co')) {
            createAdminDisplayErrMsg("Please provide valid mail address");
        } else if (!passwordPatternRegex.test(adminForm.password)) {
            createAdminDisplayErrMsg("Password is not matching the pattern");
        } else if (!matchConfirmPassword) {
            createAdminDisplayErrMsg("Confirm Password not matching Password");
        } else {
            setLoadingBar(true);
            console.log(adminForm);
            try {
                const responseData = await UserService.registerUser(adminForm);
                console.log(responseData);
                verifyEmailForm.userId = responseData.userId;
                createAdminDisplaySucMsg('Admin Registered Successfully');
            } catch (error) {
                handleCreateAdminError(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    }
    const handleCreateAdminError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createAdminDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.EXISTING_USERNAME === errorStatus)
            createAdminDisplayErrMsg("Email-Id is already existed");
        else if (Constants.ADDRESS_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Please check, Email syntax");
        else if (Constants.MESSAGING_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Could not sent email, Please try again");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createAdminDisplayErrMsg("Sorry, Our service is down");
        else
            createAdminDisplayErrMsg("Could not process your request");
    }

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload();
    }

    const [verifyEmailForm, setVerifyEmailForm] = useState({
        userId: '',
        emailOtp: ''
    });
    const handleVerifyEmailFormData = (e) => {
        const { name, value } = e.target;
        setVerifyEmailForm({
            ...verifyEmailForm,
            [name]: value
        });
    };

    const verifyEmailSubmitForm = async (e) => {
        e.preventDefault();
        setLoadingBar(true);
        try {
            const responseData = await UserService.verifyEmail(verifyEmailForm);
            console.log(responseData);
            createAdminDisplaySucMsgForEmailVerify("OTP Verified Successfully");
        } catch (error) {
            handleVerifyEmailError(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleVerifyEmailError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter valid inputs fields");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Please enter correct OTP");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Your registration is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            createAdminDisplayErrMsgForEmailVerify("Sorry, Our service is down");
        else
            createAdminDisplayErrMsgForEmailVerify("Could not process your request");
    }

    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const createAdminDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const createAdminDisplaySucMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setMessageColor('green');
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            setShowModal(true);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const [errMsgDivForEmailVerify, setErrMsgDivForEmailVerify] = useState(false);
    const [errMsgForEmailVerify, setErrMsgForEmailVerify] = useState("");
    const createAdminDisplayErrMsgForEmailVerify = (errorMessage) => {
        setErrMsgForEmailVerify(errorMessage);
        setErrMsgDivForEmailVerify(true);
        setTimeout(() => {
            setErrMsgForEmailVerify("");
            setErrMsgDivForEmailVerify(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const createAdminDisplaySucMsgForEmailVerify = (errorMessage) => {
        setErrMsgForEmailVerify(errorMessage);
        setErrMsgDivForEmailVerify(true);
        setMessageColor('green');
        setTimeout(() => {
            setErrMsgForEmailVerify("");
            setErrMsgDivForEmailVerify(false);
            setMessageColor(Constants.MESSAGE_COLOR);
            handleCloseModal();
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='create-admin'>
            {loadingBar && <LoadingBar />}
            <div className='admin-form'>
                <form onSubmit={handleCreateAdmin}>
                    <div>
                        <label>First Name</label>
                        <input
                            className='form-control'
                            placeholder='First Name'
                            name='userFirstname'
                            onChange={handleCreateAdminFormFields}
                            type='text'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Last Name</label>
                        <input
                            className='form-control'
                            placeholder='Last Name'
                            name='userLastname'
                            onChange={handleCreateAdminFormFields}
                            type='text'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Mail Id</label>
                        <input
                            className='form-control'
                            placeholder='Mail Id'
                            name='username'
                            onChange={handleCreateAdminFormFields}
                            type='email'
                            required
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Password</label>
                        <input
                            className='form-control'
                            placeholder='Password'
                            name='password'
                            onChange={handleCreateAdminFormFields}
                            type='password'
                            required
                            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$"
                            title='Password should contain 1 uppercase, 1 digit, 1 Special Character, and length between 8-15.'
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Confirm Password</label>
                        <input
                            className='form-control'
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            onChange={handleCreateAdminFormFields}
                            type='password'
                            required
                        />
                    </div>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                    <div className='mt-2'>
                        <button
                            className='dashboard-button'
                            type='submit'
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <Modal className='admin-email-verify-modal' size='md' show={showModal} onHide={handleCloseModal} centered backdrop="static">
                    <Container className='px-5'>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '18px' }}>
                                Verify Email
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={verifyEmailSubmitForm}>
                                <div className="row">
                                    <div className="col">
                                        <label>Enter OTP sent to Admin Mail Id</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name="emailOtp"
                                            value={verifyEmailForm.emailOtp}
                                            onChange={handleVerifyEmailFormData}
                                            pattern="\d{6}"
                                            required
                                        />
                                    </div>
                                </div>
                                {errMsgDivForEmailVerify &&
                                    <div style={customCssForMsg}>
                                        <label>{errMsgForEmailVerify}</label>
                                    </div>}
                                <div className="verify-button mt-2">
                                    <button type="submit" className="dashboard-button px-3">Verify</button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Container>
                </Modal>
            )}
        </div>
    );
}

export default CreateAdmin; 
 */