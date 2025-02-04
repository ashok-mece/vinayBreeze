import './MandatoryUpdateFields.css';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
import { City, Country, State } from 'country-state-city';
import GlobalService from '../../../../Services/global_service/GlobalService';
import Constants from '../../../Constants';
import UserService from '../../../../Services/user_service/UserService';
import LoadingBar from '../../../loading_bar_component/LoadingBar';

function MandatoryUpdateFields() {

    const userId = localStorage.getItem("breezeUserId");
    const userType = localStorage.getItem("breezeUserType");

    const [loadingBar, setLoadingBar] = useState(false);

    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);

    const [showModal, setShowModal] = useState(true);
    const handleModalClose = () => setShowModal(false);

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const mandatoryUpdateFieldsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //JS for to display success msg
    const mandatoryUpdateFieldsDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor('#be3144');
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    // experience code
    const [experience, setExperience] = useState(0);
    const handleExperienceInput = (e) => setExperience(e.target.value);

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
        updateCountryWhenPhoneNumberChanged(country.country.iso2);
    }

    const updateCountryWhenPhoneNumberChanged = (selectedIso2Code) => {
        if (selectedIso2Code) {
            const countries = Country.getAllCountries();
            const foundCountry = countries.find(country => country.isoCode === selectedIso2Code.toUpperCase());
            if (foundCountry) {
                setSelectedCountry(foundCountry);
            }
        }
    }

    // gender code
    const [gender, setGender] = useState('');
    const genderList = [
        { name: 'Male' },
        { name: 'Female' },
        { name: 'Others' },
    ];
    const onSelectGender = (item) => {
        setGender(item.name);
    }

    // technology code
    const [technologies, setTechnologies] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const onSelectTechnology = (selectedList, selectedItem) => {
        setTechnologies([...selectedList]);
    }
    const onRemoveTechnology = (selectedList, removedItem) => {
        setTechnologies([...selectedList]);
    }

    useEffect(() => {
        const getAllTechnology = async () => {
            setLoadingBar(true);
            try {
                const responseData = await GlobalService.getAllTechnology();
                console.log(responseData);
                setTechnologiesList(responseData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingBar(false);
            }
        };
        getAllTechnology();
    }, []);

    // country state city code
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleMandatoryUpdateFieldsSubmit = async () => {
        console.log(userType);
        if (userType === Constants.EXPONENT && (technologies === null || technologies.length === 0 || technologies.length < 3)) {
            // console.log('Technologies array is null or empty.');
            mandatoryUpdateFieldsDisplayErrMsg('please choose your minimum 3 technical stacks');
        } else if (userType === Constants.EXPONENT && (experience === null || experience === '' || experience === undefined || experience === 0)) {
            console.log('experience is null or empty or greater than 50.');
            mandatoryUpdateFieldsDisplayErrMsg('please enter you experience');
        } else if (userType === Constants.EXPONENT && (experience === null || experience === 0 || experience > 50)) {
            console.log('experience is null or empty or greater than 50.');
            mandatoryUpdateFieldsDisplayErrMsg('experience should be less than or equal to 50');
        } else if (!isContactInfoVerified) {
            mandatoryUpdateFieldsDisplayErrMsg('verify your contact information');
        }  else if (phone === null || phone === '' || phone === undefined) {
            console.log('phone is null or empty.');
            mandatoryUpdateFieldsDisplayErrMsg('please enter your contact information');
        } else if (gender === null || gender === '') {
            console.log('Gender is null or empty.');
            mandatoryUpdateFieldsDisplayErrMsg('please select your gender');
        } else if (selectedCountry === null || selectedState === null || selectedCity === null) {
            console.log('location is null or empty.');
            mandatoryUpdateFieldsDisplayErrMsg('please select your country, state, city');
        } else {
            setLoadingBar(true);
            const request = {
                userId: userId,
                userType: userType,
                technologyList: technologies,
                phoneNumber: phone,
                countryCode: countryCode,
                phoneNumberWithCountryCode: phoneWithCountryCode,
                userExperience: experience,
                gender: gender,
                country: selectedCountry.name,
                state: selectedState.name,
                city: selectedCity.name,
            }
            console.log(request);
            try {
                const responseData = await UserService.mandatoryUpdateFields(request);
                console.log(responseData);
                localStorage.setItem('breezeUserFirstTimeLogin', responseData.firstTimeLogin);
                mandatoryUpdateFieldsDisplaySucMsg('Mandatory Fields Updated Successfully');
                setTimeout(() => {
                    handleModalClose();
                }, 2000);
            } catch (error) {
                handleMandatoryUpdateFieldsErrors(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    };

    const handleMandatoryUpdateFieldsErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("You are not registered");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            mandatoryUpdateFieldsDisplayErrMsg("Could not process your request");
    }

    const [isOtpSent, setIsOtpSent] = useState(false);
    const handleSendOtp = async () => {

        if (phone === null || phone === '' || phone === undefined) {
            mandatoryUpdateFieldsDisplayErrMsg("please enter your contact information");
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
                mandatoryUpdateFieldsDisplaySucMsg(responseData);
                setIsOtpSent(true);
            } catch (error) {
                handleSendOtpToPhoneNumberErrors(error.message);
                setIsOtpSent(false);
            } finally {
                setLoadingBar(false);
            } 
        }
    }

    const handleSendOtpToPhoneNumberErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Please enter valid contact information");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.INVALID_PHONE_NUMBER === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Entered Phone Number is Invalid");
        else if (Constants.OTP_NOT_SENT === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Failed to send otp");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            mandatoryUpdateFieldsDisplayErrMsg("Could not process your request");
    }

    const handleEditContactInfo = () => {
        setIsOtpSent(false);
    }

    const [otp, setOtp] = useState('');
    const handleOtpInput = (e) => setOtp(e.target.value);
    const [isContactInfoVerified, setIsContactInfoVerified] = useState(false);
    const handleVerifyOtp = async () => {
        if (otp === 0 || otp === null || otp === '' || otp === undefined) {
            mandatoryUpdateFieldsDisplayErrMsg("please enter otp");
        } else if (otp.length !== 6) {
            mandatoryUpdateFieldsDisplayErrMsg("invalid otp");
        } else {
            setLoadingBar(true);
            const request = {
                emailOtp: otp,
                userId: userId
            }
            console.log(request);
            try {
                const responseData = await UserService.verifyOtpToPhoneNumber(request);
                console.log(responseData);
                setIsContactInfoVerified(true);
            } catch (error) {
                handleVerifyOtpErrors(error.message);
                setIsContactInfoVerified(false);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const handleVerifyOtpErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Please enter valid otp");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Your are not registered");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Entered Otp is Incorrect");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            mandatoryUpdateFieldsDisplayErrMsg("Sorry, Our service is down");
        else
            mandatoryUpdateFieldsDisplayErrMsg("Could not process your request");
    }

    // custom css for mandatory input fields for Select component from react-select
    const customCssForMandUpdFlds = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? childColor : '',
            color: state.isFocused ? whiteColor : '',
            ':hover': {
                backgroundColor: childColor,
                color: whiteColor,
            },
        }),
    };

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div>
            {loadingBar && <LoadingBar />}
            <Modal className='mandatory-update-fields-modal' size='lg' show={showModal} onHide={handleModalClose} centered backdrop="static">
                <Container className='px-5'>
                    <Modal.Header>
                        <Modal.Title style={{ fontSize: '20px' }}>
                            Mandatory Fields
                        </Modal.Title>
                    </Modal.Header>
                </Container>
                <Modal.Body>
                    <Container className='px-5' style={{ fontSize: '15px' }}>
                        {userType === Constants.EXPONENT && (
                            <div>
                                <label><span style={{ color: 'red' }}>*</span>Technologies</label>
                                <Row>
                                    <Col>
                                        <div className='technology-multiselect'>
                                            <Multiselect
                                                id='technology'
                                                options={technologiesList}
                                                onSelect={onSelectTechnology}
                                                onRemove={onRemoveTechnology}
                                                displayValue="technologyName"
                                                placeholder="Your Technical Stack"
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
                        )}
                        <div className='mt-2'>
                            <label><span style={{ color: 'red' }}>*</span>Contact Info</label>
                            <Row>
                                <Col>
                                    <div className='contact-info' style={{ display: 'flex' }}>
                                        <PhoneInput
                                            forceDialCode={true}
                                            onChange={handleContactInfo}
                                            inputStyle={{ width: '100%' }}
                                            disabled={isOtpSent}
                                        />
                                        {!isContactInfoVerified && (
                                            <Button
                                                className='button-otp'
                                                onClick={handleSendOtp}
                                                disabled={isOtpSent}
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
                                        {(isOtpSent && !isContactInfoVerified) && (
                                            <Button
                                                className='button-otp'
                                                onClick={handleSendOtp}
                                            >
                                                ReSend
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {!isContactInfoVerified && (
                            isOtpSent && (
                                <div className='mt-2'>
                                    <label><span style={{ color: 'red' }}>*</span>Enter Otp</label>
                                    <Row>
                                        <Col>
                                            <div className='contact-info' style={{ display: 'flex' }}>
                                                <input
                                                    type='number'
                                                    placeholder='Enter Otp'
                                                    style={{ borderRadius: '4px' }}
                                                    value={otp}
                                                    onChange={handleOtpInput}
                                                />
                                                <Button
                                                    className='button-otp'
                                                    onClick={handleVerifyOtp}
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
                                {userType === Constants.EXPONENT && (
                                    <Col>
                                        <div className='experience'>
                                            <label><span style={{ color: 'red' }}>*</span>Experience</label>
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
                                )}
                                <Col>
                                    <div className='gender-singleselect'>
                                        <label><span style={{ color: 'red' }}>*</span>Gender</label>
                                        <Select
                                            id='gender'
                                            options={genderList}
                                            getOptionLabel={(options) => {
                                                return options["name"];
                                            }}
                                            getOptionValue={(options) => {
                                                return options["name"];
                                            }}
                                            onChange={onSelectGender}
                                            placeholder='Select Gender'
                                            styles={customCssForMandUpdFlds}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className='mt-2'>
                            <Row>
                                <Col>
                                    <div className='country'>
                                        <label><span style={{ color: 'red' }}>*</span>Country</label>
                                        <Select
                                            options={Country.getAllCountries()}
                                            getOptionLabel={(options) => {
                                                return options["name"];
                                            }}
                                            getOptionValue={(options) => {
                                                return options["name"];
                                            }}
                                            value={selectedCountry}
                                            onChange={(item) => {
                                                setSelectedCountry(item);
                                            }}
                                            placeholder='Select Country'
                                            styles={customCssForMandUpdFlds}
                                            isDisabled={true}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className='state'>
                                        <label><span style={{ color: 'red' }}>*</span>State</label>
                                        <Select
                                            options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                            getOptionLabel={(options) => {
                                                return options["name"];
                                            }}
                                            getOptionValue={(options) => {
                                                return options["name"];
                                            }}
                                            value={selectedState}
                                            onChange={(item) => {
                                                setSelectedState(item);
                                            }}
                                            placeholder='Select State'
                                            styles={customCssForMandUpdFlds}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className='city'>
                                        <label><span style={{ color: 'red' }}>*</span>City</label>
                                        <Select
                                            options={City.getCitiesOfState(
                                                selectedState?.countryCode,
                                                selectedState?.isoCode
                                            )}
                                            getOptionLabel={(options) => {
                                                return options["name"];
                                            }}
                                            getOptionValue={(options) => {
                                                return options["name"];
                                            }}
                                            value={selectedCity}
                                            onChange={(item) => {
                                                setSelectedCity(item);
                                            }}
                                            placeholder='Select City'
                                            styles={customCssForMandUpdFlds}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {/* <div>
                            <div className='mt-3'>
                                <label>
                                    <input
                                        type="checkbox"
                                        // checked={false}
                                    //   onChange={(e) => setConsentGiven(e.target.checked)}
                                    />
                                    {' '}I agree to receive text messages (e.g., mobile number verification with one time passcode) at the mobile number provided, and I acknowledge that message frequency may vary. Message and data rates may apply. View our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                                </label>
                            </div>
                            <div className='mt-3'>
                                <label>
                                    <input
                                        type="checkbox"
                                        // checked={false}
                                    //   onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                                    />
                                    {' '}I confirm that I am the owner or authorized user of the mobile number provided.
                                </label>
                            </div>
                            <div className='mt-3'>
                                <p>
                                    We respect your privacy and are committed to protecting your personal data. For more information, please read our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                                </p>
                            </div>
                        </div> */}
                        <div>
                            {errMsgDiv &&
                                <div style={customCssForMsg}>
                                    <label>{errMsg}</label>
                                </div>}
                        </div>
                        <Button
                            className='dashboard-button mt-3'
                            onClick={handleMandatoryUpdateFieldsSubmit}
                        >
                            Submit
                        </Button>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );

}

export default MandatoryUpdateFields;

/**<Multiselect
                                            id='gender'
                                            options={genderList}
                                            onSelect={onSelectGender}
                                            displayValue="name"
                                            placeholder="Select Your Gender"
                                            singleSelect={true}
                                            avoidHighlightFirstOption={true}
                                            style={{
                                                chips: {
                                                    color: whiteColor,
                                                    background: childColor,
                                                },
                                            }}
                                        /> */

/**
 *  <div>
            <Multiselect
                options={technologies} 
                onSelect={onSelect} 
                onRemove={onRemove} 
                displayValue="name"
                placeholder="Select Technical Stack"
            />
        </div>
 */

/**
 * {
                                multiselectContainer: { // To change css for multiselect (Width,height,etc..)
                                  
                                },
                                searchBox: { // To change search box element look
                                //   border: 'none',
                                //   fontSize: '10px',
                                //   minHeight: '50px',
                                },
                                inputField: { // To change input field position or margin
                                    // margin: '5px',
                                },
                                chips: { // To change css chips(Selected options)
                                  background: '#8CB9BD',
                                },
                                optionContainer: { // To change css for option container 
                                //   border: '2px solid',
                                },
                                option: { // To change css for dropdown options
                                //   color: 'black',
                                },
                                groupHeading: { // To chanage group heading style
                                  
                                }
                              }
 */

/**
 * <div>
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ...
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
 */